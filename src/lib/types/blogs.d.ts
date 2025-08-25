import type {  Category, Series, ContentBlock, BlogTag, BlogPostTag } from '@prisma/client';

// Interfaz para filtros de búsqueda de blogs
export interface BlogSearchFilters {
  searchTerm: string;
  selectedCategories: string[];
  selectedTags: string[];
  selectedStatus: string;
  selectedSeries: string;
}

export interface BlogAuthor {
  name: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

// Tipo que coincide exactamente con lo que devuelve Prisma para blogs
export interface BlogPostWithRelations {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  metaDescription: string;
  socialImage: string | null;
  readTime: number;
  wordCount: number;
  views: number;
  heroImage: string | null;
  heroImageAlt: string | null;
  heroImageCaption: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: BlogAuthor | null;
  categoryId: number | null;
  seriesId: number | null;
  seriesPart: number | null;
  
  category: Category | null;
  series: Series | null;
  contentBlocks: ContentBlock[];
  blogPostTags: (BlogPostTag & {
    blogTag: BlogTag;
  })[];
}

export interface AvailableCategory {
  id: number;
  name: string;
  slug: string;
}

export interface AvailableTag {
  id: number;
  name: string;
  slug: string;
}

export interface AvailableSeries {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  totalParts: number;
}

export interface BlogStats {
  total: number;
  published: number;
  draft: number;
  thisMonth: number;
  totalViews: number;
  avgReadTime: number;
}

export interface ContentBlockInput {
  type: 'PARAGRAPH' | 'HEADING' | 'CODE' | 'IMAGE' | 'CALLOUT' | 'QUOTE' | 'LIST' | 'VIDEO';
  order?: number;
  content?: string;
  level?: number;
  language?: string;
  codeTitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageAlignment?: 'left' | 'center' | 'right';
  calloutVariant?: 'INFO' | 'WARNING' | 'TIP' | 'ERROR';
  calloutTitle?: string;
  quoteAuthor?: string;
  listStyle?: 'BULLET' | 'NUMBERED';
  listItems?: string[];
  videoType?: 'YOUTUBE' | 'VIMEO';
  videoId?: string;
  videoTitle?: string;
  paragraphStyle?: string; 
}

export interface SeriesData {
  name: string;
  description?: string;
  part?: number; 
}


export interface TagData {
  name: string;
}


export interface CategoryData {
  name: string;
}

export interface FileUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadedFiles {
  heroImage?: FileUpload[];
  socialImage?: FileUpload[];
  contentImages?: FileUpload[];
}