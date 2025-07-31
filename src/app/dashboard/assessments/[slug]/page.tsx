import AssessmentEditForm from "@/components/dashboard/assessments/assessmentEditForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AssessmentDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AssessmentDetailPage({ params }: AssessmentDetailPageProps) {
  const { slug } = await params;

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
          <h1 className="text-3xl font-title font-bold">Edit Assessment</h1>
          <p className="text-muted-foreground">
            Modify assessment details and content
          </p>
        </div>
      </div>

      {/* Form */}
      <AssessmentEditForm slug={slug} />
    </div>
  );
}