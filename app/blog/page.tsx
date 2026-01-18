import { getAllBlogPosts } from '@/lib/content';
import { ContentCard } from '@/components/content/ContentCard';

export const metadata = {
  title: 'Blog | Next Science',
  description: 'Thoughts and insights on data science',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Thoughts, insights, and learnings about data science and development
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ContentCard
              key={post.slug}
              item={post.metadata}
              href={`/blog/${post.slug}`}
              type="blog"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No blog posts yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
