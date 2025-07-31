"use client";

import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "@/lib/schemas/project";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Lightbulb, User, TrendingUp } from "lucide-react";

interface OverviewSectionProps {
  form: UseFormReturn<ProjectFormData>;
}

export default function OverviewSection({ form }: OverviewSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      {/* Problem */}
      <div className="space-y-2">
        <Label htmlFor="problem" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Problem Statement *
        </Label>
        <Textarea
          id="problem"
          placeholder="What problem does this project solve? What challenges were you addressing?"
          rows={4}
          {...register('problem')}
          className={errors.problem ? 'border-destructive' : ''}
        />
        {errors.problem && (
          <p className="text-sm text-destructive">{errors.problem.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Describe the core problem or challenge this project addresses. Be specific about the pain points.
        </p>
      </div>

      {/* Solution */}
      <div className="space-y-2">
        <Label htmlFor="solution" className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Solution Approach *
        </Label>
        <Textarea
          id="solution"
          placeholder="How did you solve this problem? What approach did you take?"
          rows={4}
          {...register('solution')}
          className={errors.solution ? 'border-destructive' : ''}
        />
        {errors.solution && (
          <p className="text-sm text-destructive">{errors.solution.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Explain your solution strategy, key features, and how it addresses the problem.
        </p>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Your Role *
        </Label>
        <Textarea
          id="role"
          placeholder="What was your specific role in this project? What responsibilities did you have?"
          rows={3}
          {...register('role')}
          className={errors.role ? 'border-destructive' : ''}
        />
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Detail your specific contributions, responsibilities, and areas of ownership.
        </p>
      </div>

      {/* Impact */}
      <div className="space-y-2">
        <Label htmlFor="impact" className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Project Impact *
        </Label>
        <Textarea
          id="impact"
          placeholder="What was the impact of this project? Include metrics, user feedback, or business outcomes if available."
          rows={4}
          {...register('impact')}
          className={errors.impact ? 'border-destructive' : ''}
        />
        {errors.impact && (
          <p className="text-sm text-destructive">{errors.impact.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Describe the measurable impact, user reception, business value, or personal learning outcomes.
        </p>
      </div>
    </div>
  );
}