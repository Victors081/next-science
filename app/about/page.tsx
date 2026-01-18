export const metadata = {
  title: 'About | Next Science',
  description: 'About Next Science platform',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
        About
      </h1>

      <div className="prose max-w-none">
        <p className="text-xl text-muted-foreground mb-8">
          Next Science is a platform for sharing blog posts, data analyses with Quarto, and project showcases.
        </p>

        <h2>What is this?</h2>
        <p>
          This platform combines the power of <strong>Next.js 16</strong> with <strong>Quarto</strong> to create
          a modern, fast, and reproducible platform for data science content.
        </p>

        <h2>Features</h2>
        <ul>
          <li><strong>Blog Posts:</strong> Write blog posts with optional Quarto integration for data analysis</li>
          <li><strong>Quarto Integration:</strong> Data analysis with Quarto and Python, seamlessly integrated into blog posts</li>
          <li><strong>Projects:</strong> Showcase of work and projects</li>
          <li><strong>Dark Mode:</strong> Built-in dark mode support</li>
          <li><strong>Fast:</strong> Static generation for optimal performance</li>
        </ul>

        <h2>Tech Stack</h2>
        <ul>
          <li>Next.js 16 (App Router, React Server Components)</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS for styling</li>
          <li>MDX for content</li>
          <li>Quarto for data analysis</li>
          <li>Python for data processing</li>
        </ul>

        <h2>Get in Touch</h2>
        <p>
          Feel free to reach out on{' '}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          or{' '}
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          .
        </p>
      </div>
    </div>
  );
}
