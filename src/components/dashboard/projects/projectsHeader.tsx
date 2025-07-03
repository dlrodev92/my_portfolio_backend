import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";

interface ProjectsHeaderProps {
  stats: {
    total: number;
    live: number;
    draft: number;
  };
}

export default function ProjectsHeader({ stats }: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-title font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Manage your portfolio projects
        </p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderOpen className="w-4 h-4" />
            <span>{stats.total} total projects</span>
          </div>
          <div className="text-sm text-green-600">
            {stats.live} live
          </div>
          <div className="text-sm text-orange-600">
            {stats.draft} in progress
          </div>
        </div>
      </div>
      
      <Button size="lg" className="gap-2">
        <Plus className="w-4 h-4" />
        New Project
      </Button>
    </div>
  );
}