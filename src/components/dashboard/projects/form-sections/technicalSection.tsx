"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ProjectFormData } from "@/lib/schemas/project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Database, Cpu, Layers } from "lucide-react";

interface TechnicalSectionProps {
  form: UseFormReturn<ProjectFormData>;
}

export default function TechnicalSection({ form }: TechnicalSectionProps) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "technologies"
  });

  const [newTech, setNewTech] = useState({ name: "", reason: "" });

  const addTechnology = () => {
    if (newTech.name && newTech.reason) {
      append(newTech);
      setNewTech({ name: "", reason: "" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <div className="space-y-6">
      {/* Technologies */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Cpu className="w-5 h-5" />
          Technologies Used *
        </Label>
        
        {/* Existing Technologies */}
        {fields.length > 0 && (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`technologies.${index}.name`}>
                            Technology Name
                          </Label>
                          <Input
                            {...register(`technologies.${index}.name`)}
                            placeholder="e.g., React"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`technologies.${index}.reason`}>
                            Why This Technology?
                          </Label>
                          <Input
                            {...register(`technologies.${index}.reason`)}
                            placeholder="e.g., Component-based architecture"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Technology */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Technology name"
                  value={newTech.name}
                  onChange={(e) => setNewTech(prev => ({ ...prev, name: e.target.value }))}
                  onKeyPress={handleKeyPress}
                />
                <Input
                  placeholder="Why did you choose this?"
                  value={newTech.reason}
                  onChange={(e) => setNewTech(prev => ({ ...prev, reason: e.target.value }))}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addTechnology}
                disabled={!newTech.name || !newTech.reason}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Technology
              </Button>
            </div>
          </CardContent>
        </Card>

        {errors.technologies && (
          <p className="text-sm text-destructive">{errors.technologies.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          List the main technologies, frameworks, and tools used in this project with reasons for choosing them.
        </p>
      </div>

      {/* Database */}
      <div className="space-y-2">
        <Label htmlFor="database" className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          Database & Data Storage *
        </Label>
        <Textarea
          id="database"
          placeholder="Describe your database choice, schema design, and data management approach..."
          rows={3}
          {...register('database')}
          className={errors.database ? 'border-destructive' : ''}
        />
        {errors.database && (
          <p className="text-sm text-destructive">{errors.database.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Explain your database technology, schema design decisions, and data management strategy.
        </p>
      </div>

      {/* API */}
      <div className="space-y-2">
        <Label htmlFor="api" className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          API & Backend Architecture *
        </Label>
        <Textarea
          id="api"
          placeholder="Describe your API design, endpoints, authentication, and backend architecture..."
          rows={3}
          {...register('api')}
          className={errors.api ? 'border-destructive' : ''}
        />
        {errors.api && (
          <p className="text-sm text-destructive">{errors.api.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Detail your API structure, authentication methods, and backend service organization.
        </p>
      </div>

      {/* Components */}
      <div className="space-y-2">
        <Label htmlFor="components" className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Component Architecture *
        </Label>
        <Textarea
          id="components"
          placeholder="Describe your component structure, design patterns, and frontend architecture..."
          rows={3}
          {...register('components')}
          className={errors.components ? 'border-destructive' : ''}
        />
        {errors.components && (
          <p className="text-sm text-destructive">{errors.components.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Explain your component organization, reusability patterns, and frontend architecture decisions.
        </p>
      </div>
    </div>
  );
}