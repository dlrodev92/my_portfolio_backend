import { prisma } from '@/lib/prisma/client';
import ProjectsHeader from '@/components/dashboard/projects/projectsHeader';
import ProjectsTable from '@/components/dashboard/projects/projectsTable';
import ProjectsSearch from '@/components/dashboard/projects/projectSearch';

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        technologies: true,
        projectTags: {
          include: {
            tag: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

async function getProjectsStats() {
  try {
    const totalProjects = await prisma.project.count();
    const liveProjects = await prisma.project.count({
      where: { status: 'LIVE' }
    });
    const draftProjects = await prisma.project.count({
      where: { status: 'IN_PROGRESS' }
    });

    return {
      total: totalProjects,
      live: liveProjects,
      draft: draftProjects,
    };
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return {
      total: 0,
      live: 0,
      draft: 0,
    };
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const stats = await getProjectsStats();

  return (
    <div className="space-y-6 max-w-6xl">
      <ProjectsHeader stats={stats} />
      
      <div className="space-y-4">
        <ProjectsSearch />
        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}