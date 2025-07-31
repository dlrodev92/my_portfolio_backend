// src/components/dashboard/dashboardOverview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, FileText, BarChart3, Plus, Settings, } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardStats {
  projects: number;
  blogs: number;
  assessments: number;
  totalViews: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Projects Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.projects}</div>
          <p className="text-xs text-muted-foreground mb-4">
            Total projects
          </p>
          <Button asChild className="w-full" size="sm">
            <Link href="/dashboard/projects">
              <Settings className="w-4 h-4 mr-2" />
              Manage Projects
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Blog Posts Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.blogs}</div>
          <p className="text-xs text-muted-foreground mb-4">
            Published posts
          </p>
          <Button asChild className="w-full" size="sm">
            <Link href="/dashboard/blogs">
              <Plus className="w-4 h-4 mr-2" />
              Write New Post
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Assesments Posts Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assessments</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.assessments}</div>
          <p className="text-xs text-muted-foreground mb-4">
            Published assessments
          </p>
          <Button asChild className="w-full" size="sm">
            <Link href="/dashboard/assessments">
              <Plus className="w-4 h-4 mr-2" />
              Write New Assessment
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Google Analytics Card */}
      <Card className="hover:shadow-md transition-shadow relative opacity-75">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Google Analytics</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">--</div>
          <p className="text-xs text-muted-foreground mb-4">
            Analytics data
          </p>
          <div className="bg-muted/50 border border-dashed border-muted-foreground/25 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
            <p className="text-xs text-muted-foreground">
              Analytics integration planned
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}