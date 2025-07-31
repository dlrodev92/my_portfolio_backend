import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import AssessmentsContainer from "@/components/dashboard/assessments/assessmentsContainer";

export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-title font-bold">Assessments</h1>
          <p className="text-muted-foreground">
            Manage your university assessments and projects
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assessments/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Assessment
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <AssessmentsContainer />
    </div>
  );
}