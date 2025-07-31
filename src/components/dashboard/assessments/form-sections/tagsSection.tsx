"use client";

import { useState, KeyboardEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schemas/assessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Tag, Plus } from "lucide-react";

interface TagsSectionProps {
  form: UseFormReturn<AssessmentFormData>;
}

export default function TagsSection({ form }: TagsSectionProps) {
  const { watch, setValue } = form;
  const [inputValue, setInputValue] = useState("");
  const tags = watch('tags') || [];

  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setValue('tags', [...tags, trimmedTag]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Suggested tags for assessments
  const suggestedTags = [
  'Year 1',
  'Year 2',
  'Year 3',
  'Term 1',
  'Term 2',
  'Term 3',
  ];

  return (
    <div className="space-y-6">
      {/* Tags Input */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Tags</Label>
        <p className="text-xs text-muted-foreground">
          Add tags to help categorize and organize your assessment. Press Enter to add a tag.
        </p>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Type a tag and press Enter..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => addTag(inputValue)}
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Current Tags */}
      {tags.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Current Tags ({tags.length})</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 py-1 px-2">
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Tags */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">
          Suggested Tags:
        </Label>
        <div className="flex flex-wrap gap-2">
          {suggestedTags
            .filter(suggestion => !tags.includes(suggestion))
            .slice(0, 12) // Limit to 12 suggestions to avoid overwhelming
            .map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag(suggestion)}
                className="text-xs h-7"
              >
                + {suggestion}
              </Button>
            ))}
        </div>
        {suggestedTags.filter(suggestion => !tags.includes(suggestion)).length > 12 && (
          <p className="text-xs text-muted-foreground">
            And more suggestions available...
          </p>
        )}
      </div>

      {/* Empty State */}
      {tags.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
          <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No tags added yet</p>
          <p className="text-sm">Tags help organize and categorize your assessments</p>
        </div>
      )}

      {/* Helper Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 <strong>Tips for good tags:</strong></p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>Use relevant keywords that describe your assessment</li>
          <li>Include the course or subject area</li>
          <li>Mention the type of work (project, research, assignment)</li>
          <li>Add technology or methodology tags</li>
        </ul>
      </div>
    </div>
  );
}