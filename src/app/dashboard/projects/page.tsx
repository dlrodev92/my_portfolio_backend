import { prisma } from '@/lib/prisma/client';
import ProjectsHeader from '@/components/dashboard/projects/projectsHeader';
import ProjectsContainer from '@/components/dashboard/projects/projectsContainer';

async function getProjectsData() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        technologies: {
          select: {
            id: true,
            name: true,
            reason: true,
          }
        },
        projectTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const stats = {
      total: projects.length,
      live: projects.filter(p => p.status === 'LIVE').length,
      draft: projects.filter(p => p.status === 'IN_PROGRESS').length,
      archived: projects.filter(p => p.status === 'ARCHIVED').length,
      personal: projects.filter(p => p.type === 'PERSONAL').length,
      freelance: projects.filter(p => p.type === 'FREELANCE').length,
      devops: projects.filter(p => p.type === 'DEVOPS').length,
    };

    const techsSet = new Set<string>();
    const availableTechnologies = projects
      .flatMap(project => project.technologies)
      .filter(tech => {
        if (techsSet.has(tech.name)) {
          return false;
        }
        techsSet.add(tech.name);
        return true;
      })
      .map(tech => ({ id: tech.id, name: tech.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const availableTypes = Array.from(
      new Set(projects.map(p => p.type))
    ).sort() as ('PERSONAL' | 'FREELANCE' | 'DEVOPS')[];

    return {
      projects,
      stats,
      availableTechnologies,
      availableTypes
    };
  } catch (error) {
    console.error('Error fetching projects data:', error);
    return {
      projects: [],
      stats: {
        total: 0,
        live: 0,
        draft: 0,
        archived: 0,
        personal: 0,
        freelance: 0,
        devops: 0,
      },
      availableTechnologies: [],
      availableTypes: [] as ('PERSONAL' | 'FREELANCE' | 'DEVOPS')[]
    };
  }
}

export default async function ProjectsPage() {
  const { projects, stats, availableTechnologies, availableTypes } = await getProjectsData();

  return (
    <div className="space-y-6 w-full">
      <ProjectsHeader stats={stats} />
      
      <ProjectsContainer 
        projects={projects} 
        availableTechnologies={availableTechnologies}
        availableTypes={availableTypes}
      />
    </div>
  );
}