import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { Prisma } from '@prisma/client';
import { FileUpload } from '@/lib/utils/s3Upload';
import {
  handleAssessmentFileUploads,
  createAssessmentTags,
  createAssessmentContentBlocks,
  createAssessmentImages,
  createAssessmentFiles,
  createAssessmentTechnologies
} from '@/lib/utils/assesmentHelpers';

interface AssessmentUploadedFiles {
  mainImage?: FileUpload[];
  images?: FileUpload[];
  files?: FileUpload[];
}

export const getAssessments = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const techs = searchParams.get('techs')?.split(',').filter(Boolean) || [];

    const where: Prisma.AssessmentWhereInput = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
        tags.length > 0 ? {
          assessmentTags: {
            some: {
              tag: {
                name: { in: tags }
              }
            }
          }
        } : {},
        techs.length > 0 ? {
          technologies: {
            some: {
              name: { in: techs }
            }
          }
        } : {}
      ]
    };

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        assessmentTags: {
          include: {
            tag: true
          }
        },
        technologies: true,
        _count: {
          select: {
            contentBlocks: true,
            images: true,
            files: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Get assessments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
};

export const createAssessment = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const formData = await req.formData();
    const getText = (key: string) => formData.get(key)?.toString() ?? '';
    const getJson = (key: string) => {
      const value = formData.get(key)?.toString();
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    };

    const title = getText('title');
    const description = getText('description');
    const publishedAt = getText('publishedAt');
    
    const contentBlocks = getJson('contentBlocks') || [];
    const technologies = getJson('technologies') || [];
    const tags = getJson('tags') || [];
    const imageDescriptions = getJson('imageDescriptions') || [];
    const imageAlts = getJson('imageAlts') || [];
    const imageCaptions = getJson('imageCaptions') || [];
    const fileNames = getJson('fileNames') || [];

    const mainImage = formData.get('mainImage') as File;
    const images = formData.getAll('images') as File[];
    const files = formData.getAll('files') as File[];

    const uploadFiles: AssessmentUploadedFiles = {};

    
    if (mainImage && mainImage.size > 0) {
      uploadFiles.mainImage = [{
        buffer: Buffer.from(await mainImage.arrayBuffer()),
        originalname: mainImage.name,
        mimetype: mainImage.type,
        size: mainImage.size,
      }];
    }

    if (images.length && images[0].size > 0) {
      uploadFiles.images = [];
      for (const file of images) {
        uploadFiles.images.push({
          buffer: Buffer.from(await file.arrayBuffer()),
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
        });
      }
    }

    if (files.length && files[0].size > 0) {
       
      uploadFiles.files = [];
      for (const file of files) {
        uploadFiles.files.push({
          buffer: Buffer.from(await file.arrayBuffer()),
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
        });
      }
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Handle file uploads
    const uploadedFiles = await handleAssessmentFileUploads(uploadFiles, fileNames);
  

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create main assessment
      const createdAssessment = await tx.assessment.create({
        data: {
          title,
          description,
          slug,
          mainImage: uploadedFiles.mainImage || null,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      const assessmentId = createdAssessment.id;

      // Create content blocks
      await createAssessmentContentBlocks(tx, assessmentId, contentBlocks);

      // Create technologies
      await createAssessmentTechnologies(tx, assessmentId, technologies);

      // Create images
      if (uploadedFiles.images) {
        await createAssessmentImages(tx, assessmentId, uploadedFiles.images, imageDescriptions, imageAlts, imageCaptions);
      }

      // Create files
      if (uploadedFiles.files) {
        await createAssessmentFiles(tx, assessmentId, uploadedFiles.files);
      }

      // Create tags
      await createAssessmentTags(tx, assessmentId, tags);

      return createdAssessment;
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment created successfully',
      assessment: result,
    });

  } catch (error) {
    console.error('Create assessment error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'An assessment with this title already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
};

export const getAssessmentBySlug = async (slug: string): Promise<NextResponse> => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { slug },
      include: {
        contentBlocks: {
          orderBy: { order: 'asc' }
        },
        technologies: true,
        images: {
          orderBy: { order: 'asc' }
        },
        files: {
          orderBy: { order: 'asc' }
        },
        assessmentTags: {
          include: {
            tag: true
          }
        },
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);

  } catch (error) {
    console.error('Get assessment by slug error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
};

export const updateAssessmentBySlug = async (req: NextRequest, slug: string): Promise<NextResponse> => {
  try {
    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { slug },
    });

    if (!existingAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const getText = (key: string) => formData.get(key)?.toString() ?? '';
    const getJson = (key: string) => {
      const value = formData.get(key)?.toString();
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    };

    const title = getText('title');
    const description = getText('description');
    const publishedAt = getText('publishedAt');
    
    const contentBlocks = getJson('contentBlocks') || [];
    const technologies = getJson('technologies') || [];
    const tags = getJson('tags') || [];
    const imageDescriptions = getJson('imageDescriptions') || [];
    const imageAlts = getJson('imageAlts') || [];
    const imageCaptions = getJson('imageCaptions') || [];
    const fileNames = getJson('fileNames') || [];

    const mainImage = formData.get('mainImage') as File;
    const images = formData.getAll('images') as File[];
    const files = formData.getAll('files') as File[];

    const uploadFiles: AssessmentUploadedFiles = {};

    if (mainImage && mainImage.size > 0) {
      uploadFiles.mainImage = [{
        buffer: Buffer.from(await mainImage.arrayBuffer()),
        originalname: mainImage.name,
        mimetype: mainImage.type,
        size: mainImage.size,
      }];
    }

    if (images.length && images[0].size > 0) {
      uploadFiles.images = [];
      for (const file of images) {
        uploadFiles.images.push({
          buffer: Buffer.from(await file.arrayBuffer()),
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
        });
      }
    }

    if (files.length && files[0].size > 0) {
      uploadFiles.files = [];
      for (const file of files) {
        uploadFiles.files.push({
          buffer: Buffer.from(await file.arrayBuffer()),
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
        });
      }
    }

    // Generate new slug from title if title changed
    let newSlug = slug;
    if (title && title !== existingAssessment.title) {
      newSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const existingSlugAssessment = await prisma.assessment.findUnique({
        where: { slug: newSlug },
      });
      
      if (existingSlugAssessment && existingSlugAssessment.slug !== slug) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    // Handle file uploads
    const uploadedFiles = await handleAssessmentFileUploads(uploadFiles, fileNames);

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update main assessment
      const updatedAssessment = await tx.assessment.update({
        where: { slug },
        data: {
          title,
          description,
          slug: newSlug,
          mainImage: uploadedFiles.mainImage || existingAssessment.mainImage,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      const assessmentId = updatedAssessment.id;

      // Delete existing related data and recreate
      await tx.assessmentContentBlock.deleteMany({ where: { assessmentId } });
      await tx.technology.deleteMany({ where: { assessmentId } });
      await tx.assessmentTag.deleteMany({ where: { assessmentId } });
      
      // Only delete images/files if new ones are provided
      if (uploadedFiles.images) {
        await tx.assessmentImage.deleteMany({ where: { assessmentId } });
      }
      if (uploadedFiles.files) {
        await tx.assessmentFile.deleteMany({ where: { assessmentId } });
      }

      // Recreate content blocks
      await createAssessmentContentBlocks(tx, assessmentId, contentBlocks);

      // Recreate technologies
      await createAssessmentTechnologies(tx, assessmentId, technologies);

      // Recreate images if provided
      if (uploadedFiles.images) {
        await createAssessmentImages(tx, assessmentId, uploadedFiles.images, imageDescriptions, imageAlts, imageCaptions);
      }

      // Recreate files if provided
      if (uploadedFiles.files) {
        await createAssessmentFiles(tx, assessmentId, uploadedFiles.files);
      }

      // Recreate tags
      await createAssessmentTags(tx, assessmentId, tags);

      return updatedAssessment;
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment updated successfully',
      assessment: result,
      newSlug: newSlug,
    });

  } catch (error) {
    console.error('Update assessment error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'An assessment with this title already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    );
  }
};

export const deleteAssessmentBySlug = async (slug: string): Promise<NextResponse> => {
  try {
    const existingAssessment = await prisma.assessment.findUnique({
      where: { slug },
    });

    if (!existingAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    await prisma.assessment.delete({
      where: { slug },
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment deleted successfully',
    });

  } catch (error) {
    console.error('Delete assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to delete assessment' },
      { status: 500 }
    );
  }
};