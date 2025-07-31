"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schemas/assessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image as LucideImage, FileText, Trash2 } from "lucide-react";
import Image from "next/image";

interface MediaSectionProps {
  form: UseFormReturn<AssessmentFormData>;
}

export default function MediaSection({ form }: MediaSectionProps) {
  const { watch, setValue } = form;
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  
  const mainImage = watch('mainImage');
  const images = watch('images') || [];
  const files = watch('files') || [];
  const imageDescriptions = watch('imageDescriptions') || [];
  const imageAlts = watch('imageAlts') || [];
  const imageCaptions = watch('imageCaptions') || [];
  const fileNames = watch('fileNames') || [];

  // Handle main image upload
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('mainImage', file);
      const reader = new FileReader();
      reader.onload = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle multiple images upload
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setValue('images', [...images, ...filesArray]);
      
      // Create previews
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagesPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      // Initialize metadata arrays
      const newDescriptions = [...imageDescriptions];
      const newAlts = [...imageAlts];
      const newCaptions = [...imageCaptions];
      
      filesArray.forEach((_, index) => {
        const currentIndex = images.length + index;
        newDescriptions[currentIndex] = '';
        newAlts[currentIndex] = '';
        newCaptions[currentIndex] = '';
      });

      setValue('imageDescriptions', newDescriptions);
      setValue('imageAlts', newAlts);
      setValue('imageCaptions', newCaptions);
    }
  };

  // Handle files upload
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      
      setValue('files', [...files, ...filesArray]);
      
      // Initialize file names
      const newFileNames = [...fileNames];
      filesArray.forEach((file, index) => {
        const currentIndex = files.length + index;
        newFileNames[currentIndex] = file.name;
      });
      setValue('fileNames', newFileNames);
      
    }
  };

  // Remove main image
  const removeMainImage = () => {
    setValue('mainImage', undefined);
    setMainImagePreview(null);
  };

  // Remove gallery image
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagesPreviews.filter((_, i) => i !== index);
    const updatedDescriptions = imageDescriptions.filter((_, i) => i !== index);
    const updatedAlts = imageAlts.filter((_, i) => i !== index);
    const updatedCaptions = imageCaptions.filter((_, i) => i !== index);
    
    setValue('images', updatedImages);
    setImagesPreviews(updatedPreviews);
    setValue('imageDescriptions', updatedDescriptions);
    setValue('imageAlts', updatedAlts);
    setValue('imageCaptions', updatedCaptions);
  };

  // Remove file
  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedFileNames = fileNames.filter((_, i) => i !== index);
    
    setValue('files', updatedFiles);
    setValue('fileNames', updatedFileNames);
  };

  // Update image metadata
  const updateImageMetadata = (index: number, field: 'description' | 'alt' | 'caption', value: string) => {
    if (field === 'description') {
      const updated = [...imageDescriptions];
      updated[index] = value;
      setValue('imageDescriptions', updated);
    } else if (field === 'alt') {
      const updated = [...imageAlts];
      updated[index] = value;
      setValue('imageAlts', updated);
    } else if (field === 'caption') {
      const updated = [...imageCaptions];
      updated[index] = value;
      setValue('imageCaptions', updated);
    }
  };

  // Update file name
  const updateFileName = (index: number, value: string) => {
    const updated = [...fileNames];
    updated[index] = value;
    setValue('fileNames', updated);
  };

  return (
    <Tabs defaultValue="main-image" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="main-image">Main Image</TabsTrigger>
        <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>

      {/* Main Image Tab */}
      <TabsContent value="main-image" className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Main Image (Optional)</Label>
          <p className="text-xs text-muted-foreground mb-3">
            Upload a main image that represents your assessment
          </p>
          
          {mainImage || mainImagePreview ? (
            <Card>
              <CardContent className="p-4">
                {mainImagePreview && (
                  <div style={{ position: "relative" }}>
                    <Image
                      src={mainImagePreview || ""}
                      alt="Main image preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      width={400}
                      height={192}
                      style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeMainImage}
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {mainImage instanceof File ? mainImage.name : 'Main image selected'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <Label htmlFor="main-image" className="cursor-pointer">
                <span className="text-sm font-medium">Click to upload main image</span>
                <Input
                  id="main-image"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Image Gallery Tab */}
      <TabsContent value="gallery" className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Image Gallery (Optional)</Label>
          <p className="text-xs text-muted-foreground mb-3">
            Upload multiple images to showcase your assessment
          </p>

          {/* Upload Area */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center mb-4">
            <LucideImage className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <Label htmlFor="gallery-images" className="cursor-pointer">
              <span className="text-sm font-medium">Click to upload images</span>
              <Input
                id="gallery-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                className="hidden"
              />
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Select multiple images (PNG, JPG, GIF up to 10MB each)
            </p>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="space-y-4">
              {images.map((image, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {imagesPreviews[index] && (
                        <Image
                          src={imagesPreviews[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          width={96}
                          height={96}
                          style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                        />
                      )}
                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder="Alt text (for accessibility)"
                          value={imageAlts[index] || ''}
                          onChange={(e) => updateImageMetadata(index, 'alt', e.target.value)}
                        />
                        <Input
                          placeholder="Caption (optional)"
                          value={imageCaptions[index] || ''}
                          onChange={(e) => updateImageMetadata(index, 'caption', e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      {/* Files Tab */}
      <TabsContent value="files" className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Files (Optional)</Label>
          <p className="text-xs text-muted-foreground mb-3">
            Upload documents, PDFs, code files, or any other relevant files
          </p>

          {/* Upload Area */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center mb-4">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <Label htmlFor="files-upload" className="cursor-pointer">
              <span className="text-sm font-medium">Click to upload files</span>
              <Input
                id="files-upload"
                type="file"
                multiple
                onChange={handleFilesChange}
                className="hidden"
              />
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Any file type up to 50MB each
            </p>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-3">
              {files.map((file, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <FileText className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <Input
                          placeholder="Display name for this file"
                          value={fileNames[index] || ''}
                          onChange={(e) => updateFileName(index, e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {file instanceof File ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : 'File selected'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}