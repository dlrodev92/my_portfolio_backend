"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormSchema, type ProjectFormData } from "@/lib/schemas/project";
import { ProjectWithRelations } from "@/lib/types/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Import form sections (reusing existing components)
import BasicInformationSection from "./form-sections/basicInformationSection";
import MediaSection from "./form-sections/mediaSection";
import LinksSection from "./form-sections/linksSection";
import OverviewSection from "./form-sections/overviewSection";
import TechnicalSection from "./form-sections/technicalSection";
import MetricsSection from "./form-sections/metricsSection";
import OutcomesSection from "./form-sections/outcomesSection";
import TagsSection from "./form-sections/tagsSection";

const formSections = [
  { id: 'basic', title: 'Basic Information', component: BasicInformationSection },
  { id: 'media', title: 'Media & Assets', component: MediaSection },
  { id: 'links', title: 'Links & Demo', component: LinksSection },
  { id: 'overview', title: 'Project Overview', component: OverviewSection },
  { id: 'technical', title: 'Technical Details', component: TechnicalSection },
  { id: 'metrics', title: 'Project Metrics', component: MetricsSection },
  { id: 'outcomes', title: 'Outcomes & Learning', component: OutcomesSection },
  { id: 'tags', title: 'Tags & Classification', component: TagsSection },
];

interface ProjectEditFormProps {
  slug: string;
}

// Extended interface for the API response that includes all related data
interface ProjectApiResponse extends ProjectWithRelations {
  overview?: {
    problem: string;
    solution: string;
    role: string;
    impact: string;
  } | null;
  metrics?: {
    launchDate: string;
    duration: string;
    teamSize: string;
  } | null;
  technicalDetails?: {
    database: string;
    api: string;
    components: string;
  } | null;
  screenshots?: Array<{
    id: number;
    url: string;
    description: string;
    order: number;
  }>;
  lessons?: Array<{
    id: number;
    description: string;
  }>;
  businessOutcomes?: Array<{
    id: number;
    description: string;
  }>;
  improvements?: Array<{
    id: number;
    description: string;
  }>;
  nextSteps?: Array<{
    id: number;
    description: string;
  }>;
  futureTools?: Array<{
    id: number;
    name: string;
  }>;
  performanceMetrics?: Array<{
    id: number;
    description: string;
  }>;
}

export default function ProjectEditForm({ slug }: ProjectEditFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<ProjectApiResponse | null>(null);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const router = useRouter();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      status: 'IN_PROGRESS',
      type: 'PERSONAL',
      technologies: [],
      lessons: [],
      businessOutcomes: [],
      improvements: [],
      nextSteps: [],
      futureTools: [],
      performanceMetrics: [],
      tags: [],
    },
  });

  // Fetch project data on component mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/slug/${currentSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Project not found');
            router.push('/dashboard/projects');
            return;
          }
          throw new Error('Failed to fetch project');
        }

        const projectData: ProjectApiResponse = await response.json();
        setOriginalData(projectData);
        
        // Transform API data to form data format using proper types
        const formData: Partial<ProjectFormData> = {
          title: projectData.title || '',
          subtitle: projectData.subtitle || '',
          status: projectData.status || 'IN_PROGRESS',
          type: projectData.type || 'PERSONAL',
          liveDemo: projectData.liveDemo || '',
          github: projectData.github || '',
          caseStudy: projectData.caseStudy || '',
          publishedAt: projectData.publishedAt ? 
            new Date(projectData.publishedAt).toISOString().slice(0, 16) : '',
          
          // Overview data
          problem: projectData.overview?.problem || '',
          solution: projectData.overview?.solution || '',
          role: projectData.overview?.role || '',
          impact: projectData.overview?.impact || '',
          
          // Technical details
          database: projectData.technicalDetails?.database || '',
          api: projectData.technicalDetails?.api || '',
          components: projectData.technicalDetails?.components || '',
          
          // Metrics
          launchDate: projectData.metrics?.launchDate || '',
          duration: projectData.metrics?.duration || '',
          teamSize: projectData.metrics?.teamSize || '',
          
          // Arrays with proper typing
          technologies: projectData.technologies?.map((tech: { name: string; reason: string }) => ({
            name: tech.name,
            reason: tech.reason
          })) || [],
          lessons: projectData.lessons?.map((lesson: { description: string }) => lesson.description) || [],
          businessOutcomes: projectData.businessOutcomes?.map((outcome: { description: string }) => outcome.description) || [],
          improvements: projectData.improvements?.map((improvement: { description: string }) => improvement.description) || [],
          nextSteps: projectData.nextSteps?.map((step: { description: string }) => step.description) || [],
          futureTools: projectData.futureTools?.map((tool: { name: string }) => tool.name) || [],
          performanceMetrics: projectData.performanceMetrics?.map((metric: { description: string }) => metric.description) || [],
          tags: projectData.projectTags?.map((tag: { tag: { name: string } }) => tag.tag.name) || [],
        };

        // Reset form with fetched data
        form.reset(formData);
        
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project data');
        router.push('/dashboard/projects');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentSlug) {
      fetchProject();
    }
  }, [currentSlug, form, router]);

  const onSubmit = async (data: ProjectFormData) => {
    console.log('🚀 Submit function called!');
    console.log('📝 Form data:', data);
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add basic fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'heroImage' || key === 'screenshots') {
          // Handle files separately
          return;
        }
        
        if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });

      // Add files if they exist
      if (data.heroImage) {
        formData.append('heroImage', data.heroImage);
      }

      if (data.screenshots && data.screenshots.length > 0) {
        data.screenshots.forEach((file) => {
          formData.append('screenshots', file);
        });
      }

      // Use PUT method for updates with current slug
      const response = await fetch(`/api/projects/slug/${currentSlug}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Project updated successfully!');
        
        // If slug changed, update current slug for future requests
        if (result.newSlug && result.newSlug !== currentSlug) {
          setCurrentSlug(result.newSlug);
          // Update URL without causing a page refresh
          window.history.replaceState(null, '', `/dashboard/projects/${result.newSlug}`);
        }
        
        // Navigate back to projects list
        router.push('/dashboard/projects');
      } else {
        if (response.status === 409) {
          toast.error('A project with this title already exists. Please choose a different title.');
        } else {
          toast.error(result.error || 'Failed to update project');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    console.log('🔥 Manual submit triggered');
    
    const isValid = await form.trigger();
    console.log('Form is valid:', isValid);
    console.log('Form errors:', form.formState.errors);
    
    if (isValid) {
      const data = form.getValues();
      await onSubmit(data);
    } else {
      toast.error('Please fix the form errors before submitting');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/slug/${currentSlug}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Project deleted successfully!');
        router.push('/dashboard/projects');
      } else {
        toast.error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Something went wrong');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading project data...</span>
        </div>
      </div>
    );
  }

  const progress = ((currentSection + 1) / formSections.length) * 100;
  const CurrentSectionComponent = formSections[currentSection].component;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg">Edit Progress</CardTitle>
            <CardDescription>
              Update each section to modify your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <nav className="space-y-1">
              {formSections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setCurrentSection(index)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    index === currentSection
                      ? 'bg-primary text-primary-foreground'
                      : index < currentSection
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      index < currentSection ? 'bg-green-500' : 
                      index === currentSection ? 'bg-white' : 'bg-muted-foreground'
                    }`} />
                    {section.title}
                  </div>
                </button>
              ))}
            </nav>

            {/* Delete Button */}
            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                className="w-full"
              >
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Form */}
      <div className="lg:col-span-3">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{formSections[currentSection].title}</CardTitle>
              <CardDescription>
                Step {currentSection + 1} of {formSections.length} - Editing: {originalData?.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <CurrentSectionComponent form={form} />
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentSection < formSections.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentSection(Math.min(formSections.length - 1, currentSection + 1))}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Updating Project...' : 'Update Project'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}