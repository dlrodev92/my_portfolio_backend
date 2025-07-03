interface ProjectDetailPageProps {
    params: {
      slug: string;
    };
  }
  
  export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-title font-bold">Edit Project</h1>
          <p className="text-muted-foreground">
            Editing project: {params.slug}
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Project Editor</h2>
          <p className="text-muted-foreground">
            This is where you'll edit the project: <strong>{params.slug}</strong>
          </p>
        </div>
      </div>
    );
  }