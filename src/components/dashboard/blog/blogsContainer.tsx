"use client";

import { useState, useMemo } from "react";
import BlogsSearch from "./blogsSearch";
import BlogsTable from "./blogsTable";
import { 
  BlogPostWithRelations, 
  AvailableCategory, 
  AvailableTag, 
  AvailableSeries,
  BlogSearchFilters 
} from "@/lib/types/blogs";

interface BlogsContainerProps {
  blogs: BlogPostWithRelations[];
  availableCategories: AvailableCategory[];
  availableTags: AvailableTag[];
  availableSeries: AvailableSeries[];
}

export default function BlogsContainer({ 
  blogs, 
  availableCategories,
  availableTags,
  availableSeries
}: BlogsContainerProps) {
  const [filters, setFilters] = useState<BlogSearchFilters>({
    searchTerm: "",
    selectedCategories: [],
    selectedTags: [],
    selectedStatus: "",
    selectedSeries: "",
  });

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = blog.title.toLowerCase().includes(searchLower);
        const matchesExcerpt = blog.excerpt.toLowerCase().includes(searchLower);
        const matchesContent = blog.contentBlocks.some(block => 
          block.content.toLowerCase().includes(searchLower)
        );
        
        if (!matchesTitle && !matchesExcerpt && !matchesContent) {
          return false;
        }
      }

      // Filter by status (published/draft)
      const now = new Date();
      const isPublished = blog.publishedAt && blog.publishedAt <= now;
      
      if (filters.selectedStatus === "published" && !isPublished) {
        return false;
      }
      if (filters.selectedStatus === "draft" && isPublished) {
        return false;
      }

      // Filter by categories
      if (filters.selectedCategories.length > 0) {
        if (!blog.category || !filters.selectedCategories.includes(blog.category.name)) {
          return false;
        }
      }

      // Filter by series
      if (filters.selectedSeries && filters.selectedSeries !== "") {
        if (!blog.series || blog.series.name !== filters.selectedSeries) {
          return false;
        }
      }

      // Filter by tags
      if (filters.selectedTags.length > 0) {
        const blogTagNames = blog.blogPostTags.map(pt => pt.blogTag.name);
        const hasMatchingTag = filters.selectedTags.some(selectedTag => 
          blogTagNames.includes(selectedTag)
        );
        
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  }, [blogs, filters]);

  return (
    <div className="space-y-4">
      <BlogsSearch
        availableCategories={availableCategories}
        availableTags={availableTags}
        availableSeries={availableSeries}
        onFiltersChange={setFilters}
      />
      <BlogsTable blogs={filteredBlogs} />
    </div>
  );
}