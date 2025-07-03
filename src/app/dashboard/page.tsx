import DashboardOverview from "@/components/dashboard/dashboardOverview";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-title font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio admin dashboard
        </p>
      </div>
      <DashboardOverview />
    </div>
  );
}