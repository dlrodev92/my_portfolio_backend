

export interface FileUpload {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  }
  
  export interface UploadedFiles {
    heroImage?: FileUpload[];
    screenshots?: FileUpload[];
  }
  
  export interface ProjectFormData {
    title: string;
    subtitle: string;
    status: 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
    type: 'PERSONAL' | 'FREELANCE' | 'DEVOPS';
    liveDemo?: string;
    github?: string;
    caseStudy?: string;
    publishedAt?: string;
    heroImage?: File;
    screenshots?: File[];
  
    problem: string;
    solution: string;
    role: string;
    impact: string;
  
    launchDate: string;
    duration: string;
    teamSize: string;
  
    database: string;
    api: string;
    components: string;
  
    technologies: string;
    tags: string;
    lessons: string;
    businessOutcomes: string;
    improvements: string;
    nextSteps: string;
    futureTools: string;
    performanceMetrics: string;
  }
  
  // src/lib/types/projects.ts
export interface FileUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadedFiles {
  heroImage?: FileUpload[];
  screenshots?: FileUpload[];
}

export interface ProjectFormData {
  title: string;
  subtitle: string;
  status: 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
  type: 'PERSONAL' | 'FREELANCE' | 'DEVOPS';
  liveDemo?: string;
  github?: string;
  caseStudy?: string;
  publishedAt?: string;
  heroImage?: File;
  screenshots?: File[];

  problem: string;
  solution: string;
  role: string;
  impact: string;

  launchDate: string;
  duration: string;
  teamSize: string;

  database: string;
  api: string;
  components: string;

  technologies: string;
  tags: string;
  lessons: string;
  businessOutcomes: string;
  improvements: string;
  nextSteps: string;
  futureTools: string;
  performanceMetrics: string;
}

// Interfaz común para filtros
export interface SearchFilters {
  searchTerm: string;
  selectedTech: string[];
  selectedStatus: string;
  selectedType: string;
}

// Tipo que coincide exactamente con lo que devuelve Prisma
export interface ProjectWithRelations {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  status: 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
  type: 'PERSONAL' | 'FREELANCE' | 'DEVOPS';
  createdAt: Date;
  updatedAt: Date;
  heroImage: string;
  liveDemo: string | null; 
  github: string | null;  
  caseStudy: string | null; 
  publishedAt: Date | null; 
  technologies: {
    id: number;
    name: string;
    reason: string;
  }[];
  projectTags: {
    id: number;
    createdAt: Date;
    projectId: number;
    tagId: number;
    tag: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
}

export interface AvailableTechnology {
  id: number;
  name: string;
}