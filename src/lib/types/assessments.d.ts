import type { Assessment, AssessmentContentBlock, AssessmentImage, AssessmentFile, AssessmentTag, Tag, Technology } from '@prisma/client';

export interface AssessmentWithRelations {
  id: number;
  title: string;
  description: string;
  slug: string;
  mainImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  contentBlocks: AssessmentContentBlock[];
  images: AssessmentImage[];
  files: AssessmentFile[];
  technologies: Technology[]; // Añadir esto
  assessmentTags: (AssessmentTag & {
    tag: Tag;
  })[];
  
  _count?: {
    contentBlocks: number;
    images: number;
    files: number;
  };
}

export interface AssessmentSearchFilters {
  searchTerm: string;
  selectedTags: string[];
  selectedTechs: string[]; // Añadir filtro por tecnologías
}

export interface AssessmentUploadedFiles {
  mainImage?: import('@/lib/utils/s3Upload').FileUpload[];
  images?: import('@/lib/utils/s3Upload').FileUpload[];
  files?: import('@/lib/utils/s3Upload').FileUpload[];
}

export interface AssessmentStats {
  total: number;
  published: number;
  thisMonth: number;
}