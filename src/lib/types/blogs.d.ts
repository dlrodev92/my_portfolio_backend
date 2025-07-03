import { AuthorData } from '@/lib/types/blogs';

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
  
  export interface AuthorInfo {
    name: string;
    bio?: string;
  }
  
  export interface ContentBlock {
    type: string;
    content: string;
  }
  
  export interface BlogFormData {
    title: string;
    subtitle?: string;
    excerpt: string;
    metaDescription: string;
    heroImageAlt?: string;
    heroImageCaption?: string;
    readTime: string;
    publishedAt?: string;
    category: string;
    series?: string;
    tags: string;
    contentBlocks: string;
    author?: string;
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
  
  export interface ContentBlockInput {
    type: string;
    order?: number;
    content?: string;
    level?: number;
    language?: string;
    codeTitle?: string;
    imageUrl?: string;
    imageAlt?: string;
    imageCaption?: string;
    imageAlignment?: string;
    calloutVariant?: string;
    calloutTitle?: string;
    quoteAuthor?: string;
    listStyle?: string;
    listItems?: unknown[];
    videoType?: string;
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
  
  export interface AuthorData {
    name: string;
    bio: string;
  }