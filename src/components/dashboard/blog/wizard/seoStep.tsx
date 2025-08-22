"use client";

import { useState, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/lib/schemas/blog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Upload, X, Plus, Hash, Globe } from "lucide-react";
import Image from "next/image";

interface SEOStepProps {
  form: UseFormReturn<BlogFormData>;
}

// Common blog tags for suggestions
const SUGGESTED_TAGS = [
  'JavaScript', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Python',
  'Web Development', 'Frontend', 'Backend', 'Full Stack', 'Tutorial',
  'Guide', 'Tips', 'Best Practices', 'Performance', 'Security',
  'CSS', 'HTML', 'API', 'Database', 'DevOps', 'Testing',
  'UI/UX', 'Design', 'Productivity', 'Career', 'Learning'
];

export default function SEOStep({ form }: SEOStepProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const socialImage = watch('socialImage');
  const tags = watch('tags') || [];
  const metaDescription = watch('metaDescription') || '';
  const title = watch('title') || '';
  const slug = watch('slug') || '';

  // Social Image handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setValue('socialImage', file);
      }
    }
  }, [setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('socialImage', e.target.files[0]);
    }
  };

  // Tags functionality
 useEffect(() => {
    if (newTag.length > 0) {
      const filtered = SUGGESTED_TAGS.filter(tag => 
        tag.toLowerCase().includes(newTag.toLowerCase()) && 
        !tags.includes(tag)
      ).slice(0, 6);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [newTag, tags]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setValue('tags', [...tags, trimmedTag]);
      setNewTag('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setValue('tags', newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-title font-bold mb-2">SEO & Social Media</h2>
        <p className="text-muted-foreground">
          Optimize your post for search engines and social media sharing
        </p>
      </div>

      {/* URL Slug */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5" />
            URL & Slug
          </CardTitle>
          <CardDescription>
            Customize how your blog post URL will look
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">yourdomain.com/blog/</span>
              <Input
                id="slug"
                placeholder="your-blog-post-url"
                {...register('slug')}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-generated from title, but you can customize it
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meta Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-5 h-5" />
            Search Engine Optimization
          </CardTitle>
          <CardDescription>
            Help search engines understand and display your content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="metaDescription">Meta Description *</Label>
              <span className={`text-xs ${
                metaDescription.length > 160 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {metaDescription.length}/160
              </span>
            </div>
            <Textarea
              id="metaDescription"
              placeholder="A compelling description that will appear in search results..."
              rows={3}
              {...register('metaDescription')}
              className={errors.metaDescription ? 'border-destructive' : ''}
              maxLength={160}
            />
            {errors.metaDescription && (
              <p className="text-sm text-destructive">{errors.metaDescription.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This description appears in search results. Make it compelling and under 160 characters.
            </p>
          </div>

          {/* SEO Preview */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Search Preview</h4>
            <div className="space-y-1">
              <div className="text-blue-600 text-lg font-medium line-clamp-1">
                {title || 'Your Blog Post Title'}
              </div>
              <div className="text-green-700 text-sm">
                yourdomain.com/blog/{slug || 'your-post-slug'}
              </div>
              <div className="text-gray-600 text-sm line-clamp-2">
                {metaDescription || 'Your meta description will appear here...'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="w-5 h-5" />
            Social Media Image
          </CardTitle>
          <CardDescription>
            Upload an image for social media sharing (recommended: 1200x630px)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {socialImage ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
               <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={socialImage instanceof File ? URL.createObjectURL(socialImage) : socialImage}
                    alt="Social media preview"
                    fill
                    className="object-cover"
                  />
                </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setValue('socialImage', undefined)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Perfect! This image will be used when your post is shared on social media.
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload Social Image</h3>
              <p className="text-muted-foreground mb-4">
                Recommended size: 1200x630px for optimal social media display
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="social-upload"
              />
              <Button type="button" asChild>
                <label htmlFor="social-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hash className="w-5 h-5" />
            Tags
          </CardTitle>
          <CardDescription>
            Add tags to help readers discover your content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Tags ({tags.length})</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add New Tag */}
          <div className="space-y-2">
            <Label htmlFor="newTag">Add Tags</Label>
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  id="newTag"
                  placeholder="e.g., JavaScript, Tutorial, Web Development..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(newTag.length > 0)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(newTag)}
                  disabled={!newTag.trim() || tags.includes(newTag.trim())}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-1 z-10 border shadow-lg">
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground px-2 py-1">Suggestions</p>
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => addTag(suggestion)}
                          className="w-full text-left px-2 py-1 text-sm rounded hover:bg-accent transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Popular Tags */}
          {tags.length === 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Popular Tags</Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="text-xs px-2 py-1 rounded border border-dashed border-muted-foreground/50 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}