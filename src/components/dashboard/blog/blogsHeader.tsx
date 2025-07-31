import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Clock, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { BlogStats } from "@/lib/types/blogs";

interface BlogsHeaderProps {
  stats: BlogStats;
}

export default function BlogsHeader({ stats }: BlogsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-title font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog content and articles
          </p>
        </div>
        <Link href="/dashboard/blogs/new">
          <Button size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Posts */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Posts</div>
          </div>
        </div>

        {/* Published */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div>
            <div className="text-sm font-medium text-green-700 dark:text-green-300">{stats.published}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Published</div>
          </div>
        </div>

        {/* Drafts */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <div>
            <div className="text-sm font-medium text-orange-700 dark:text-orange-300">{stats.draft}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Drafts</div>
          </div>
        </div>

        {/* This Month */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <Calendar className="w-3 h-3 text-blue-600" />
          <div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">{stats.thisMonth}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">This Month</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
          <Eye className="w-3 h-3 text-purple-600" />
          <div>
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">{stats.totalViews.toLocaleString()}</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Total Views</div>
          </div>
        </div>

        {/* Avg Read Time */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
          <Clock className="w-3 h-3 text-emerald-600" />
          <div>
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{stats.avgReadTime}min</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Avg Read</div>
          </div>
        </div>
      </div>
    </div>
  );
}