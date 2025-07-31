import AssessmentCreateForm from "@/components/dashboard/assessments/assesmentCreateForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/assessments">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-title font-bold">Create New Assessment</h1>
          <p className="text-muted-foreground">
            Document your university assessment or project
          </p>
        </div>
      </div>

      {/* Form */}
      <AssessmentCreateForm />
    </div>
  );
}