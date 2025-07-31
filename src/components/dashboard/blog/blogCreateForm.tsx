"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogFormSchema, type BlogFormData } from "@/lib/schemas/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

// Import steps
import StepNavigation from "./wizard/stepNavigation";
import BasicInfoStep from "./wizard/basicInfoStep";
import ContentEditorStep from "./wizard/contentEditorStep";
import SEOStep from "./wizard/seoStep";
import PublishStep from "./wizard/publishStep";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Series {
  id: number;
  name: string;
  slug: string;
  description?: string;
  totalParts: number;
}

interface BlogCreateFormProps {
  categories: Category[];
  series: Series[];
}

const steps = [
  { id: 1, title: "Basic Info", description: "Title, category, and basic setup" },
  { id: 2, title: "Content", description: "Write your blog content" },
  { id: 3, title: "SEO & Media", description: "Optimize for search engines" },
  { id: 4, title: "Publish", description: "Review and publish your post" },
];

export default function BlogCreateForm({ categories, series }: BlogCreateFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const router = useRouter();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    mode: 'onChange',
    defaultValues: {
      tags: [],
      contentBlocks: [],
      author: {
        name: 'David Dev Lopez', 
        bio: 'Just a guy who play around with code',
        avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQGFDNCiQRvcVg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1732716570890?e=1756944000&v=beta&t=03UKR0s9oKyNvYjxzIRBuSiixnkaASCq-eTIo3z34tI',
        social: {
        twitter: 'https://x.com/dev_malafolla', 
        linkedin: 'https://www.linkedin.com/in/david-lopez-b27691216/', 
        github: 'https://github.com/dlrodev92', 
        website: 'https://daviddevlopez.com' 
        }
      },
      readTime: 5,
      wordCount: 1000,
    },
  });

  // Auto-generate slug from title
  const watchTitle = form.watch('title');
  useEffect(() => {
    if (watchTitle && !form.getValues('slug')) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  }, [watchTitle, form]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      autoSave();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    autoSave();
  };

  const autoSave = async () => {
    // Auto-save as draft (we'll implement this later)
    setLastSaved(new Date());
  };

  // ⭐ Función de submit que pasaremos al PublishStep
  const handleFinalSubmit = async () => {
    // Primero validamos el form
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = form.getValues();
      const formData = new FormData();

      // Add all fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'heroImage' || key === 'socialImage') return;
        
        if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });

      // Add files
      if (data.heroImage) formData.append('heroImage', data.heroImage);
      if (data.socialImage) formData.append('socialImage', data.socialImage);

      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Blog post published successfully!');
        router.push('/dashboard/blogs');
      } else {
        toast.error(result.error || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveAsDraft = async () => {
    // Save current state as draft
    autoSave();
    toast.success('Saved as draft');
  };

  const progress = (currentStep / steps.length) * 100;
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Step Navigation Sidebar */}
      <div className="lg:col-span-1">
        <StepNavigation 
          steps={steps}
          currentStep={currentStep}
          onStepClick={goToStep}
          progress={progress}
          lastSaved={lastSaved}
        />
      </div>

      {/* Main Content - ⭐ SIN form wrapper */}
      <div className="lg:col-span-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              {currentStep === 1 && (
                <BasicInfoStep 
                  form={form} 
                  categories={categories} 
                  series={series} 
                />
              )}
              
              {currentStep === 2 && (
                <ContentEditorStep form={form} />
              )}
              
              {currentStep === 3 && (
                <SEOStep form={form} />
              )}
              
              {currentStep === 4 && (
                <PublishStep 
                  form={form}
                  onSubmit={handleFinalSubmit}
                  onBack={prevStep}
                  isSubmitting={isSubmitting}
                />
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons - ⭐ Solo para pasos que NO son el último */}
          {!isLastStep && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {!isFirstStep && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={saveAsDraft}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Draft
                    </Button>

                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}