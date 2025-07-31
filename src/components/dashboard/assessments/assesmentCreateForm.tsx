"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentFormSchema, type AssessmentFormData } from "@/lib/schemas/assessment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

// Import form sections
import BasicInfoSection from "./form-sections/basicInfoSection";
import ContentSection from "./form-sections/contentSection";
import MediaSection from "./form-sections/mediaSection";
import TagsSection from "./form-sections/tagsSection";
import TechnologiesSection from './form-sections/technologiesSection';

export default function AssessmentCreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      contentBlocks: [],
      technologies: [],
      tags: [],
      imageDescriptions: [],
      imageAlts: [],
      imageCaptions: [],
      fileNames: [],
    },
  });

  const onSubmit = async (data: AssessmentFormData) => {
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add basic fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'mainImage' || key === 'images' || key === 'files') {
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
      if (data.mainImage instanceof File) {
        formData.append('mainImage', data.mainImage);
      }

      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      }

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          if (file instanceof File) {
            formData.append('files', file);
          }
        });
      }

      const response = await fetch('/api/assessments', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Assessment created successfully!');
        router.push('/dashboard/assessments');
      } else {
        toast.error(result.error || 'Failed to create assessment');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      await onSubmit(data);
    } else {
      toast.error('Please fix the form errors before submitting');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Basic details about your assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BasicInfoSection form={form} />
        </CardContent>
      </Card>

      {/* Content Blocks */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Add paragraphs and headings to describe your assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentSection form={form} />
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle>Technologies Used</CardTitle>
          <CardDescription>
            What technologies, tools, or frameworks did you use?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TechnologiesSection form={form} />
        </CardContent>
      </Card>

      {/* Media & Files */}
      <Card>
        <CardHeader>
          <CardTitle>Media & Files</CardTitle>
          <CardDescription>
            Upload images and files related to your assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaSection form={form} />
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags & Classification</CardTitle>
          <CardDescription>
            Add tags to help organize and categorize your assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagsSection form={form} />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/assessments')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Assessment
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}