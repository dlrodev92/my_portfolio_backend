"use client";

import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "@/lib/schemas/project";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import Image from "next/image";

interface MediaSectionProps {
  form: UseFormReturn<ProjectFormData>;
}

export default function MediaSection({ form }: MediaSectionProps) {
  const { setValue, watch } = form;
  const [dragActive, setDragActive] = useState(false);
  const [screenshotDragActive, setScreenshotDragActive] = useState(false);
  
  const heroImage = watch('heroImage');
  const screenshots = watch('screenshots') || [];

  // Hero Image handlers
  const handleHeroDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleHeroDrop = useCallback((e: React.DragEvent) => {
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

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('heroImage', e.target.files[0]);
    }
  };

  // Screenshots handlers
  const handleScreenshotDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setScreenshotDragActive(true);
    } else if (e.type === "dragleave") {
      setScreenshotDragActive(false);
    }
  }, []);

  const handleScreenshotDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScreenshotDragActive(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        setValue('screenshots', [...screenshots, ...files]);
      }
    }
  }, [setValue, screenshots]);

  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setValue('screenshots', [...screenshots, ...files]);
    }
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    setValue('screenshots', newScreenshots);
  };

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-base font-medium">
          <ImageIcon className="w-5 h-5" />
          Hero Image *
        </Label>
        
        {heroImage ? (
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={URL.createObjectURL(heroImage)}
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
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline">{heroImage.name}</Badge>
                <Badge variant="secondary">
                  {(heroImage.size / 1024 / 1024).toFixed(2)} MB
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card
            className={`border-2 border-dashed transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleHeroDrag}
            onDragLeave={handleHeroDrag}
            onDragOver={handleHeroDrag}
            onDrop={handleHeroDrop}
          >
            <CardContent className="p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload Hero Image</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your hero image here, or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroFileChange}
                className="hidden"
                id="hero-upload"
              />
              <Button type="button" asChild>
                <label htmlFor="hero-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </CardContent>
          </Card>
        )}
        <p className="text-xs text-muted-foreground">
          This will be the main image representing your project. Recommended size: 1200x600px
        </p>
      </div>

      {/* Screenshots */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-base font-medium">
          <ImageIcon className="w-5 h-5" />
          Project Screenshots (optional)
        </Label>

        {screenshots.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {screenshots.map((file, index) => (
              <Card key={index}>
                <CardContent className="p-2">
                  <div className="relative">
                    <div className="relative w-full h-24 rounded overflow-hidden bg-muted">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeScreenshot(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {file.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card
          className={`border-2 border-dashed transition-colors ${
            screenshotDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragEnter={handleScreenshotDrag}
          onDragLeave={handleScreenshotDrag}
          onDragOver={handleScreenshotDrag}
          onDrop={handleScreenshotDrop}
        >
          <CardContent className="p-6 text-center">
            <Plus className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <h4 className="font-medium mb-2">Add Screenshots</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Drag and drop multiple images, or click to browse
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleScreenshotFileChange}
              className="hidden"
              id="screenshots-upload"
            />
            <Button type="button" variant="outline" size="sm" asChild>
              <label htmlFor="screenshots-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </CardContent>
        </Card>
        
        <p className="text-xs text-muted-foreground">
          Add multiple screenshots to showcase different aspects of your project
        </p>
      </div>
    </div>
  );
}