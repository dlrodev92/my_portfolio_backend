

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
  