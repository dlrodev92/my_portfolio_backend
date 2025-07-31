"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schemas/assessment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Calendar, AlignLeft } from "lucide-react";

interface BasicInfoSectionProps {
  form: UseFormReturn<AssessmentFormData>;
}

export default function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Assessment Title *
        </Label>
        <Input
          id="title"
          placeholder="e.g., Web Development Portfolio Project"
          {...register('title')}
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          A clear, descriptive title for your assessment
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4" />
          Description *
        </Label>
        <Textarea
          id="description"
          placeholder="Provide a comprehensive description of your assessment, including objectives, methodology, and key outcomes..."
          rows={4}
          {...register('description')}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Detailed description of what this assessment covers
        </p>
      </div>

      {/* Published Date */}
      <div className="space-y-2">
        <Label htmlFor="publishedAt" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Published Date (optional)
        </Label>
        <Input
          id="publishedAt"
          type="datetime-local"
          {...register('publishedAt')}
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to save as draft. Set a date to publish the assessment.
        </p>
      </div>
    </div>
  );
}