import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mb-3 mt-6">{children}</h3>
    ),
    p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="underline underline-offset-2 hover:text-muted-foreground"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
        {children}
      </pre>
    ),
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
    li: ({ children }) => <li className="mb-2">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border my-8" />,
    img: (props) => (
      <Image
        {...props}
        alt={props.alt || ''}
        width={800}
        height={600}
        className="rounded-lg my-6"
      />
    ),
    ...components,
  };
}
