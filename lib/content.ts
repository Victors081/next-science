import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type {
  ContentItem,
  BlogPostMeta,
  ProjectMeta,
  BlogPostItem,
  ProjectItem,
  QuartoOutput,
} from './types';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all content items from a specific section
 */
function getAllContent<T extends BlogPostMeta | ProjectMeta>(
  section: 'blog' | 'projects'
): ContentItem<T>[] {
  const sectionPath = path.join(contentDirectory, section);

  if (!fs.existsSync(sectionPath)) {
    return [];
  }

  const files = fs.readdirSync(sectionPath);

  const items = files
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(sectionPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        metadata: { ...data, slug } as T,
        content,
      };
    });

  // Sort by date (most recent first)
  return items.sort((a, b) => {
    const dateA = new Date(a.metadata.date || '');
    const dateB = new Date(b.metadata.date || '');
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get a single content item by slug
 */
function getContentBySlug<T extends BlogPostMeta | ProjectMeta>(
  section: 'blog' | 'projects',
  slug: string
): ContentItem<T> | null {
  const fullPath = path.join(contentDirectory, section, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    metadata: { ...data, slug } as T,
    content,
  };
}

/**
 * Get all blog posts
 */
export function getAllBlogPosts(): BlogPostItem[] {
  const posts = getAllContent<BlogPostMeta>('blog');

  // Filter out drafts in production
  if (process.env.NODE_ENV === 'production') {
    return posts.filter((post) => post.metadata.status !== 'draft');
  }

  return posts;
}

/**
 * Get blog post by slug
 */
export function getBlogPost(slug: string): BlogPostItem | null {
  return getContentBySlug<BlogPostMeta>('blog', slug);
}

/**
 * Get all blog slugs for static generation
 */
export function getBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}

/**
 * Get all projects
 */
export function getAllProjects(): ProjectItem[] {
  return getAllContent<ProjectMeta>('projects');
}

/**
 * Get project by slug
 */
export function getProject(slug: string): ProjectItem | null {
  return getContentBySlug<ProjectMeta>('projects', slug);
}

/**
 * Get all project slugs for static generation
 */
export function getProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.slug);
}

/**
 * Load Quarto output for a blog post
 */
export function getQuartoOutput(slug: string): QuartoOutput | null {
  const summaryPath = path.join(
    process.cwd(),
    'public',
    'experiments',
    slug,
    'summary.json'
  );

  if (!fs.existsSync(summaryPath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(summaryPath, 'utf8');
    return JSON.parse(fileContents) as QuartoOutput;
  } catch (error) {
    console.error(`Error loading Quarto output for ${slug}:`, error);
    return null;
  }
}

/**
 * Get path to Quarto asset
 */
export function getQuartoAssetPath(slug: string, filename: string): string {
  return `/experiments/${slug}/${filename}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
