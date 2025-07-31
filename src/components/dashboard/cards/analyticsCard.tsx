import { BarChart3 } from "lucide-react";
import DashboardCard from "../dashboardCard";

export default function AnalyticsCard() {
  return (
    <DashboardCard 
      title="Google Analytics" 
      icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
      className="relative opacity-75"
    >
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
    </DashboardCard>
  );
}