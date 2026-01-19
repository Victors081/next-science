import Link from 'next/link';
import { getAllBlogPosts, getAllProjects } from '@/lib/content';
import { ContentCard } from '@/components/content/ContentCard';
import { Button } from '@/components/ui/button';

export default function Home() {
  const recentPosts = getAllBlogPosts().slice(0, 6);
  const recentProjects = getAllProjects().slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Next Science
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          A platform for blog posts, data experiments, and project showcases.
          Combining the power of Next.js with Quarto for reproducible data analysis.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/blog">Read Blog</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">View Projects</Link>
          </Button>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recent Posts</h2>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <ContentCard
                key={post.slug}
                item={post.metadata}
                href={`/blog/${post.slug}`}
                type="blog"
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recent Projects</h2>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <ContentCard
                key={project.slug}
                item={{
                  ...project.metadata,
                  date: project.metadata.date || new Date().toISOString().split('T')[0],
                  summary: project.metadata.description,
                  tags: project.metadata.stack,
                }}
                href={`/projects/${project.slug}`}
                type="project"
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {recentPosts.length === 0 && (
        <section className="text-center py-16">
          <p className="text-muted-foreground mb-6">
            No content yet. Get started by creating your first blog post!
          </p>
          <Button asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </section>
      )}
    </div>
  );
}
