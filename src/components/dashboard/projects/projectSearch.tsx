"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProjectsSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTech([]);
    setSelectedStatus("");
  };

  const hasActiveFilters = searchTerm || selectedTech.length > 0 || selectedStatus;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClearFilters} className="gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setSearchTerm("")}
              />
            </Badge>
          )}
          
          {selectedTech.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1">
              {tech}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setSelectedTech(prev => prev.filter(t => t !== tech))}
              />
            </Badge>
          ))}
          
          {selectedStatus && (
            <Badge variant="secondary" className="gap-1">
              Status: {selectedStatus}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setSelectedStatus("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}