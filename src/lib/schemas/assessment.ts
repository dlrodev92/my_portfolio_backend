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
  publishedAt: z.string().datetime().optional(),

  mainImage: z.union([z.string(), z.instanceof(File)]).optional(),
  images: z.array(z.union([z.string(), z.instanceof(File)])),
  files: z.array(z.union([z.string(), z.instanceof(File)])),

  contentBlocks: z.array(assessmentContentBlockSchema),

  technologies: z.array(z.object({
    name: z.string().min(1, 'Technology name is required'),
    reason: z.string().optional()
  })),

  tags: z.array(z.string()),

  imageDescriptions: z.array(z.string()),
  imageAlts: z.array(z.string()),
  imageCaptions: z.array(z.string()),
  fileNames: z.array(z.string()),
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