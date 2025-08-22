"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentFormSchema, type AssessmentFormData } from "@/lib/schemas/assessment";
import { AssessmentWithRelations } from "@/lib/types/assessments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Save, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Import form sections (reusing existing components)
import BasicInfoSection from "./form-sections/basicInfoSection";
import ContentSection from "./form-sections/contentSection";
import TechnologiesSection from "./form-sections/technologiesSection";
import MediaSection from "./form-sections/mediaSection";
import TagsSection from "./form-sections/tagsSection";

interface AssessmentEditFormProps {
  slug: string;
}

export default function AssessmentEditForm({ slug }: AssessmentEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<AssessmentWithRelations | null>(null);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const router = useRouter();

  const form = useForm<AssessmentFormData, unknown, AssessmentFormData>({
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

  // Fetch assessment data on component mount
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/assessments/slug/${currentSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Assessment not found');
            router.push('/dashboard/assessments');
            return;
          }
          throw new Error('Failed to fetch assessment');
        }

        const assessmentData: AssessmentWithRelations = await response.json();
        setOriginalData(assessmentData);
        
        // Transform API data to form data format using proper types
        const formData: AssessmentFormData = {
          title: assessmentData.title || '',
          description: assessmentData.description || '',
          publishedAt: assessmentData.publishedAt ? 
            new Date(assessmentData.publishedAt).toISOString().slice(0, 16) : '',
          
          // Content blocks with proper typing, always an array
          contentBlocks: Array.isArray(assessmentData.contentBlocks)
            ? assessmentData.contentBlocks.map((block) => ({
                id: String(block.id),
                type: block.type,
                order: block.order,
                content: block.content,
                level: block.level ?? undefined,
              }))
            : [],
          
          // Technologies with proper typing, always an array
          technologies: Array.isArray(assessmentData.technologies)
            ? assessmentData.technologies.map((tech) => ({
                name: tech.name,
                reason: tech.reason || ''
              }))
            : [],
          
          // Tags with proper typing, always an array
          tags: Array.isArray(assessmentData.assessmentTags)
            ? assessmentData.assessmentTags.map((tag: { tag: { name: string } }) => tag.tag.name)
            : [],
          
          // Initialize metadata arrays for existing images and files, always arrays
          imageDescriptions: Array.isArray(assessmentData.images)
            ? assessmentData.images.map((img) => img.caption || '')
            : [],
          imageAlts: Array.isArray(assessmentData.images)
            ? assessmentData.images.map((img) => img.alt || '')
            : [],
          imageCaptions: Array.isArray(assessmentData.images)
            ? assessmentData.images.map((img) => img.caption || '')
            : [],
          fileNames: Array.isArray(assessmentData.files)
            ? assessmentData.files.map((file) => file.name)
            : [],
          // Add missing fields if required by AssessmentFormData
          mainImage: undefined,
          images: [],
          files: [],
        };

        // Reset form with fetched data
        form.reset(formData);
        
      } catch (error) {
        console.error('Error fetching assessment:', error);
        toast.error('Failed to load assessment data');
        router.push('/dashboard/assessments');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentSlug) {
      fetchAssessment();
    }
  }, [currentSlug, form, router]);

  const onSubmit = async (data: AssessmentFormData) => {
    console.log('🚀 Submit assessment update:', data);
    
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

      // Add files if they exist
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

      // Use PUT method for updates with current slug
      const response = await fetch(`/api/assessments/slug/${currentSlug}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Assessment updated successfully!');
        
        // If slug changed, update current slug for future requests
        if (result.newSlug && result.newSlug !== currentSlug) {
          setCurrentSlug(result.newSlug);
          // Update URL without causing a page refresh
          window.history.replaceState(null, '', `/dashboard/assessments/${result.newSlug}`);
        }
        
        // Navigate back to assessments list
        router.push('/dashboard/assessments');
      } else {
        if (response.status === 409) {
          toast.error('An assessment with this title already exists. Please choose a different title.');
        } else {
          toast.error(result.error || 'Failed to update assessment');
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
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      await onSubmit(data);
    } else {
      toast.error('Please fix the form errors before submitting');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/assessments/slug/${currentSlug}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Assessment deleted successfully!');
        router.push('/dashboard/assessments');
      } else {
        toast.error(result.error || 'Failed to delete assessment');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading assessment data...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Basic details about your assessment - Editing: {originalData?.title}
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
            Edit paragraphs and headings to describe your assessment
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
            Update technologies, tools, or frameworks you used
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
            Update images and files related to your assessment
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
            Update tags to help organize and categorize your assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagsSection form={form} />
        </CardContent>
      </Card>

      {/* Submit and Delete Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            {/* Delete Button with AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="gap-2"
                  disabled={isSubmitting || isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Assessment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete -<strong>{originalData?.title}</strong>- ? 
                    This action cannot be undone and will permanently remove all associated 
                    content, images, files, and data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Assessment
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Save/Cancel Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/assessments')}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isDeleting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}