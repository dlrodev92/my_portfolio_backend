"use client";

import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogFormSchema, type BlogFormData } from "@/lib/schemas/blog";
import {
  BlogPostWithRelations,
  AvailableCategory,
  AvailableSeries,
} from "@/lib/types/blogs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";

// Import steps (reusing existing components)
import StepNavigation from "./wizard/stepNavigation";
import BasicInfoStep from "./wizard/basicInfoStep";
import ContentEditorStep from "./wizard/contentEditorStep";
import SEOStep from "./wizard/seoStep";
import PublishStep from "./wizard/publishStep";

interface BlogEditFormProps {
  slug: string;
  categories: AvailableCategory[];
  series: AvailableSeries[];
}

const steps = [
  { id: 1, title: "Basic Info", description: "Title, category, and basic setup" },
  { id: 2, title: "Content", description: "Write your blog content" },
  { id: 3, title: "SEO & Media", description: "Optimize for search engines" },
  { id: 4, title: "Publish", description: "Review and publish your post" },
];



export default function BlogEditForm({
  slug,
  categories,
  series,
}: BlogEditFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [originalData, setOriginalData] = useState<BlogPostWithRelations | null>(null);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const router = useRouter();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema) as Resolver<BlogFormData>, 
    mode: "onChange",
    defaultValues: {
      tags: [],
      contentBlocks: [],
      author: {
        name: "David Dev Lopez",
        bio: "Just a guy who play around with code",
        avatar:
          "https://media.licdn.com/dms/image/v2/D4E03AQGFDNCiQRvcVg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1732716570890?e=1756944000&v=beta&t=03UKR0s9oKyNvYjxzIRBuSiixnkaASCq-eTIo3z34tI",
        social: {
          twitter: "https://x.com/dev_malafolla",
          linkedin: "https://www.linkedin.com/in/david-lopez-b27691216/",
          github: "https://github.com/dlrodev92",
          website: "https://daviddevlopez.com",
        },
      },
      readTime: 5,
      wordCount: 1000,
    },
  });

  // Fetch blog post data on component mount
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blogs/slug/${currentSlug}`);

        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Blog post not found");
            router.push("/dashboard/blogs");
            return;
          }
          throw new Error("Failed to fetch blog post");
        }

        const blogData: BlogPostWithRelations = await response.json();
        setOriginalData(blogData);

        // Transform API data to form data format using proper types
        const formData: Partial<BlogFormData> = {
          title: blogData.title || "",
          subtitle: blogData.subtitle || "",
          excerpt: blogData.excerpt || "",
          slug: blogData.slug || "",
          categoryId: blogData.categoryId ? String(blogData.categoryId) : "",
          seriesId: blogData.seriesId ? String(blogData.seriesId) : "",
          seriesPart: blogData.seriesPart || undefined,
          heroImageAlt: blogData.heroImageAlt || "",
          heroImageCaption: blogData.heroImageCaption || "",
          metaDescription: blogData.metaDescription || "",
          readTime: blogData.readTime || 5,
          wordCount: blogData.wordCount || 1000,
          publishedAt: blogData.publishedAt
            ? new Date(blogData.publishedAt).toISOString().slice(0, 16)
            : "",

          author: {
            name: blogData.author?.name || "Your Name",
            bio: blogData.author?.bio || "",
            avatar: blogData.author?.avatar || "",
            social: {
              twitter: blogData.author?.social?.twitter || "",
              linkedin: blogData.author?.social?.linkedin || "",
              github: blogData.author?.social?.github || "",
              website: blogData.author?.social?.website || "",
            },
          },

          contentBlocks:
            blogData.contentBlocks?.map((block) => ({
              id: String(block.id),
              type: block.type,
              order: block.order,
              content: block.content,
              level: block.level || undefined,
              language: block.language || undefined,
              codeTitle: block.codeTitle || undefined,
              imageUrl: block.imageUrl || undefined,
              imageAlt: block.imageAlt || undefined,
              imageCaption: block.imageCaption || undefined,
              imageAlignment: (block.imageAlignment as
                | "center"
                | "left"
                | "right"
                | "full"
                | undefined) ?? undefined,
              calloutVariant: block.calloutVariant || undefined,
              calloutTitle: block.calloutTitle || undefined,
              quoteAuthor: block.quoteAuthor || undefined,
              listStyle: block.listStyle || undefined,
              listItems: block.listItems
                ? JSON.parse(String(block.listItems))
                : undefined,
              videoType: block.videoType || undefined,
              videoId: block.videoId || undefined,
              videoTitle: block.videoTitle || undefined,
              paragraphStyle:
                block.paragraphStyle === "normal" || block.paragraphStyle === "lead"
                  ? block.paragraphStyle
                  : undefined,
            })) || [],

          tags:
            blogData.blogPostTags?.map(
              (tag: { blogTag: { name: string } }) => tag.blogTag.name
            ) || [],
        };

        form.reset(formData);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast.error("Failed to load blog post data");
        router.push("/dashboard/blogs");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentSlug) {
      fetchBlogPost();
    }
  }, [currentSlug, form, router]);

  const watchTitle = form.watch("title");
  useEffect(() => {
    if (watchTitle && originalData && watchTitle !== originalData.title) {
      const newSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", newSlug);
    }
  }, [watchTitle, form, originalData]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      autoSave();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    autoSave();
  };

  const autoSave = async () => {
    setLastSaved(new Date());
  };

  const handleFinalSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = form.getValues();
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "heroImage" || key === "socialImage") return;

        if (Array.isArray(value) || typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      if (data.heroImage) formData.append("heroImage", data.heroImage);
      if (data.socialImage) formData.append("socialImage", data.socialImage);

      const response = await fetch(`/api/blogs/slug/${currentSlug}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Blog post updated successfully!");
        if (result.newSlug && result.newSlug !== currentSlug) {
          setCurrentSlug(result.newSlug);
          window.history.replaceState(
            null,
            "",
            `/dashboard/blogs/${result.newSlug}`
          );
        }
        router.push("/dashboard/blogs");
      } else {
        if (response.status === 409) {
          toast.error(
            "A blog post with this title already exists. Please choose a different title."
          );
        } else {
          toast.error(result.error || "Failed to update blog post");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveAsDraft = async () => {
    autoSave();
    toast.success("Saved as draft");
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/slug/${currentSlug}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Blog post deleted successfully!");
        router.push("/dashboard/blogs");
      } else {
        toast.error(result.error || "Failed to delete blog post");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading blog post data...</span>
        </div>
      </div>
    );
  }

  const progress = (currentStep / steps.length) * 100;
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <StepNavigation
          steps={steps}
          currentStep={currentStep}
          onStepClick={goToStep}
          progress={progress}
          lastSaved={lastSaved}
        />

        <div className="mt-4">
          <Card>
            <CardContent className="p-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="w-full"
              >
                Delete Blog Post
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              {currentStep === 1 && (
                <BasicInfoStep
                  form={form}
                  categories={categories}
                  series={series.map(s => ({
                    ...s,
                    description: s.description === null ? undefined : s.description,
                  }))}
                />
              )}
              {currentStep === 2 && <ContentEditorStep form={form} />}
              {currentStep === 3 && <SEOStep form={form} />}
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
