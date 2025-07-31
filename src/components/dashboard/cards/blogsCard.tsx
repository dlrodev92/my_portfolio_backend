import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardCard from "../dashboardCard";

export default function BlogsCard() {
  // TODO: Replace with actual data
  const blogCount = 8;

  return (
    <DashboardCard 
      title="Blog Posts" 
      icon={<FileText className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="text-2xl font-bold">{blogCount}</div>
      <p className="text-xs text-muted-foreground mb-4">
        Published posts
      </p>
      <Button asChild className="w-full" size="sm">
        <Link href="/dashboard/blogs/new">
          <Plus className="w-4 h-4 mr-2" />
          Write New Post
        </Link>
      </Button>
    </DashboardCard>
  );
}