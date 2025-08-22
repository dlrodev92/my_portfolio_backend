"use client";

import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/lib/schemas/blog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText, FolderOpen, BookOpen, Plus } from "lucide-react";
import Image from "next/image";

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

interface BasicInfoStepProps {
  form: UseFormReturn<BlogFormData>;
  categories: Category[];
  series: Series[];
}

export default function BasicInfoStep({ form, categories, series }: BasicInfoStepProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const [dragActive, setDragActive] = useState(false);
  
  // State for creating new categories/series
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [showNewSeriesDialog, setShowNewSeriesDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSeriesData, setNewSeriesData] = useState({
    name: '',
    description: '',
    totalParts: 1
  });
  
  // Local state for dynamic categories/series
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [localSeries, setLocalSeries] = useState<Series[]>(series);
  
  const heroImage = watch('heroImage');
  const selectedSeriesId = watch('seriesId');
  const selectedCategory = watch('categoryId');
  const selectedSeries = localSeries.find(s => s.id.toString() === selectedSeriesId);

  // Hero Image handlers
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
        setValue('heroImage', file);
      }
    }
  }, [setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('heroImage', e.target.files[0]);
    }
  };

  // Create new category
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now(), // Temporary ID
      name: newCategoryName.trim(),
      slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    setLocalCategories([...localCategories, newCategory]);
    setValue('categoryId', `new-${newCategory.id}`);
    setValue('newCategoryName', newCategoryName.trim());
    setNewCategoryName('');
    setShowNewCategoryDialog(false);
  };

  // Create new series
  const handleCreateSeries = () => {
    if (!newSeriesData.name.trim()) return;

    const newSeries: Series = {
      id: Date.now(), // Temporary ID
      name: newSeriesData.name.trim(),
      slug: newSeriesData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newSeriesData.description.trim() || undefined,
      totalParts: newSeriesData.totalParts,
    };

    setLocalSeries([...localSeries, newSeries]);
    setValue('seriesId', `new-${newSeries.id}`);
    setValue('newSeriesData', newSeriesData); 
    setNewSeriesData({ name: '', description: '', totalParts: 1 });
    setShowNewSeriesDialog(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-title font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">
          Start with the essential details of your blog post
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Blog Title *
          </Label>
          <Input
            id="title"
            placeholder="e.g., Getting Started with Next.js"
            {...register('title')}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            A compelling title that clearly describes your post
          </p>
        </div>

        {/* Category with Create Option */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Category
          </Label>
          <div className="flex gap-2">
            <Select 
              value={selectedCategory || "none"} 
              onValueChange={(value) => setValue('categoryId', value === "none" ? undefined : value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Category</SelectItem>
                {localCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                    {category.id.toString().startsWith('new-') && (
                      <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a new category for organizing your blog posts
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCategoryName">Category Name</Label>
                    <Input
                      id="newCategoryName"
                      placeholder="e.g., Web Development"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>
                    Create Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-muted-foreground">
            Help readers find related content or create a new category
          </p>
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <Label htmlFor="subtitle">
          Subtitle (optional)
        </Label>
        <Input
          id="subtitle"
          placeholder="A brief subtitle to provide more context..."
          {...register('subtitle')}
        />
        <p className="text-xs text-muted-foreground">
          An optional subtitle to provide additional context
        </p>
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">
          Excerpt *
        </Label>
        <Textarea
          id="excerpt"
          placeholder="Write a compelling summary of your blog post that will appear in previews..."
          rows={3}
          {...register('excerpt')}
          className={errors.excerpt ? 'border-destructive' : ''}
        />
        {errors.excerpt && (
          <p className="text-sm text-destructive">{errors.excerpt.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          A brief summary that appears in blog previews and search results (max 300 characters)
        </p>
      </div>

      {/* Series with Create Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Series (optional)
          </Label>
          <div className="flex gap-2">
            <Select 
              value={selectedSeriesId || "none"} 
              onValueChange={(value) => setValue('seriesId', value === "none" ? undefined : value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Series</SelectItem>
                {localSeries.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name} ({s.totalParts} parts)
                    {s.id.toString().startsWith('new-') && (
                      <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={showNewSeriesDialog} onOpenChange={setShowNewSeriesDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Series</DialogTitle>
                  <DialogDescription>
                    Create a new series to group related blog posts together
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newSeriesName">Series Name</Label>
                    <Input
                      id="newSeriesName"
                      placeholder="e.g., Complete Guide to React"
                      value={newSeriesData.name}
                      onChange={(e) => setNewSeriesData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newSeriesDescription">Description (optional)</Label>
                    <Textarea
                      id="newSeriesDescription"
                      placeholder="Brief description of the series..."
                      rows={2}
                      value={newSeriesData.description}
                      onChange={(e) => setNewSeriesData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newSeriesTotalParts">Total Parts</Label>
                    <Input
                      id="newSeriesTotalParts"
                      type="number"
                      min="1"
                      placeholder="5"
                      value={newSeriesData.totalParts}
                      onChange={(e) => setNewSeriesData(prev => ({ ...prev, totalParts: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewSeriesDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSeries} disabled={!newSeriesData.name.trim()}>
                    Create Series
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-muted-foreground">
            Group related posts together or create a new series
          </p>
        </div>

        {selectedSeries && selectedSeriesId !== "none" && (
          <div className="space-y-2">
            <Label htmlFor="seriesPart">
              Part Number
            </Label>
            <Input
              id="seriesPart"
              type="number"
              min="1"
              max={selectedSeries.totalParts}
              placeholder="1"
              {...register('seriesPart', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Which part of the series is this? (1-{selectedSeries.totalParts})
            </p>
          </div>
        )}
      </div>

      {/* Hero Image - resto igual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="w-5 h-5" />
            Hero Image (optional)
          </CardTitle>
          <CardDescription>
            Upload a hero image that represents your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Resto del código de hero image igual que antes */}
          {heroImage ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={typeof heroImage === "object" ? URL.createObjectURL(heroImage) : heroImage}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setValue('heroImage', undefined)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heroImageAlt">Alt Text</Label>
                  <Input
                    id="heroImageAlt"
                    placeholder="Describe the image for accessibility..."
                    {...register('heroImageAlt')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroImageCaption">Caption (optional)</Label>
                  <Input
                    id="heroImageCaption"
                    placeholder="Optional caption for the image..."
                    {...register('heroImageCaption')}
                  />
                </div>
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
              <h3 className="text-lg font-medium mb-2">Upload Hero Image</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="hero-upload"
              />
              <Button type="button" asChild>
                <label htmlFor="hero-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}