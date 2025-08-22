import { uploadFileToS3, uploadMultipleFilesToS3, FileUpload } from './s3Upload';
import { Prisma } from '@prisma/client';

// Types for the helper functions
export interface UploadedFiles {
  heroImage?: FileUpload[];
  screenshots?: FileUpload[];
}

export interface ScreenshotData {
  description?: string;
  order?: number;
}

export interface ProjectOverviewData {
  problem?: string;
  solution?: string;
  role?: string;
  impact?: string;
}

export interface ProjectMetricsData {
  launchDate?: string;
  duration?: string;
  teamSize?: string;
}

export interface TechnicalDetailsData {
  database?: string;
  api?: string;
  components?: string;
}

export interface ProjectArrayData {
  technologies?: (string | { name: string; reason?: string })[];
  lessons?: (string | { description: string })[];
  businessOutcomes?: (string | { description: string })[];
  improvements?: (string | { description: string })[];
  nextSteps?: (string | { description: string })[];
  futureTools?: (string | { name: string })[];
  performanceMetrics?: (string | { description: string })[];
}

export interface ScreenshotUploadResult {
  url: string;
  description: string;
  order: number;
  success: boolean;
}

export interface FileUploadResults {
  heroImageUrl: string;
  screenshotUrls: ScreenshotUploadResult[];
}

export const handleProjectFileUploads = async (
  files: UploadedFiles, 
  screenshots: ScreenshotData[]
): Promise<FileUploadResults> => {
  let heroImageUrl = '';
  let screenshotUrls: ScreenshotUploadResult[] = [];

  // Upload hero image
  if (files.heroImage && files.heroImage[0]) {
    const heroResult = await uploadFileToS3(files.heroImage[0], 'projects');

    if (!heroResult.success) {
      throw new Error(`Hero image upload failed: ${heroResult.error}`);
    }
    heroImageUrl = heroResult.url!;
  }

  // Upload multiple screenshots
  if (files.screenshots) {
    const screenshotResults = await uploadMultipleFilesToS3(files.screenshots, 'projects');
    
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

export const createProjectOverview = async (
  tx: Prisma.TransactionClient, 
  projectId: number, 
  data: ProjectOverviewData
): Promise<void> => {
  const { problem, solution, role, impact } = data;
  if (problem || solution || role || impact) {
    await tx.projectOverview.create({
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

export const createProjectMetrics = async (
  tx: Prisma.TransactionClient, 
  projectId: number, 
  data: ProjectMetricsData
): Promise<void> => {
  const { launchDate, duration, teamSize } = data;
  if (launchDate || duration || teamSize) {
    await tx.projectMetrics.create({
      data: {
        projectId,
        launchDate: launchDate || '',
        duration: duration || '',
        teamSize: teamSize || '',
      },
    });
  }
};

export const createTechnicalDetails = async (
  tx: Prisma.TransactionClient, 
  projectId: number, 
  data: TechnicalDetailsData
): Promise<void> => {
  const { database, api, components } = data;
  if (database || api || components) {
    await tx.technicalDetails.create({
      data: {
        projectId,
        database: database || '',
        api: api || '',
        components: components || '',
      },
    });
  }
};

export const createProjectArrayData = async (
  tx: Prisma.TransactionClient, 
  projectId: number, 
  data: ProjectArrayData
): Promise<void> => {
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
      const techData = typeof tech === 'string' 
        ? { name: tech, reason: '' }
        : { name: tech.name, reason: tech.reason || '' };
        
      await tx.technology.create({
        data: { projectId, name: techData.name, reason: techData.reason },
      });
    }
  }

  // Create lessons
  if (lessons && Array.isArray(lessons)) {
    for (const lesson of lessons) {
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
      const description = typeof metric === 'string' ? metric : metric.description;
      
      if (description) {
        await tx.performanceMetric.create({
          data: { projectId, description },
        });
      }
    }
  }
};

export const createProjectScreenshots = async (
  tx: Prisma.TransactionClient, 
  projectId: number, 
  screenshotUrls: ScreenshotUploadResult[]
): Promise<void> => {
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

export const createProjectTags = async (
  tx: Prisma.TransactionClient, 
  projectId: number, 
  tags: (string | { name: string })[]
): Promise<void> => {
  if (tags && Array.isArray(tags)) {
    for (const tagData of tags) {
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