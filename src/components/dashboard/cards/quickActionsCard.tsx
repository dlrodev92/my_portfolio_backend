import { Zap, Eye, Upload, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardCard from "../dashboardCard";

export default function QuickActionsCard() {
  return (
    <DashboardCard 
      title="Quick Actions" 
      icon={<Zap className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start" size="sm" asChild>
          <Link href="/" target="_blank">
            <Eye className="w-4 h-4 mr-2" />
            View Portfolio
          </Link>
        </Button>
        
        <Button variant="outline" className="w-full justify-start" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
        
        <Button variant="outline" className="w-full justify-start" size="sm">
          <Mail className="w-4 h-4 mr-2" />
          Contact Messages
        </Button>
      </div>
    </DashboardCard>
  );
}