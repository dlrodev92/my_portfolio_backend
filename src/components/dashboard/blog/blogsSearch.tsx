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
import { Search, X, ChevronDown, FolderOpen, Tag, BookOpen } from "lucide-react";
import { 
  AvailableCategory, 
  AvailableTag, 
  AvailableSeries,
  BlogSearchFilters 
} from "@/lib/types/blogs";

interface BlogsSearchProps {
  availableCategories: AvailableCategory[];
  availableTags: AvailableTag[];
  availableSeries: AvailableSeries[];
  onFiltersChange: (filters: BlogSearchFilters) => void;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export default function BlogsSearch({ 
  availableCategories, 
  availableTags,
  availableSeries,
  onFiltersChange 
}: BlogsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");

  const updateFilters = (newFilters: Partial<BlogSearchFilters>) => {
    const updatedFilters: BlogSearchFilters = {
      searchTerm: newFilters.searchTerm ?? searchTerm,
      selectedCategories: newFilters.selectedCategories ?? selectedCategories,
      selectedTags: newFilters.selectedTags ?? selectedTags,
      selectedStatus: newFilters.selectedStatus ?? selectedStatus,
      selectedSeries: newFilters.selectedSeries ?? selectedSeries,
    };

    if (newFilters.searchTerm !== undefined) setSearchTerm(newFilters.searchTerm);
    if (newFilters.selectedCategories !== undefined) setSelectedCategories(newFilters.selectedCategories);
    if (newFilters.selectedTags !== undefined) setSelectedTags(newFilters.selectedTags);
    if (newFilters.selectedStatus !== undefined) setSelectedStatus(newFilters.selectedStatus);
    if (newFilters.selectedSeries !== undefined) setSelectedSeries(newFilters.selectedSeries);

    onFiltersChange(updatedFilters);
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ searchTerm: value });
  };

  const handleCategoryToggle = (categoryName: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    
    updateFilters({ selectedCategories: newSelectedCategories });
  };

  const handleTagToggle = (tagName: string) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    
    updateFilters({ selectedTags: newSelectedTags });
  };

  const handleStatusChange = (status: string) => {
    updateFilters({ selectedStatus: status });
  };

  const handleSeriesChange = (series: string) => {
    updateFilters({ selectedSeries: series });
  };

  const handleClearFilters = () => {
    updateFilters({
      searchTerm: "",
      selectedCategories: [],
      selectedTags: [],
      selectedStatus: "",
      selectedSeries: "",
    });
  };

  const removeCategory = (categoryToRemove: string) => {
    updateFilters({ 
      selectedCategories: selectedCategories.filter(cat => cat !== categoryToRemove) 
    });
  };

  const removeTag = (tagToRemove: string) => {
    updateFilters({ 
      selectedTags: selectedTags.filter(tag => tag !== tagToRemove) 
    });
  };

  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || selectedTags.length > 0 || selectedStatus || selectedSeries;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Categories
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedCategories.length}
                </Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableCategories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => handleCategoryToggle(category.name)}
              >
                {category.name}
              </DropdownMenuCheckboxItem>
            ))}
            {availableCategories.length === 0 && (
              <DropdownMenuItem disabled>
                No categories available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tags Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Tag className="w-4 h-4" />
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTags.length}
                </Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                checked={selectedTags.includes(tag.name)}
                onCheckedChange={() => handleTagToggle(tag.name)}
              >
                {tag.name}
              </DropdownMenuCheckboxItem>
            ))}
            {availableTags.length === 0 && (
              <DropdownMenuItem disabled>
                No tags available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Series Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Series
              {selectedSeries && (
                <Badge variant="secondary" className="ml-1">
                  1
                </Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Filter by Series</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleSeriesChange("")}
              className={selectedSeries === "" ? "bg-accent" : ""}
            >
              All Series
            </DropdownMenuItem>
            {availableSeries.map((series) => (
              <DropdownMenuItem
                key={series.id}
                onClick={() => handleSeriesChange(series.name)}
                className={selectedSeries === series.name ? "bg-accent" : ""}
              >
                {series.name}
              </DropdownMenuItem>
            ))}
            {availableSeries.length === 0 && (
              <DropdownMenuItem disabled>
                No series available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
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

      {/* Active Filters */}
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

          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              Category: {category}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeCategory(category)}
              />
            </Badge>
          ))}

          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}

          {selectedSeries && (
            <Badge variant="secondary" className="gap-1">
              Series: {selectedSeries}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleSeriesChange("")}
              />
            </Badge>
          )}
          
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