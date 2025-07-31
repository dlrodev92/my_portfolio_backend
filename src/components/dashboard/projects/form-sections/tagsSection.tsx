"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "@/lib/schemas/project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Tag, Hash } from "lucide-react";

interface TagsSectionProps {
  form: UseFormReturn<ProjectFormData>;
}

// Common project tags for suggestions
const SUGGESTED_TAGS = [
  'Frontend', 'Backend', 'Full Stack', 'Mobile', 'Web App', 'API',
  'E-commerce', 'Dashboard', 'Portfolio', 'Blog', 'SaaS', 'MVP',
  'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python',
  'TypeScript', 'JavaScript', 'Responsive', 'PWA', 'Real-time',
  'Authentication', 'Database', 'Cloud', 'DevOps', 'Testing',
  'UI/UX', 'Design System', 'Accessibility', 'Performance', 'SEO'
];

export default function TagsSection({ form }: TagsSectionProps) {
  const { setValue, watch } = form;
  const tags = watch('tags') || [];
  
  const [newTag, setNewTag] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (newTag.length > 0) {
      const filtered = SUGGESTED_TAGS.filter(tag => 
        tag.toLowerCase().includes(newTag.toLowerCase()) && 
        !tags.includes(tag)
      ).slice(0, 8);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [newTag, tags]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setValue('tags', [...tags, trimmedTag]);
      setNewTag('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setValue('tags', newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const addSuggestedTag = (tag: string) => {
    addTag(tag);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Project Tags
          </CardTitle>
          <CardDescription>
            Add tags to help categorize and filter your project. These will be used for search and organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Tags ({tags.length})</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="default" className="gap-1 py-1">
                    <Hash className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-destructive-foreground/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add New Tag */}
          <div className="space-y-2">
            <Label htmlFor="newTag" className="text-sm font-medium">Add New Tag</Label>
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  id="newTag"
                  placeholder="e.g., React, E-commerce, Full Stack..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(newTag.length > 0)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(newTag)}
                  disabled={!newTag.trim() || tags.includes(newTag.trim())}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-1 z-10 border shadow-lg">
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground px-2 py-1">Suggestions</p>
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => addSuggestedTag(suggestion)}
                          className="w-full text-left px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Hash className="w-3 h-3 inline mr-1" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Popular Tags */}
          {tags.length === 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Popular Tags</Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.slice(0, 12).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addSuggestedTag(tag)}
                    className="text-xs px-2 py-1 rounded border border-dashed border-muted-foreground/50 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Click on any tag above to add it, or type your own
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        <p><strong>Tip:</strong> Use specific tags like "React", "E-commerce", or "Real-time" to make your projects easier to find and filter.</p>
      </div>
    </div>
  );
}