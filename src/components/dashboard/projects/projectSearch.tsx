"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, X, ChevronDown, User, Building, Server } from "lucide-react";
import { AvailableTechnology, SearchFilters } from "@/lib/types/projects";

interface ProjectsSearchProps {
  availableTechnologies: AvailableTechnology[];
  availableTypes: ('PERSONAL' | 'FREELANCE' | 'DEVOPS')[];
  onFiltersChange: (filters: SearchFilters) => void;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "LIVE", label: "Live" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "ARCHIVED", label: "Archived" },
];

const typeOptions = [
  { value: "", label: "All Types", icon: null },
  { value: "PERSONAL", label: "Personal", icon: User },
  { value: "FREELANCE", label: "Freelance", icon: Building },
  { value: "DEVOPS", label: "DevOps", icon: Server },
];

export default function ProjectsSearch({ 
  availableTechnologies, 
  onFiltersChange 
}: ProjectsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters: SearchFilters = {
      searchTerm: newFilters.searchTerm ?? searchTerm,
      selectedTech: newFilters.selectedTech ?? selectedTech,
      selectedStatus: newFilters.selectedStatus ?? selectedStatus,
      selectedType: newFilters.selectedType ?? selectedType,
    };

    if (newFilters.searchTerm !== undefined) setSearchTerm(newFilters.searchTerm);
    if (newFilters.selectedTech !== undefined) setSelectedTech(newFilters.selectedTech);
    if (newFilters.selectedStatus !== undefined) setSelectedStatus(newFilters.selectedStatus);
    if (newFilters.selectedType !== undefined) setSelectedType(newFilters.selectedType);

    onFiltersChange(updatedFilters);
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ searchTerm: value });
  };

  const handleTechToggle = (techName: string) => {
    const newSelectedTech = selectedTech.includes(techName)
      ? selectedTech.filter(t => t !== techName)
      : [...selectedTech, techName];
    
    updateFilters({ selectedTech: newSelectedTech });
  };

  const handleStatusChange = (status: string) => {
    updateFilters({ selectedStatus: status });
  };

  const handleTypeChange = (type: string) => {
    updateFilters({ selectedType: type });
  };

  const handleClearFilters = () => {
    updateFilters({
      searchTerm: "",
      selectedTech: [],
      selectedStatus: "",
      selectedType: "",
    });
  };

  const removeTech = (techToRemove: string) => {
    updateFilters({ 
      selectedTech: selectedTech.filter(tech => tech !== techToRemove) 
    });
  };

  const hasActiveFilters = searchTerm || selectedTech.length > 0 || selectedStatus || selectedType;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects by title..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Type
              {selectedType && (
                <Badge variant="secondary" className="ml-1">
                  1
                </Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {typeOptions.map((type) => {
              const IconComponent = type.icon;
              return (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`${selectedType === type.value ? "bg-accent" : ""} ${IconComponent ? "gap-2" : ""}`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {type.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Technologies
              {selectedTech.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTech.length}
                </Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Technology</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableTechnologies.map((tech) => (
              <DropdownMenuCheckboxItem
                key={tech.id}
                checked={selectedTech.includes(tech.name)}
                onCheckedChange={() => handleTechToggle(tech.name)}
              >
                {tech.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Status
              {selectedStatus && (
                <Badge variant="secondary" className="ml-1">
                  1
                </Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={selectedStatus === status.value ? "bg-accent" : ""}
              >
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClearFilters} className="gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleSearchChange("")}
              />
            </Badge>
          )}

          {selectedType && (
            <Badge variant="secondary" className="gap-1">
              Type: {typeOptions.find(t => t.value === selectedType)?.label}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleTypeChange("")}
              />
            </Badge>
          )}
          
          {selectedTech.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1">
              {tech}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeTech(tech)}
              />
            </Badge>
          ))}
          
          {selectedStatus && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleStatusChange("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}