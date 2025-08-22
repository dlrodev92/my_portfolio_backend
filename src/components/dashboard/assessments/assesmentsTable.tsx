"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, } from "lucide-react";
import Link from "next/link";
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
import { AssessmentWithRelations } from "@/lib/types/assessments";

interface AssessmentsTableProps {
  assessments: AssessmentWithRelations[];
}

export default function AssessmentsTable({ assessments }: AssessmentsTableProps) {
  const getStatusBadge = (assessment: AssessmentWithRelations) => {
    const isPublished = assessment.publishedAt && assessment.publishedAt <= new Date();
    
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
            <TableHead>Technologies</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No assessments found
              </TableCell>
            </TableRow>
          ) : (
            assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium line-clamp-1">{assessment.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                      {assessment.description}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>{getStatusBadge(assessment)}</TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {assessment.technologies.slice(0, 2).map((tech) => (
                      <Badge key={tech.id} variant="outline" className="text-xs">
                        {tech.name}
                      </Badge>
                    ))}
                    {assessment.technologies.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{assessment.technologies.length - 2}
                      </Badge>
                    )}
                    {assessment.technologies.length === 0 && (
                      <span className="text-muted-foreground text-sm">No technologies</span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {assessment.assessmentTags.slice(0, 2).map((tagRel) => (
                      <Badge key={tagRel.id} variant="secondary" className="text-xs">
                        {tagRel.tag.name}
                      </Badge>
                    ))}
                    {assessment.assessmentTags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{assessment.assessmentTags.length - 2}
                      </Badge>
                    )}
                    {assessment.assessmentTags.length === 0 && (
                      <span className="text-muted-foreground text-sm">No tags</span>
                    )}
                  </div>
                </TableCell>
                
             <TableCell>
                <div className="text-sm text-muted-foreground">
                    {assessment._count?.contentBlocks || assessment.contentBlocks?.length || 0} blocks, {assessment._count?.images || assessment.images?.length || 0} images, {assessment._count?.files || assessment.files?.length || 0} files
                </div>
            </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/assessments/${assessment.slug}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
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