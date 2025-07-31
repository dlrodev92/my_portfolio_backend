"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import DeleteModal from "@/components/deleteModal";
import { Edit, Trash2, ExternalLink, MoreHorizontal, FolderOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ProjectWithRelations } from "@/lib/types/projects";

interface Technology {
  id: number;
  name: string;
  reason: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface ProjectTag {
  tag: Tag;
}

interface Project {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  status: 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
  createdAt: string;
  heroImage: string;
  liveDemo?: string;
  github?: string;
  technologies: Technology[];
  projectTags: ProjectTag[];
}


interface ProjectsTableProps {
  projects: ProjectWithRelations[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const [projectToDelete, setProjectToDelete] = useState<ProjectWithRelations | null>(null);
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Project deleted successfully');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Something went wrong while deleting the project');
      throw error; 
    }
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 mb-4 bg-muted rounded-full flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-sm">
            Get started by creating your first project to showcase your work
          </p>
          <Button asChild>
            <Link href="/dashboard/projects/new">Create Your First Project</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Table
          className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="group">
                <TableCell>
                  <Avatar className="w-10 h-10">
                    <AvatarImage 
                      src={project.heroImage} 
                      alt={project.title}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-muted">
                      {project.title.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium leading-none">{project.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {project.subtitle}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <Badge key={tech.id} variant="outline" className="text-xs">
                        {tech.name}
                      </Badge>
                    ))}
                    {project.technologies.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(project.status)}
                  >
                    {project.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(
                    typeof project.createdAt === "string"
                      ? project.createdAt
                      : project.createdAt.toISOString()
                  )}
                </TableCell>
                
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/projects/${project.slug}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      
                      {project.liveDemo && (
                        <DropdownMenuItem asChild>
                          <a 
                            href={project.liveDemo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Live
                          </a>
                        </DropdownMenuItem>
                      )}
                      
                      {project.github && (
                        <DropdownMenuItem asChild>
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            GitHub
                          </a>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setProjectToDelete(project)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description="This action cannot be undone and will permanently remove the project and all its associated data."
        itemName={projectToDelete?.title}
      />
    </>
  );
}