
import { prisma } from '@/lib/prisma/client';
import DashboardOverview from "@/components/dashboard/dashboardOverview";

async function getDashboardStats() {
  try {
    const [projectsCount, blogsCount, assessmentsCount, totalViews] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.assessment.count(),
      prisma.blogPost.aggregate({
        _sum: { views: true }
      })
    ]);

    return {
      projects: projectsCount,
      blogs: blogsCount,
      assessments: assessmentsCount,
      totalViews: totalViews._sum.views || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      projects: 0,
      blogs: 0,
      assessments: 0,
      totalViews: 0
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-title font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio admin dashboard
        </p>
      </div>
      <DashboardOverview stats={stats} />
    </div>
  );
}