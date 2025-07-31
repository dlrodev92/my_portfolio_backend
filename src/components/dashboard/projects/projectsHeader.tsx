import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, User, Building, Server } from "lucide-react";
import Link from "next/link";

interface ProjectsHeaderProps {
  stats: {
    total: number;
    live: number;
    draft: number;
    archived: number;
    personal: number;
    freelance: number;
    devops: number;
  };
}

export default function ProjectsHeader({ stats }: ProjectsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-title font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Total */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <FolderOpen className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Status Stats */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div>
            <div className="text-sm font-medium text-green-700 dark:text-green-300">{stats.live}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Live</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <div>
            <div className="text-sm font-medium text-orange-700 dark:text-orange-300">{stats.draft}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">In Progress</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-950/20">
          <div className="w-2 h-2 bg-gray-500 rounded-full" />
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.archived}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Archived</div>
          </div>
        </div>

        {/* Type Stats */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <User className="w-3 h-3 text-blue-600" />
          <div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">{stats.personal}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Personal</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
          <Building className="w-3 h-3 text-purple-600" />
          <div>
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">{stats.freelance}</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Freelance</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
          <Server className="w-3 h-3 text-emerald-600" />
          <div>
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{stats.devops}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">DevOps</div>
          </div>
        </div>
      </div>
    </div>
  );
}