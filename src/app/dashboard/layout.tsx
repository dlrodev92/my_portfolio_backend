import DashboardSidebar from "@/components/dashboard/dashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        
        <div className="flex-1">
          <main className="p-6">
            {children}
          </main>
        </div>
        
        
        <DashboardSidebar />
      </div>
    </div>
  );
}