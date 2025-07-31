import type { BlogPost, Category, Series, ContentBlock, BlogTag, BlogPostTag } from '@prisma/client';

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

// Estadísticas de blogs
export interface BlogStats {
  total: number;
  published: number;
  draft: number;
  thisMonth: number;
  totalViews: number;
  avgReadTime: number;
}