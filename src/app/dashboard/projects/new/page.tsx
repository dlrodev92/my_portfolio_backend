import ProjectCreateForm from "@/components/dashboard/projects/projectCreateForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateProjectPage() {
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
          <h1 className="text-3xl font-title font-bold">Create New Project</h1>
          <p className="text-muted-foreground">
            Add a new project to your portfolio
          </p>
        </div>
      </div>

      {/* Form */}
      <ProjectCreateForm />
    </div>
  );
}