"use client";

import { useState, useEffect } from "react";
import { AssessmentWithRelations } from "@/lib/types/assessments";
import AssessmentsHeader from "./assessmentsHeader";
import AssessmentsTable from "./assesmentsTable";
import { Loader2 } from "lucide-react";

export default function AssessmentsContainer() {
  const [assessments, setAssessments] = useState<AssessmentWithRelations[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  // Fetch assessments
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/assessments');
        if (response.ok) {
          const data = await response.json();
          setAssessments(data);
          setFilteredAssessments(data);
        } else {
          console.error('Failed to fetch assessments');
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = assessments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((assessment) =>
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((assessment) =>
        assessment.assessmentTags.some((tag) =>
          selectedTags.includes(tag.tag.name)
        )
      );
    }

    // Technologies filter
    if (selectedTechs.length > 0) {
      filtered = filtered.filter((assessment) =>
        assessment.technologies.some((tech) =>
          selectedTechs.includes(tech.name)
        )
      );
    }

    setFilteredAssessments(filtered);
  }, [assessments, searchTerm, selectedTags, selectedTechs]);

  // Get available filter options
  const availableTags = Array.from(
    new Set(
      assessments.flatMap((assessment) =>
        assessment.assessmentTags.map((tag) => tag.tag.name)
      )
    )
  );

  const availableTechs = Array.from(
    new Set(
      assessments.flatMap((assessment) =>
        assessment.technologies.map((tech) => tech.name)
      )
    )
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading assessments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AssessmentsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedTechs={selectedTechs}
        setSelectedTechs={setSelectedTechs}
        availableTags={availableTags}
        availableTechs={availableTechs}
        totalAssessments={assessments.length}
        filteredCount={filteredAssessments.length}
      />

      <AssessmentsTable assessments={filteredAssessments} />
    </div>
  );
}