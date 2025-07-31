import { FolderOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardCard from "../dashboardCard";

export default function ProjectsCard() {
  // TODO: Replace with actual data
  const projectCount = 12;

  return (
    <DashboardCard 
      title="Projects" 
      icon={<FolderOpen className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="text-2xl font-bold">{projectCount}</div>
      <p className="text-xs text-muted-foreground mb-4">
        Total projects
      </p>
      <Button asChild className="w-full" size="sm">
        <Link href="/dashboard/projects">
          <Settings className="w-4 h-4 mr-2" />
          Manage Projects
        </Link>
      </Button>
    </DashboardCard>
  );
}