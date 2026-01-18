export interface ContentMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  status?: 'draft' | 'published';
}

export interface BlogPostMeta extends ContentMeta {
  featured?: boolean;
  hasQuarto?: boolean;
  type?: 'exploratory' | 'validation' | 'prototype';
}

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  link?: string;
  github?: string;
  stack: string[];
  status: 'active' | 'completed' | 'archived';
  date?: string;
}

export interface QuartoOutput {
  highlights: string[];
  metrics: {
    main: Array<{
      label: string;
      value: number;
      unit: string;
    }>;
  };
}

export interface ContentItem<T = ContentMeta> {
  slug: string;
  metadata: T;
  content: string;
}

export type BlogPostItem = ContentItem<BlogPostMeta>;
export type ProjectItem = ContentItem<ProjectMeta>;
