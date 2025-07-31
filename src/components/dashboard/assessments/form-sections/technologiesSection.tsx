"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schemas/assessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Code2 } from "lucide-react";

interface TechnologiesSectionProps {
  form: UseFormReturn<AssessmentFormData>;
}

export default function TechnologiesSection({ form }: TechnologiesSectionProps) {
  const { watch, setValue } = form;
  const technologies = watch('technologies') || [];

  const addTechnology = () => {
    setValue('technologies', [...technologies, { name: '', reason: '' }]);
  };

  const removeTechnology = (index: number) => {
    const updatedTechnologies = technologies.filter((_, i) => i !== index);
    setValue('technologies', updatedTechnologies);
  };

  const updateTechnology = (index: number, field: 'name' | 'reason', value: string) => {
    const updatedTechnologies = technologies.map((tech, i) => 
      i === index ? { ...tech, [field]: value } : tech
    );
    setValue('technologies', updatedTechnologies);
  };

  return (
    <div className="space-y-6">
      {/* Add Technology Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addTechnology}
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Technology
      </Button>

      {/* Technologies List */}
      {technologies.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No technologies added yet</p>
          <p className="text-sm">Click "Add Technology" to include tools and frameworks used</p>
        </div>
      ) : (
        <div className="space-y-4">
          {technologies.map((tech, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Technology Name */}
                    <div>
                      <Label className="text-sm font-medium">
                        Technology Name *
                      </Label>
                      <Input
                        placeholder="e.g., React, Python, MySQL, Figma..."
                        value={tech.name}
                        onChange={(e) => updateTechnology(index, 'name', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Reason (Optional) */}
                    <div>
                      <Label className="text-sm font-medium">
                        Why did you use this? (Optional)
                      </Label>
                      <Textarea
                        placeholder="Explain why you chose this technology, what problem it solved, or how it helped your project..."
                        value={tech.reason || ''}
                        onChange={(e) => updateTechnology(index, 'reason', e.target.value)}
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTechnology(index)}
                    className="text-destructive hover:text-destructive mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {technologies.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>{technologies.length} technolog{technologies.length !== 1 ? 'ies' : 'y'} added</p>
          <p>💡 Include programming languages, frameworks, databases, tools, design software, etc.</p>
        </div>
      )}

      {/* Quick Add Suggestions */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Quick Add Common Technologies:
        </Label>
        <div className="flex flex-wrap gap-2">
          {['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'MySQL', 'MongoDB', 'Git', 'Figma', 'Photoshop'].map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const exists = technologies.some(tech => tech.name.toLowerCase() === suggestion.toLowerCase());
                if (!exists) {
                  setValue('technologies', [...technologies, { name: suggestion, reason: '' }]);
                }
              }}
              className="text-xs"
            >
              + {suggestion}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Click to quickly add common technologies (you can edit the reason afterwards)
        </p>
      </div>
    </div>
  );
}