"use client";

import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/lib/schemas/blog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Eye, FileText, Tag, Save, ArrowLeft } from "lucide-react";

interface PublishStepProps {
  form: UseFormReturn<BlogFormData>;
  onSubmit?: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export default function PublishStep({ 
  form, 
  onSubmit, 
  onBack, 
  isSubmitting = false 
}: PublishStepProps) {
  const { register, watch, formState: { errors } } = form;
  
  const title = watch('title') || '';
  const excerpt = watch('excerpt') || '';
  const tags = watch('tags') || [];
  const readTime = watch('readTime');
  const wordCount = watch('wordCount');
  const metaDescription = watch('metaDescription') || '';
  const heroImage = watch('heroImage');
  const socialImage = watch('socialImage');

  const getCompletionStatus = () => {
    const checks = [
      { label: 'Title', completed: !!title, required: true },
      { label: 'Excerpt', completed: !!excerpt, required: true },
      { label: 'Meta Description', completed: !!metaDescription, required: true },
      { label: 'Read Time', completed: !!readTime, required: true },
      { label: 'Word Count', completed: !!wordCount, required: true },
      { label: 'Author Name', completed: !!watch('author.name'), required: true },
      { label: 'Hero Image', completed: !!heroImage, required: false },
      { label: 'Social Image', completed: !!socialImage, required: false },
      { label: 'Tags', completed: tags.length > 0, required: false },
    ];

    const requiredCompleted = checks.filter(c => c.required && c.completed).length;
    const requiredTotal = checks.filter(c => c.required).length;
    const optionalCompleted = checks.filter(c => !c.required && c.completed).length;
    const optionalTotal = checks.filter(c => !c.required).length;

    return {
      checks,
      requiredCompleted,
      requiredTotal,
      optionalCompleted,
      optionalTotal,
      isReady: requiredCompleted === requiredTotal
    };
  };

  const status = getCompletionStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-title font-bold mb-2">Publish Settings</h2>
        <p className="text-muted-foreground">
          Final details and review before publishing your blog post
        </p>
      </div>

      {/* Author Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5" />
            Author Information
          </CardTitle>
          <CardDescription>
            Information about the author of this blog post
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorName">Author Name *</Label>
              <Input
                id="authorName"
                placeholder="Your Name"
                {...register('author.name')}
                className={errors.author?.name ? 'border-destructive' : ''}
              />
              {errors.author?.name && (
                <p className="text-sm text-destructive">{errors.author.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authorAvatar">Avatar URL (optional)</Label>
              <Input
                id="authorAvatar"
                placeholder="https://example.com/avatar.jpg"
                {...register('author.avatar')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorBio">Author Bio (optional)</Label>
            <Textarea
              id="authorBio"
              placeholder="A brief bio about the author..."
              rows={2}
              {...register('author.bio')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorTwitter">Twitter (optional)</Label>
              <Input
                id="authorTwitter"
                placeholder="@username"
                {...register('author.social.twitter')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorLinkedIn">LinkedIn (optional)</Label>
              <Input
                id="authorLinkedIn"
                placeholder="linkedin.com/in/username"
                {...register('author.social.linkedin')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorGithub">GitHub (optional)</Label>
              <Input
                id="authorGithub"
                placeholder="github.com/username"
                {...register('author.social.github')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorWebsite">Website (optional)</Label>
              <Input
                id="authorWebsite"
                placeholder="https://yourwebsite.com"
                {...register('author.social.website')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Post Metrics
          </CardTitle>
          <CardDescription>
            Estimated reading time and word count for your post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="readTime">Reading Time (minutes) *</Label>
              <Input
                id="readTime"
                type="number"
                min="1"
                placeholder="5"
                {...register('readTime', { valueAsNumber: true })}
                className={errors.readTime ? 'border-destructive' : ''}
              />
              {errors.readTime && (
                <p className="text-sm text-destructive">{errors.readTime.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Estimated time to read the entire post
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wordCount">Word Count *</Label>
              <Input
                id="wordCount"
                type="number"
                min="1"
                placeholder="1000"
                {...register('wordCount', { valueAsNumber: true })}
                className={errors.wordCount ? 'border-destructive' : ''}
              />
              {errors.wordCount && (
                <p className="text-sm text-destructive">{errors.wordCount.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Total number of words in your post
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5" />
            Publishing Options
          </CardTitle>
          <CardDescription>
            Choose when to publish your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Publish Date (optional)</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              {...register('publishedAt')}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to publish immediately, or set a future date to schedule publication
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="w-5 h-5" />
            Post Review
          </CardTitle>
          <CardDescription>
            Review your post completeness before publishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {status.requiredCompleted}/{status.requiredTotal}
              </div>
              <div className="text-xs text-muted-foreground">Required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {status.optionalCompleted}/{status.optionalTotal}
              </div>
              <div className="text-xs text-muted-foreground">Optional</div>
            </div>
            <div className="flex-1">
              <div className={`text-lg font-medium ${
                status.isReady ? 'text-green-600' : 'text-orange-600'
              }`}>
                {status.isReady ? 'Ready to Publish!' : 'Missing Required Fields'}
              </div>
              <div className="text-sm text-muted-foreground">
                Complete required fields to enable publishing
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <h4 className="font-medium">Completion Checklist</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {status.checks.map((check, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    check.completed 
                      ? 'bg-green-500 text-white' 
                      : check.required 
                      ? 'bg-red-500/20 border border-red-500' 
                      : 'bg-muted border'
                  }`}>
                    {check.completed && <span className="text-xs">✓</span>}
                  </div>
                  <span className={check.completed ? 'text-foreground' : 'text-muted-foreground'}>
                    {check.label}
                    {check.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Post Summary */}
          {title && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Post Preview</h4>
              <div className="space-y-2">
                <div className="font-medium">{title}</div>
                {excerpt && (
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {excerpt}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {readTime && (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {readTime} min read
                    </Badge>
                  )}
                  {wordCount && (
                    <Badge variant="outline" className="gap-1">
                      <FileText className="w-3 h-3" />
                      {wordCount} words
                    </Badge>
                  )}
                  {tags.length > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Tag className="w-3 h-3" />
                      {tags.length} tags
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={!status.isReady || isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Publish Post
            </>
          )}
        </Button>
      </div>
    </div>
  );
}