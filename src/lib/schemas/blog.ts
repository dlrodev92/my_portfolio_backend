import { z } from 'zod';

// Content Block Schema detallado
export const contentBlockSchema = z.object({
  id: z.string(),
  type: z.enum(['PARAGRAPH', 'HEADING', 'CODE', 'IMAGE', 'CALLOUT', 'QUOTE', 'LIST', 'VIDEO']),
  order: z.number(),
  content: z.string(),
  level: z.number().min(1).max(6).optional(),
  language: z.string().optional(),
  codeTitle: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  imageCaption: z.string().optional(),
  imageAlignment: z.enum(['center', 'left', 'right', 'full']).optional(),
  calloutVariant: z.enum(['INFO', 'WARNING', 'TIP', 'ERROR']).optional(),
  calloutTitle: z.string().optional(),
  quoteAuthor: z.string().optional(),
  listStyle: z.enum(['BULLET', 'NUMBERED']).optional(),
  listItems: z.array(z.string()).optional(),
  videoType: z.enum(['YOUTUBE', 'VIMEO']).optional(),
  videoId: z.string().optional(),
  videoTitle: z.string().optional(),
  paragraphStyle: z.enum(['normal', 'lead']).optional(),
});

export const blogFormSchema = z.object({
  // Step 1: Basic Info
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  subtitle: z.string().optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt too long'),
  categoryId: z.string().optional(),
  seriesId: z.string().optional(),
  seriesPart: z.number().optional(),
  heroImage: z.union([z.string(), z.instanceof(File)]).optional(),
  heroImageAlt: z.string().optional(),
  heroImageCaption: z.string().optional(),

  // New category/series creation fields
  newCategoryName: z.string().optional(),
  newSeriesData: z.object({
    name: z.string(),
    description: z.string().optional(),
    totalParts: z.number(),
  }).optional(),

  // Step 2: Content
  contentBlocks: z.array(contentBlockSchema).default([]),

  // Step 3: SEO & Media
  metaDescription: z.string().min(1, 'Meta description is required').max(160, 'Too long'),
  socialImage:  z.string().url('Must be a valid URL').optional(),
  tags: z.array(z.string()).default([]),
  slug: z.string().optional(),

  // Step 4: Publishing
  readTime: z.number().min(1, 'Read time is required').default(1),
  wordCount: z.number().min(1, 'Word count is required').default(0),
  publishedAt: z.string().optional(),
  
  // Author info
  author: z.object({
    name: z.string().min(1, 'Author name is required'),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    social: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional(),
    }).optional(),
  }),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;
export type ContentBlockData = z.infer<typeof contentBlockSchema>;

// Validation schemas específicos por tipo de bloque
export const headingBlockSchema = contentBlockSchema.extend({
  type: z.literal('HEADING'),
  level: z.number().min(1).max(6),
}).omit({
  language: true,
  codeTitle: true,
  imageUrl: true,
  imageAlt: true,
  imageCaption: true,
  imageAlignment: true,
  calloutVariant: true,
  calloutTitle: true,
  quoteAuthor: true,
  listStyle: true,
  listItems: true,
  videoType: true,
  videoId: true,
  videoTitle: true,
  paragraphStyle: true,
});

export const codeBlockSchema = contentBlockSchema.extend({
  type: z.literal('CODE'),
  language: z.string().optional(),
  codeTitle: z.string().optional(),
}).omit({
  level: true,
  imageUrl: true,
  imageAlt: true,
  imageCaption: true,
  imageAlignment: true,
  calloutVariant: true,
  calloutTitle: true,
  quoteAuthor: true,
  listStyle: true,
  listItems: true,
  videoType: true,
  videoId: true,
  videoTitle: true,
  paragraphStyle: true,
});

export const imageBlockSchema = contentBlockSchema.extend({
  type: z.literal('IMAGE'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  imageAlt: z.string().min(1, 'Alt text is required for accessibility'),
  imageCaption: z.string().optional(),
  imageAlignment: z.enum(['center', 'left', 'right', 'full']).default('center'),
}).omit({
  level: true,
  language: true,
  codeTitle: true,
  calloutVariant: true,
  calloutTitle: true,
  quoteAuthor: true,
  listStyle: true,
  listItems: true,
  videoType: true,
  videoId: true,
  videoTitle: true,
  paragraphStyle: true,
});

export const calloutBlockSchema = contentBlockSchema.extend({
  type: z.literal('CALLOUT'),
  calloutVariant: z.enum(['INFO', 'WARNING', 'TIP', 'ERROR']).default('INFO'),
  calloutTitle: z.string().optional(),
}).omit({
  level: true,
  language: true,
  codeTitle: true,
  imageUrl: true,
  imageAlt: true,
  imageCaption: true,
  imageAlignment: true,
  quoteAuthor: true,
  listStyle: true,
  listItems: true,
  videoType: true,
  videoId: true,
  videoTitle: true,
  paragraphStyle: true,
});

export const quoteBlockSchema = contentBlockSchema.extend({
  type: z.literal('QUOTE'),
  quoteAuthor: z.string().optional(),
}).omit({
  level: true,
  language: true,
  codeTitle: true,
  imageUrl: true,
  imageAlt: true,
  imageCaption: true,
  imageAlignment: true,
  calloutVariant: true,
  calloutTitle: true,
  listStyle: true,
  listItems: true,
  videoType: true,
  videoId: true,
  videoTitle: true,
  paragraphStyle: true,
});

export const listBlockSchema = contentBlockSchema.extend({
  type: z.literal('LIST'),
  listStyle: z.enum(['BULLET', 'NUMBERED']).default('BULLET'),
  listItems: z.array(z.string().min(1)).min(1, 'At least one list item is required'),
}).omit({
  level: true,
  language: true,
  codeTitle: true,
  imageUrl: true,
  imageAlt: true,
  imageCaption: true,
  imageAlignment: true,
  calloutVariant: true,
  calloutTitle: true,
  quoteAuthor: true,
  videoType: true,
  videoId: true,
  videoTitle: true,
  paragraphStyle: true,
});

export const videoBlockSchema = contentBlockSchema.extend({
  type: z.literal('VIDEO'),
  videoType: z.enum(['YOUTUBE', 'VIMEO']).default('YOUTUBE'),
  videoId: z.string().min(1, 'Video ID is required'),
  videoTitle: z.string().optional(),
}).omit({
  level: true,
  language: true,
  codeTitle: true,
  imageUrl: true,
  imageAlt: true,
  imageCaption: true,
  imageAlignment: true,
  calloutVariant: true,
  calloutTitle: true,
  quoteAuthor: true,
  listStyle: true,
  listItems: true,
  paragraphStyle: true,
});

export const paragraphBlockSchema = contentBlockSchema.extend({
  type: z.literal('PARAGRAPH'),
  paragraphStyle: z.enum(['normal', 'lead']).default('normal'),
}).omit({
  level: true,
  language: true,
  codeTitle: true,
  imageUrl: true,
  imageAlt: true,
  imageCaption: true,
  imageAlignment: true,
  calloutVariant: true,
  calloutTitle: true,
  quoteAuthor: true,
  listStyle: true,
  listItems: true,
  videoType: true,
  videoId: true,
  videoTitle: true,
});

// Helper para crear content blocks con validación específica
export const createContentBlock = (
  type: ContentBlockData['type'], 
  content: string, 
  order: number,
  options?: Partial<Omit<ContentBlockData, 'id' | 'type' | 'order' | 'content'>>
): ContentBlockData => {
  const baseBlock = {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    order,
    content,
    ...options
  };

  // Validar según el tipo específico
  switch (type) {
    case 'HEADING':
      return headingBlockSchema.parse(baseBlock);
    case 'CODE':
      return codeBlockSchema.parse(baseBlock);
    case 'IMAGE':
      return imageBlockSchema.parse(baseBlock);
    case 'CALLOUT':
      return calloutBlockSchema.parse(baseBlock);
    case 'QUOTE':
      return quoteBlockSchema.parse(baseBlock);
    case 'LIST':
      return listBlockSchema.parse(baseBlock);
    case 'VIDEO':
      return videoBlockSchema.parse(baseBlock);
    case 'PARAGRAPH':
      return paragraphBlockSchema.parse(baseBlock);
    default:
      return contentBlockSchema.parse(baseBlock);
  }
};

// Helper para validar un content block específico
export const validateContentBlock = (block: ContentBlockData) => {
  switch (block.type) {
    case 'HEADING':
      return headingBlockSchema.safeParse(block);
    case 'CODE':
      return codeBlockSchema.safeParse(block);
    case 'IMAGE':
      return imageBlockSchema.safeParse(block);
    case 'CALLOUT':
      return calloutBlockSchema.safeParse(block);
    case 'QUOTE':
      return quoteBlockSchema.safeParse(block);
    case 'LIST':
      return listBlockSchema.safeParse(block);
    case 'VIDEO':
      return videoBlockSchema.safeParse(block);
    case 'PARAGRAPH':
      return paragraphBlockSchema.safeParse(block);
    default:
      return contentBlockSchema.safeParse(block);
  }
};