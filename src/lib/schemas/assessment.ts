import { z } from 'zod';

export const assessmentContentBlockSchema = z.object({
  id: z.string(),
  type: z.enum(['PARAGRAPH', 'HEADING']),
  content: z.string().min(1, 'Content is required'),
  order: z.number(),
  level: z.number().min(1).max(6).optional(), 
});

export const assessmentFormSchema = z.object({
  
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  publishedAt: z.string().optional(),

 
  mainImage: z.any().optional(),
  images: z.array(z.any()).optional(),
  files: z.array(z.any()).optional(),

  
  contentBlocks: z.array(assessmentContentBlockSchema).default([]),

  
  technologies: z.array(z.object({
    name: z.string().min(1, 'Technology name is required'),
    reason: z.string().optional()
  })).default([]),

  
  tags: z.array(z.string()).default([]),

  
  imageDescriptions: z.array(z.string()).optional(),
  imageAlts: z.array(z.string()).optional(),
  imageCaptions: z.array(z.string()).optional(),
  fileNames: z.array(z.string()).optional(),
});

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>;
export type AssessmentContentBlockData = z.infer<typeof assessmentContentBlockSchema>;


export const createAssessmentContentBlock = (
  type: AssessmentContentBlockData['type'],
  content: string,
  order: number,
  options?: Partial<Omit<AssessmentContentBlockData, 'id' | 'type' | 'content' | 'order'>>
): AssessmentContentBlockData => {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content,
    order,
    ...options,
  };
};