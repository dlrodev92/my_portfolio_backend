"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormSchema, type ProjectFormData } from "@/lib/schemas/project";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Import form sections
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

export default function ProjectCreateForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      status: 'IN_PROGRESS',
      type: 'PERSONAL', // Agregar default para type
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

  const onSubmit = async (data: ProjectFormData) => {
    console.log('🚀 Submit function called!');
    console.log('📝 Form data:', data);
    console.log('❌ Form errors:', form.formState.errors);
    console.log('✅ Form is valid:', form.formState.isValid);

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

      // Add files
      if (data.heroImage) {
        formData.append('heroImage', data.heroImage);
      }

      if (data.screenshots && data.screenshots.length > 0) {
        data.screenshots.forEach((file) => {
          formData.append('screenshots', file);
        });
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Project created successfully!');
        router.push('/dashboard/projects');
      } else {
        toast.error(result.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar el submit manualmente
  const handleSubmit = async () => {
    console.log('🔥 Manual submit triggered');
    
    // Trigger validation manually
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

  const progress = ((currentSection + 1) / formSections.length) * 100;
  const CurrentSectionComponent = formSections[currentSection].component;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg">Form Progress</CardTitle>
            <CardDescription>
              Complete each section to create your project
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
                Step {currentSection + 1} of {formSections.length}
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
                  {isSubmitting ? 'Creating Project...' : 'Create Project'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
