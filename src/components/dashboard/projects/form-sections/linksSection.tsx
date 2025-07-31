"use client";

import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "@/lib/schemas/project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Github, FileText } from "lucide-react";

interface LinksSectionProps {
  form: UseFormReturn<ProjectFormData>;
}

export default function LinksSection({ form }: LinksSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="liveDemo" className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Live Demo URL
        </Label>
        <Input
          id="liveDemo"
          type="url"
          placeholder="https://your-project.com"
          {...register('liveDemo')}
          className={errors.liveDemo ? 'border-destructive' : ''}
        />
        {errors.liveDemo && (
          <p className="text-sm text-destructive">{errors.liveDemo.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Link to the live version of your project
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="github" className="flex items-center gap-2">
          <Github className="w-4 h-4" />
          GitHub Repository
        </Label>
        <Input
          id="github"
          type="url"
          placeholder="https://github.com/username/repository"
          {...register('github')}
          className={errors.github ? 'border-destructive' : ''}
        />
        {errors.github && (
          <p className="text-sm text-destructive">{errors.github.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Link to the source code repository
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="caseStudy" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Case Study URL
        </Label>
        <Input
          id="caseStudy"
          type="url"
          placeholder="https://link-to-detailed-case-study.com"
          {...register('caseStudy')}
          className={errors.caseStudy ? 'border-destructive' : ''}
        />
        {errors.caseStudy && (
          <p className="text-sm text-destructive">{errors.caseStudy.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Link to a detailed case study or blog post about the project
        </p>
      </div>
    </div>
  );
}