"use client";

import { useState, useMemo } from "react";
import ProjectsSearch from "./projectSearch";
import ProjectsTable from "./projectsTable";
import { ProjectWithRelations, AvailableTechnology, SearchFilters } from "@/lib/types/projects";

interface ProjectsContainerProps {
  projects: ProjectWithRelations[];
  availableTechnologies: AvailableTechnology[];
  availableTypes: ('PERSONAL' | 'FREELANCE' | 'DEVOPS')[];
}

export default function ProjectsContainer({ 
  projects, 
  availableTechnologies,
  availableTypes
}: ProjectsContainerProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    selectedTech: [],
    selectedStatus: "",
    selectedType: "",
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(searchLower);
        const matchesSubtitle = project.subtitle.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesSubtitle) {
          return false;
        }
      }

      // Filter by status
      if (filters.selectedStatus && project.status !== filters.selectedStatus) {
        return false;
      }

      // Filter by type
      if (filters.selectedType && project.type !== filters.selectedType) {
        return false;
      }

      // Filter by technologies
      if (filters.selectedTech.length > 0) {
        const projectTechNames = project.technologies.map(tech => tech.name);
        const hasMatchingTech = filters.selectedTech.some(selectedTech => 
          projectTechNames.includes(selectedTech)
        );
        
        if (!hasMatchingTech) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters]);

  return (
    <div className="space-y-4 w-full">
      <ProjectsSearch
        availableTechnologies={availableTechnologies}
        availableTypes={availableTypes}
        onFiltersChange={setFilters}
      />
      <ProjectsTable projects={filteredProjects} />
    </div>
  );
}