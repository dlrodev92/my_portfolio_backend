import ProjectEditForm from "@/components/dashboard/projects/projectEditForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {

  const {slug} = await params
  
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-title font-bold">Edit Project</h1>
          <p className="text-muted-foreground">
            Modify project details and content
          </p>
        </div>
      </div>

      <ProjectEditForm slug={slug} />
    </div>
  );
}