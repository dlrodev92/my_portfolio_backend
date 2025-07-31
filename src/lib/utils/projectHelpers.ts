import { prisma } from '@/lib/prisma/client';
import { uploadFileToS3, uploadMultipleFilesToS3 } from './s3Upload';

export const handleProjectFileUploads = async (files: any, screenshots: any[]) => {
  let heroImageUrl = '';
  let screenshotUrls: any[] = [];

  // Upload hero image
  if (files.heroImage && files.heroImage[0]) {
    const heroResult = await uploadFileToS3({
      buffer: files.heroImage[0].buffer,
      originalname: files.heroImage[0].originalname,
      mimetype: files.heroImage[0].mimetype,
      size: files.heroImage[0].size,
    }, 'projects');

    if (!heroResult.success) {
      throw new Error(`Hero image upload failed: ${heroResult.error}`);
    }
    heroImageUrl = heroResult.url!;
  }

  // Upload multiple screenshots
  if (files.screenshots) {
    const screenshotFiles = files.screenshots.map((file: any) => ({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    const screenshotResults = await uploadMultipleFilesToS3(screenshotFiles, 'projects');
    
    screenshotUrls = screenshotResults.map((result, index) => ({
      url: result.url || '',
      description: screenshots?.[index]?.description || '',
      order: screenshots?.[index]?.order || index,
      success: result.success,
    }));

    const failedUploads = screenshotUrls.filter(s => !s.success);
    if (failedUploads.length > 0) {
      throw new Error('Some screenshot uploads failed');
    }
  }

  return { heroImageUrl, screenshotUrls };
};

export const createProjectOverview = async (tx: any, projectId: number, data: any) => {
  const { problem, solution, role, impact } = data;
  if (problem || solution || role || impact) {
    return await tx.projectOverview.create({
      data: {
        projectId,
        problem: problem || '',
        solution: solution || '',
        role: role || '',
        impact: impact || '',
      },
    });
  }
};

export const createProjectMetrics = async (tx: any, projectId: number, data: any) => {
  const { launchDate, duration, teamSize } = data;
  if (launchDate || duration || teamSize) {
    return await tx.projectMetrics.create({
      data: {
        projectId,
        launchDate: launchDate || '',
        duration: duration || '',
        teamSize: teamSize || '',
      },
    });
  }
};

export const createTechnicalDetails = async (tx: any, projectId: number, data: any) => {
  const { database, api, components } = data;
  if (database || api || components) {
    return await tx.technicalDetails.create({
      data: {
        projectId,
        database: database || '',
        api: api || '',
        components: components || '',
      },
    });
  }
};

export const createProjectArrayData = async (tx: any, projectId: number, data: any) => {
  const { 
    technologies, 
    lessons, 
    businessOutcomes, 
    improvements, 
    nextSteps, 
    futureTools, 
    performanceMetrics 
  } = data;

  // Create technologies
  if (technologies && Array.isArray(technologies)) {
    for (const tech of technologies) {
      // Handle both string format and object format
      const techData = typeof tech === 'string' 
        ? { name: tech, reason: '' }
        : { name: tech.name || tech, reason: tech.reason || '' };
        
      await tx.technology.create({
        data: { projectId, name: techData.name, reason: techData.reason },
      });
    }
  }

  // Create lessons
  if (lessons && Array.isArray(lessons)) {
    for (const lesson of lessons) {
      // Handle both string format and object format
      const description = typeof lesson === 'string' ? lesson : lesson.description;
      
      if (description) {
        await tx.lesson.create({
          data: { projectId, description },
        });
      }
    }
  }

  // Create business outcomes
  if (businessOutcomes && Array.isArray(businessOutcomes)) {
    for (const outcome of businessOutcomes) {
      // Handle both string format and object format
      const description = typeof outcome === 'string' ? outcome : outcome.description;
      
      if (description) {
        await tx.businessOutcome.create({
          data: { projectId, description },
        });
      }
    }
  }

  // Create improvements
  if (improvements && Array.isArray(improvements)) {
    for (const improvement of improvements) {
      // Handle both string format and object format
      const description = typeof improvement === 'string' ? improvement : improvement.description;
      
      if (description) {
        await tx.improvement.create({
          data: { projectId, description },
        });
      }
    }
  }

  // Create next steps
  if (nextSteps && Array.isArray(nextSteps)) {
    for (const step of nextSteps) {
      // Handle both string format and object format
      const description = typeof step === 'string' ? step : step.description;
      
      if (description) {
        await tx.nextStep.create({
          data: { projectId, description },
        });
      }
    }
  }

  // Create future tools
  if (futureTools && Array.isArray(futureTools)) {
    for (const tool of futureTools) {
      // Handle both string format and object format
      const name = typeof tool === 'string' ? tool : tool.name;
      
      if (name) {
        await tx.futureTool.create({
          data: { projectId, name },
        });
      }
    }
  }

  // Create performance metrics
  if (performanceMetrics && Array.isArray(performanceMetrics)) {
    for (const metric of performanceMetrics) {
      // Handle both string format and object format
      const description = typeof metric === 'string' ? metric : metric.description;
      
      if (description) {
        await tx.performanceMetric.create({
          data: { projectId, description },
        });
      }
    }
  }
};

export const createProjectScreenshots = async (tx: any, projectId: number, screenshotUrls: any[]) => {
  if (screenshotUrls.length > 0) {
    for (const screenshot of screenshotUrls) {
      await tx.screenshot.create({
        data: {
          projectId,
          url: screenshot.url,
          description: screenshot.description,
          order: screenshot.order,
        },
      });
    }
  }
};

export const createProjectTags = async (tx: any, projectId: number, tags: any[]) => {
  if (tags && Array.isArray(tags)) {
    for (const tagData of tags) {
      // Handle both string format and object format
      const tagName = typeof tagData === 'string' ? tagData : tagData.name;
      
      if (tagName) {
        // Create or find existing tag
        const tag = await tx.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
        });

        // Connect tag to project
        await tx.projectTag.create({
          data: { projectId, tagId: tag.id },
        });
      }
    }
  }
};
