"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface AssessmentsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedTechs: string[];
  setSelectedTechs: (techs: string[]) => void;
  availableTags: string[];
  availableTechs: string[];
  totalAssessments: number;
  filteredCount: number;
}

export default function AssessmentsHeader({
  searchTerm,
  setSearchTerm,
  selectedTags,
  setSelectedTags,
  selectedTechs,
  setSelectedTechs,
  availableTags,
  availableTechs,
  totalAssessments,
  filteredCount,
}: AssessmentsHeaderProps) {
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isTechsOpen, setIsTechsOpen] = useState(false);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(
      selectedTags.includes(tagName)
        ? selectedTags.filter((tag) => tag !== tagName)
        : [...selectedTags, tagName]
    );
  };

  const handleTechToggle = (techName: string) => {
    setSelectedTechs(
      selectedTechs.includes(techName)
        ? selectedTechs.filter((tech) => tech !== techName)
        : [...selectedTechs, techName]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSelectedTechs([]);
  };

  const hasActiveFilters = searchTerm || selectedTags.length > 0 || selectedTechs.length > 0;

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tags Filter */}
        <Popover open={isTagsOpen} onOpenChange={setIsTagsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <h4 className="font-medium">Filter by Tags</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Technologies Filter */}
        <Popover open={isTechsOpen} onOpenChange={setIsTechsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Technologies
              {selectedTechs.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTechs.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <h4 className="font-medium">Filter by Technologies</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableTechs.map((tech) => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${tech}`}
                      checked={selectedTechs.includes(tech)}
                      onCheckedChange={() => handleTechToggle(tech)}
                    />
                    <label
                      htmlFor={`tech-${tech}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tech}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              Tag: {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedTechs.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1">
              Tech: {tech}
              <button
                onClick={() => handleTechToggle(tech)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results Counter */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalAssessments} assessments
      </div>
    </div>
  );
}