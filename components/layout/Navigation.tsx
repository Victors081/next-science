import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            Next Science
          </Link>
          <div className="flex gap-6 text-sm">
            <Link
              href="/blog"
              className="hover:text-muted-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/projects"
              className="hover:text-muted-foreground transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="hover:text-muted-foreground transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
