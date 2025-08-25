import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { Prisma } from '@prisma/client';
import {
  handleProjectFileUploads,
  createProjectOverview,
  createProjectMetrics,
  createTechnicalDetails,
  createProjectArrayData,
  createProjectScreenshots,
  createProjectTags,
  ScreenshotUploadResult
} from '@/lib/utils/projectHelpers';
import { UploadedFiles } from '../types/projects';

export const createProject = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const formData = await req.formData();

    const getText = (key: string) => formData.get(key)?.toString() ?? '';

    const title = getText('title');
    const subtitle = getText('subtitle');
    const status = getText('status') as 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
    const type = getText('type') as 'PERSONAL' | 'FREELANCE' | 'DEVOPS';
    const liveDemo = getText('liveDemo');
    const github = getText('github');
    const caseStudy = getText('caseStudy');
    const publishedAt = getText('publishedAt');

    const heroImage = formData.get('heroImage') as File;
    const screenshots = formData.getAll('screenshots') as File[];

    const files: UploadedFiles = {};

    if (heroImage) {
      files.heroImage = [{
        buffer: Buffer.from(await heroImage.arrayBuffer()),
        originalname: heroImage.name,
        mimetype: heroImage.type,
        size: heroImage.size,
      }];
    }

    if (screenshots.length) {
      files.screenshots = [];
      for (const file of screenshots) {
        const buffer = Buffer.from(await file.arrayBuffer());
        files.screenshots.push({
          buffer,
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
        });
      }
    }

    const { heroImageUrl, screenshotUrls } = await handleProjectFileUploads(files, []);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const bodyData = {
      problem: getText('problem'),
      solution: getText('solution'),
      role: getText('role'),
      impact: getText('impact'),
      launchDate: getText('launchDate'),
      duration: getText('duration'),
      teamSize: getText('teamSize'),
      database: getText('database'),
      api: getText('api'),
      components: getText('components'),
    };

    const parseJSON = <T>(key: string): T => {
      try {
        return JSON.parse(getText(key) || '[]') as T;
      } catch {
        return [] as T;
      }
    };

    const technologies = parseJSON<string[]>('technologies');
    const tags = parseJSON<string[]>('tags');
    const lessons = parseJSON<string[]>('lessons');
    const businessOutcomes = parseJSON<string[]>('businessOutcomes');
    const improvements = parseJSON<string[]>('improvements');
    const nextSteps = parseJSON<string[]>('nextSteps');
    const futureTools = parseJSON<string[]>('futureTools');
    const performanceMetrics = parseJSON<string[]>('performanceMetrics');

    const project = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newProject = await tx.project.create({
        data: {
          title,
          subtitle,
          slug,
          status,
          type, 
          heroImage: heroImageUrl,
          liveDemo,
          github,
          caseStudy,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      await createProjectOverview(tx, newProject.id, bodyData);
      await createProjectMetrics(tx, newProject.id, bodyData);
      await createTechnicalDetails(tx, newProject.id, bodyData);
      await createProjectArrayData(tx, newProject.id, {
        technologies,
        lessons,
        businessOutcomes,
        improvements,
        nextSteps,
        futureTools,
        performanceMetrics
      });
      await createProjectScreenshots(tx, newProject.id, screenshotUrls);
      await createProjectTags(tx, newProject.id, tags);

      return newProject;
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create project',
    }, { status: 500 });
  }
};

export const getProjects = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    
    const status = searchParams.get('status');
    const type = searchParams.get('type'); 
    const search = searchParams.get('search');
    const technology = searchParams.get('technology');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }

    
    if (type) {
      whereClause.type = type;
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        overview: true,
        metrics: true,
        technicalDetails: true,
        screenshots: true,
        technologies: true,
        projectTags: {
          include: {
            tag: true
          }
        },
        lessons: true,
        businessOutcomes: true,
        improvements: true,
        nextSteps: true,
        futureTools: true,
        performanceMetrics: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

   let filteredProjects = projects;
    if (technology) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filteredProjects = projects.filter((project: any) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        project.technologies.some((tech: any) => 
          tech.name.toLowerCase().includes(technology.toLowerCase())
        )
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredProjects,
      count: filteredProjects.length 
    }, { status: 200 });

  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch projects',
    }, { status: 500 });
  }
};

export const getProjectById = async (id: string): Promise<NextResponse> => {
  try {
    const project = await prisma.project.findUnique({
      where: { 
        id: parseInt(id) 
      },
      include: {
        overview: true,
        metrics: true,
        technicalDetails: true,
        screenshots: true,
        technologies: true,
        projectTags: {
          include: {
            tag: true
          }
        },
        lessons: true,
        businessOutcomes: true,
        improvements: true,
        nextSteps: true,
        futureTools: true,
        performanceMetrics: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: project 
    }, { status: 200 });

  } catch (error) {
    console.error('Get project by ID error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch project',
    }, { status: 500 });
  }
};

export const updateProject = async (id: string, req: NextRequest): Promise<NextResponse> => {
  try {
    const projectId = parseInt(id);

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const getText = (key: string) => formData.get(key)?.toString() ?? '';

    const title = getText('title');
    const subtitle = getText('subtitle');
    const status = getText('status') as 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
    const type = getText('type') as 'PERSONAL' | 'FREELANCE' | 'DEVOPS';
    const liveDemo = getText('liveDemo');
    const github = getText('github');
    const caseStudy = getText('caseStudy');
    const publishedAt = getText('publishedAt');

    const heroImage = formData.get('heroImage') as File;
    const screenshots = formData.getAll('screenshots') as File[];

    let heroImageUrl = existingProject.heroImage; 
    let screenshotUrls: ScreenshotUploadResult[] = [];

    if (heroImage && heroImage.size > 0) {
      const files: UploadedFiles = {
        heroImage: [{
          buffer: Buffer.from(await heroImage.arrayBuffer()),
          originalname: heroImage.name,
          mimetype: heroImage.type,
          size: heroImage.size,
        }]
      };

      const uploadResult = await handleProjectFileUploads(files, []);
      heroImageUrl = uploadResult.heroImageUrl;
    }

    if (screenshots.length > 0) {
      const files: UploadedFiles = { screenshots: [] };
      for (const file of screenshots) {
        if (file.size > 0) {
          files.screenshots!.push({
            buffer: Buffer.from(await file.arrayBuffer()),
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
          });
        }
      }

      if (files.screenshots!.length > 0) {
        const uploadResult = await handleProjectFileUploads(files, []);
          screenshotUrls = uploadResult.screenshotUrls;
      }
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const bodyData = {
      problem: getText('problem'),
      solution: getText('solution'),
      role: getText('role'),
      impact: getText('impact'),
      launchDate: getText('launchDate'),
      duration: getText('duration'),
      teamSize: getText('teamSize'),
      database: getText('database'),
      api: getText('api'),
      components: getText('components'),
    };

    const parseJSON = <T>(key: string): T => {
      try {
        return JSON.parse(getText(key) || '[]') as T;
      } catch {
        return [] as T;
      }
    };

    const technologies = parseJSON<string[]>('technologies');
    const tags = parseJSON<string[]>('tags');
    const lessons = parseJSON<string[]>('lessons');
    const businessOutcomes = parseJSON<string[]>('businessOutcomes');
    const improvements = parseJSON<string[]>('improvements');
    const nextSteps = parseJSON<string[]>('nextSteps');
    const futureTools = parseJSON<string[]>('futureTools');
    const performanceMetrics = parseJSON<string[]>('performanceMetrics');

    const updatedProject = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const project = await tx.project.update({
        where: { id: projectId },
        data: {
          title,
          subtitle,
          slug,
          status,
          type,
          heroImage: heroImageUrl,
          liveDemo,
          github,
          caseStudy,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      await tx.projectOverview.deleteMany({ where: { projectId } });
      await tx.projectMetrics.deleteMany({ where: { projectId } });
      await tx.technicalDetails.deleteMany({ where: { projectId } });
      await tx.technology.deleteMany({ where: { projectId } });
      await tx.projectTag.deleteMany({ where: { projectId } });
      await tx.lesson.deleteMany({ where: { projectId } });
      await tx.businessOutcome.deleteMany({ where: { projectId } });
      await tx.improvement.deleteMany({ where: { projectId } });
      await tx.nextStep.deleteMany({ where: { projectId } });
      await tx.futureTool.deleteMany({ where: { projectId } });
      await tx.performanceMetric.deleteMany({ where: { projectId } });

      if (screenshotUrls.length > 0) {
        await tx.screenshot.deleteMany({ where: { projectId } });
      }

      await createProjectOverview(tx, projectId, bodyData);
      await createProjectMetrics(tx, projectId, bodyData);
      await createTechnicalDetails(tx, projectId, bodyData);
      await createProjectArrayData(tx, projectId, {
        technologies,
        lessons,
        businessOutcomes,
        improvements,
        nextSteps,
        futureTools,
        performanceMetrics
      });
      
      if (screenshotUrls.length > 0) {
        await createProjectScreenshots(tx, projectId, screenshotUrls);
      }
      
      await createProjectTags(tx, projectId, tags);

      return project;
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedProject 
    }, { status: 200 });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to update project',
    }, { status: 500 });
  }
};

export const deleteProject = async (id: string): Promise<NextResponse> => {
  try {
    const projectId = parseInt(id);

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to delete project',
    }, { status: 500 });
  }
};

export const getProjectBySlug = async (slug: string): Promise<NextResponse> => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        overview: true,
        metrics: true,
        technicalDetails: true,
        screenshots: {
          orderBy: { order: 'asc' }
        },
        technologies: true,
        projectTags: {
          include: {
            tag: true
          }
        },
        lessons: true,
        businessOutcomes: true,
        improvements: true,
        nextSteps: true,
        futureTools: true,
        performanceMetrics: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);

  } catch (error) {
    console.error('Get project by slug error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
};

export const updateProjectBySlug = async (req: NextRequest, slug: string): Promise<NextResponse> => {
  try {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const getText = (key: string) => formData.get(key)?.toString() ?? '';

    // Add parsing logic
    const parseJSON = <T>(key: string): T => {
      try {
        return JSON.parse(getText(key) || '[]') as T;
      } catch {
        return [] as T;
      }
    };

    const title = getText('title');
    const subtitle = getText('subtitle');
    const status = getText('status') as 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
    const type = getText('type') as 'PERSONAL' | 'FREELANCE' | 'DEVOPS';
    const liveDemo = getText('liveDemo');
    const github = getText('github');
    const caseStudy = getText('caseStudy');
    const publishedAt = getText('publishedAt');

    // Parse array data
    const technologies = parseJSON<string[]>('technologies');
    const tags = parseJSON<string[]>('tags');
    const lessons = parseJSON<string[]>('lessons');
    const businessOutcomes = parseJSON<string[]>('businessOutcomes');
    const improvements = parseJSON<string[]>('improvements');
    const nextSteps = parseJSON<string[]>('nextSteps');
    const futureTools = parseJSON<string[]>('futureTools');
    const performanceMetrics = parseJSON<string[]>('performanceMetrics');

    const heroImage = formData.get('heroImage') as File;
    const screenshots = formData.getAll('screenshots') as File[];

    const files: UploadedFiles = {};

    if (heroImage && heroImage.size > 0) {
      files.heroImage = [{
        buffer: Buffer.from(await heroImage.arrayBuffer()),
        originalname: heroImage.name,
        mimetype: heroImage.type,
        size: heroImage.size,
      }];
    }

    if (screenshots.length && screenshots[0].size > 0) {
      files.screenshots = [];
      for (const file of screenshots) {
        const buffer = Buffer.from(await file.arrayBuffer());
        files.screenshots.push({
          buffer,
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
        });
      }
    }

    // Generate new slug from title if title changed
    let newSlug = slug; // Keep existing slug by default
    if (title && title !== existingProject.title) {
      newSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if new slug already exists (and it's not the current project)
      const existingSlugProject = await prisma.project.findUnique({
        where: { slug: newSlug },
      });
      
      if (existingSlugProject && existingSlugProject.slug !== slug) {
        // Add timestamp to make it unique
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    // Handle file uploads
    const uploadedFiles = await handleProjectFileUploads(files, []);

    // Start transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // Update main project data
      const updatedProject = await tx.project.update({
        where: { slug },
        data: {
          title,
          subtitle,
          slug: newSlug,
          status,
          type,
          heroImage: uploadedFiles.heroImageUrl || existingProject.heroImage,
          liveDemo: liveDemo || null,
          github: github || null,
          caseStudy: caseStudy || null,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      const projectId = updatedProject.id;

      // Update or create project overview
      const overviewData = {
        problem: getText('problem'),
        solution: getText('solution'),
        role: getText('role'),
        impact: getText('impact'),
      };

      await tx.projectOverview.upsert({
        where: { projectId },
        update: overviewData,
        create: { ...overviewData, projectId },
      });

      // Update or create project metrics
      const metricsData = {
        launchDate: getText('launchDate'),
        duration: getText('duration'),
        teamSize: getText('teamSize'),
      };

      await tx.projectMetrics.upsert({
        where: { projectId },
        update: metricsData,
        create: { ...metricsData, projectId },
      });

      // Update or create technical details
      const technicalData = {
        database: getText('database'),
        api: getText('api'),
        components: getText('components'),
      };

      await tx.technicalDetails.upsert({
        where: { projectId },
        update: technicalData,
        create: { ...technicalData, projectId },
      });

      // Delete existing related data and recreate (simpler approach for arrays)
      await tx.technology.deleteMany({ where: { projectId } });
      await tx.lesson.deleteMany({ where: { projectId } });
      await tx.businessOutcome.deleteMany({ where: { projectId } });
      await tx.improvement.deleteMany({ where: { projectId } });
      await tx.nextStep.deleteMany({ where: { projectId } });
      await tx.futureTool.deleteMany({ where: { projectId } });
      await tx.performanceMetric.deleteMany({ where: { projectId } });
      await tx.projectTag.deleteMany({ where: { projectId } });
      
      // Only delete screenshots if new ones are provided
      if (uploadedFiles.screenshotUrls) {
        await tx.screenshot.deleteMany({ where: { projectId } });
      }

      // Create array data with parsed values
      await createProjectArrayData(tx, projectId, {
        technologies,
        lessons,
        businessOutcomes,
        improvements,
        nextSteps,
        futureTools,
        performanceMetrics
      });
      
      if (uploadedFiles.screenshotUrls) {
        await createProjectScreenshots(tx, projectId, uploadedFiles.screenshotUrls);
      }

      await createProjectTags(tx, projectId, tags);

      return updatedProject;
    });

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: result,
      newSlug: newSlug, // Return new slug in case it changed
    });

  } catch (error) {
    console.error('Update project error:', error);
    
    // Check for unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A project with this title already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
};

export const deleteProjectBySlug = async (slug: string): Promise<NextResponse> => {
  try {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete project (cascade will handle related data)
    await prisma.project.delete({
      where: { slug },
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
};

export const getProjectsForCards = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    
    const status = searchParams.get('status');
    const type = searchParams.get('type'); 
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured'); // For featured projects only
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};
    
    // Default to only LIVE projects for cards unless specified
    if (status) {
      whereClause.status = status;
    } else if (featured === 'true') {
      whereClause.status = 'LIVE'; // Featured projects should be live
    }

    if (type) {
      whereClause.type = type;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        status: true,
        type: true,
        heroImage: true,
        liveDemo: true,
        github: true,
        createdAt: true,
        overview: {
          select: {
            impact: true,
            problem: true,
          }
        },
       
        technologies: {
          select: {
            name: true,
          },
          take: 3,
        },
        projectTags: {
          select: {
            tag: {
              select: {
                name: true,
                slug: true,
              }
            }
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ 
      success: true, 
      data: projects,
      count: projects.length 
    }, { status: 200 });

  } catch (error) {
    console.error('Get projects for cards error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch projects for cards',
    }, { status: 500 });
  }
};