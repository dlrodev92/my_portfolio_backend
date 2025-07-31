"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link"; // Add this import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogPostWithRelations } from "@/lib/types/blogs";

interface BlogsTableProps {
  blogs: BlogPostWithRelations[];
}

// Función helper para formatear fechas sin date-fns
const formatTimeAgo = (date: Date | null): string => {
  if (!date) return "Never";
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSecs < 60) return "Just now";
  if (diffInMins < 60) return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

export default function BlogsTable({ blogs }: BlogsTableProps) {
  const getStatusBadge = (blog: BlogPostWithRelations) => {
    const now = new Date();
    const isPublished = blog.publishedAt && blog.publishedAt <= now;
    
    if (isPublished) {
      return <Badge variant="default">Published</Badge>;
    } else {
      return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Read Time</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No blog posts found
              </TableCell>
            </TableRow>
          ) : (
            blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <div>
                    <div className="font-medium line-clamp-1">{blog.title}</div>
                    {blog.subtitle && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {blog.subtitle}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(blog)}</TableCell>
                <TableCell>
                  {blog.category ? (
                    <Badge variant="outline">{blog.category.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">No category</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {blog.views.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>{blog.readTime} min</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatTimeAgo(blog.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/blogs/${blog.slug}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}