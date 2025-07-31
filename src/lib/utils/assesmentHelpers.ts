import { prisma } from '@/lib/prisma/client';
import { uploadFileToS3, uploadMultipleFilesToS3, FileUpload } from '@/lib/utils/s3Upload';

interface UploadedAssessmentFiles {
  mainImage?: string;
  images?: string[];
  files?: Array<{ url: string; name: string; size: number; mimeType: string }>;
}

export const handleAssessmentFileUploads = async (files: {
  mainImage?: FileUpload[];
  images?: FileUpload[];
  files?: FileUpload[];
}, fileNames: string[] = []): Promise<UploadedAssessmentFiles> => {
  const result: UploadedAssessmentFiles = {};

  try {
    // Upload main image
    if (files.mainImage && files.mainImage[0]) {
      const mainImageResult = await uploadFileToS3(files.mainImage[0], 'assessments');
      if (!mainImageResult.success) {
        throw new Error(`Main image upload failed: ${mainImageResult.error}`);
      }
      result.mainImage = mainImageResult.url!;
    }

    // Upload multiple images
    if (files.images && files.images.length > 0) {
      const imageResults = await uploadMultipleFilesToS3(files.images, 'assessments');
      result.images = imageResults.map(result => result.url!).filter(Boolean);
    }

    // Upload files
    if (files.files && files.files.length > 0) {
      
      const fileResults = await uploadMultipleFilesToS3(files.files, 'assessments');
      
      
      result.files = fileResults.map((uploadResult, index) => ({
        url: uploadResult.url!,
        name: fileNames[index] || files.files![index].originalname,
        size: files.files![index].size,
        mimeType: files.files![index].mimetype,
      })).filter(file => file.url);

      
    }

    return result;
  } catch (error) {
    console.error('Assessment file upload error:', error);
    throw error;
  }
};

// Función para crear tecnologías reutilizando la lógica de projects
export const createAssessmentTechnologies = async (
  tx: typeof prisma, 
  assessmentId: number, 
  technologies: Array<{ name: string; reason?: string }>
): Promise<void> => {
  if (technologies && Array.isArray(technologies) && technologies.length > 0) {
    for (const tech of technologies) {
      if (tech.name && tech.name.trim()) {
        await tx.technology.create({
          data: {
            assessmentId,
            name: tech.name.trim(),
            reason: tech.reason || null,
          },
        });
      }
    }
  }
};

export const createAssessmentTags = async (
  tx: typeof prisma, 
  assessmentId: number, 
  tags: string[]
): Promise<void> => {
  if (tags && Array.isArray(tags) && tags.length > 0) {
    for (const tagName of tags) {
      if (tagName && tagName.trim()) {
        // Reutilizar el modelo Tag existente
        const tag = await tx.tag.upsert({
          where: { name: tagName.trim() },
          update: {},
          create: {
            name: tagName.trim(),
            slug: tagName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          },
        });

        await tx.assessmentTag.create({
          data: { 
            assessmentId, 
            tagId: tag.id 
          },
        });
      }
    }
  }
};

export const createAssessmentContentBlocks = async (
  tx: typeof prisma, 
  assessmentId: number, 
  contentBlocks: Array<{
    type: 'PARAGRAPH' | 'HEADING';
    content: string;
    order: number;
    level?: number;
  }>
): Promise<void> => {
  if (contentBlocks && Array.isArray(contentBlocks) && contentBlocks.length > 0) {
    const blocksToCreate = contentBlocks.map((block, index) => ({
      assessmentId,
      type: block.type,
      content: block.content || '',
      order: block.order || index,
      level: block.level || null,
    }));

    await tx.assessmentContentBlock.createMany({
      data: blocksToCreate,
    });
  }
};

export const createAssessmentImages = async (
  tx: typeof prisma, 
  assessmentId: number, 
  images: string[], 
  descriptions: string[] = [], 
  alts: string[] = [], 
  captions: string[] = []
): Promise<void> => {
  if (images && images.length > 0) {
    const imagesToCreate = images.map((url, index) => ({
      assessmentId,
      url,
      alt: alts[index] || descriptions[index] || '',
      caption: captions[index] || descriptions[index] || '',
      order: index,
    }));

    await tx.assessmentImage.createMany({
      data: imagesToCreate,
    });
  }
};

export const createAssessmentFiles = async (
  tx: typeof prisma, 
  assessmentId: number, 
  files: Array<{ url: string; name: string; size: number; mimeType: string }>
): Promise<void> => {
    
  if (files && files.length > 0) {
    const filesToCreate = files.map((file, index) => ({
      assessmentId,
      name: file.name,
      url: file.url,
      size: file.size,
      mimeType: file.mimeType,
      order: index,
    }));

    await tx.assessmentFile.createMany({
      data: filesToCreate,
    });
  }
};