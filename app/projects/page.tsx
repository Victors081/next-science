import { getAllProjects } from '@/lib/content';
import { ContentCard } from '@/components/content/ContentCard';

export const metadata = {
  title: 'Projects | Next Science',
  description: 'Showcase of projects and work',
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-lg text-muted-foreground">
          A showcase of my projects and work
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ContentCard
              key={project.slug}
              item={{
                ...project.metadata,
                summary: project.metadata.description,
                tags: project.metadata.stack,
              }}
              href={`/projects/${project.slug}`}
              type="project"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No projects yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
