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
  createProjectTags
} from '@/lib/utils/projectHelpers';
import { UploadedFiles } from '../types/projects';

export const createProject = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const formData = await req.formData();

    const getText = (key: string) => formData.get(key)?.toString() ?? '';

    const title = getText('title');
    const subtitle = getText('subtitle');
    const status = getText('status') as 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
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
    const search = searchParams.get('search');
    const technology = searchParams.get('technology');
    
   
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
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
      filteredProjects = projects.filter(project => 
        project.technologies.some(tech => 
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