"use client";

import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "@/lib/schemas/project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Users } from "lucide-react";

interface MetricsSectionProps {
  form: UseFormReturn<ProjectFormData>;
}

export default function MetricsSection({ form }: MetricsSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Launch Date */}
        <div className="space-y-2">
          <Label htmlFor="launchDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Launch Date *
          </Label>
          <Input
            id="launchDate"
            placeholder="e.g., March 2024, Q1 2024, or specific date"
            {...register('launchDate')}
            className={errors.launchDate ? 'border-destructive' : ''}
          />
          {errors.launchDate && (
            <p className="text-sm text-destructive">{errors.launchDate.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            When was this project launched or completed?
          </p>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Project Duration *
          </Label>
          <Input
            id="duration"
            placeholder="e.g., 3 months, 6 weeks, 2 years"
            {...register('duration')}
            className={errors.duration ? 'border-destructive' : ''}
          />
          {errors.duration && (
            <p className="text-sm text-destructive">{errors.duration.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            How long did this project take from start to finish?
          </p>
        </div>
      </div>

      {/* Team Size */}
      <div className="space-y-2">
        <Label htmlFor="teamSize" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Team Size & Composition *
        </Label>
        <Input
          id="teamSize"
          placeholder="e.g., Solo project, 3 developers + 1 designer, 5-person cross-functional team"
          {...register('teamSize')}
          className={errors.teamSize ? 'border-destructive' : ''}
        />
        {errors.teamSize && (
          <p className="text-sm text-destructive">{errors.teamSize.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Describe the team composition and your collaboration approach
        </p>
      </div>
    </div>
  );
}