import { z } from 'zod';

export const projectFormSchema = z.object({
  // Basic Information
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  subtitle: z.string().min(1, 'Subtitle is required').max(200, 'Subtitle too long'),
  status: z.enum(['LIVE', 'IN_PROGRESS', 'ARCHIVED']),
  publishedAt: z.string().optional(),
  type: z.enum(['PERSONAL', 'FREELANCE', 'DEVOPS']),

  // Media
  heroImage: z.any().optional(), 
  screenshots: z.array(z.any()).optional(), 

  // Links
liveDemo: z.string().url('Invalid URL').or(z.literal('')).optional(),
  github: z.string().url('Invalid URL').or(z.literal('')).optional(),
  caseStudy: z.string().url('Invalid URL').or(z.literal('')).optional(),
  // Project Overview
  problem: z.string().min(1, 'Problem description is required'),
  solution: z.string().min(1, 'Solution description is required'),
  role: z.string().min(1, 'Role description is required'),
  impact: z.string().min(1, 'Impact description is required'),

  // Technical Details
  technologies: z.array(z.object({
    name: z.string().min(1, 'Technology name is required'),
    reason: z.string().min(1, 'Reason is required')
  })).min(1, 'At least one technology is required'),
  
  database: z.string().min(1, 'Database information is required'),
  api: z.string().min(1, 'API information is required'),
  components: z.string().min(1, 'Components information is required'),

  // Project Metrics
  launchDate: z.string().min(1, 'Launch date is required'),
  duration: z.string().min(1, 'Duration is required'),
  teamSize: z.string().min(1, 'Team size is required'),

  // Learning & Outcomes (arrays of strings)
  lessons: z.array(z.string().min(1, 'Lesson cannot be empty')).optional(),
  businessOutcomes: z.array(z.string().min(1, 'Business outcome cannot be empty')).optional(),
  improvements: z.array(z.string().min(1, 'Improvement cannot be empty')).optional(),
  nextSteps: z.array(z.string().min(1, 'Next step cannot be empty')).optional(),
  futureTools: z.array(z.string().min(1, 'Future tool cannot be empty')).optional(),
  performanceMetrics: z.array(z.string().min(1, 'Performance metric cannot be empty')).optional(),

  // Tags
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;