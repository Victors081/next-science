import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getProject, getProjectSlugs } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMDXComponents } from '@/lib/mdx-components';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.metadata.title} | Next Science`,
    description: project.metadata.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const components = useMDXComponents({});

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="capitalize">
            {project.metadata.status}
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {project.metadata.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          {project.metadata.description}
        </p>

        {/* Links */}
        <div className="flex gap-3 mb-6">
          {project.metadata.link && (
            <Button asChild variant="default">
              <Link href={project.metadata.link} target="_blank" rel="noopener noreferrer">
                View Project
              </Link>
            </Button>
          )}
          {project.metadata.github && (
            <Button asChild variant="outline">
              <Link href={project.metadata.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
          )}
        </div>

        {/* Tech Stack */}
        {project.metadata.stack && project.metadata.stack.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.metadata.stack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </header>

      <Separator className="my-8" />

      {/* MDX Content */}
      <div className="prose max-w-none">
        <MDXRemote source={project.content} components={components} />
      </div>
    </article>
  );
}
