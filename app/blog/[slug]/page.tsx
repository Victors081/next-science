import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getBlogPost, getBlogSlugs, getQuartoOutput, formatDate } from '@/lib/content';
import { ExperimentSummary } from '@/components/content/ExperimentSummary';
import { ExperimentChart } from '@/components/content/ExperimentChart';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMDXComponents } from '@/lib/mdx-components';

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Hide draft posts in production
  if (process.env.NODE_ENV === 'production' && post.metadata.status === 'draft') {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.metadata.title} | Next Science`,
    description: post.metadata.summary,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Hide draft posts in production
  if (process.env.NODE_ENV === 'production' && post.metadata.status === 'draft') {
    notFound();
  }

  const quartoOutput = post.metadata.hasQuarto ? getQuartoOutput(slug) : null;
  const components = useMDXComponents({
    ExperimentChart: (props: any) => (
      <ExperimentChart slug={slug} {...props} />
    ),
    ExperimentSummary: () => quartoOutput ? <ExperimentSummary output={quartoOutput} /> : null,
  });

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <time>{formatDate(post.metadata.date)}</time>
          {post.metadata.type && (
            <>
              <span>•</span>
              <Badge variant="outline" className="capitalize">
                {post.metadata.type}
              </Badge>
            </>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {post.metadata.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          {post.metadata.summary}
        </p>
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.metadata.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <Separator className="my-8" />

      {/* MDX Content */}
      <div className="prose max-w-none">
        <MDXRemote source={post.content} components={components} />
      </div>
    </article>
  );
}
