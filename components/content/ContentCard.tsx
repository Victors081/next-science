import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/content';
import type { ContentMeta } from '@/lib/types';

interface ContentCardProps {
  item: ContentMeta;
  href: string;
  type?: 'experiment' | 'blog' | 'project';
}

export function ContentCard({ item, href, type = 'blog' }: ContentCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-colors hover:border-foreground">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <time className="text-sm text-muted-foreground">
              {formatDate(item.date)}
            </time>
            {type && (
              <Badge variant="outline" className="capitalize">
                {type}
              </Badge>
            )}
          </div>
          <CardTitle className="group-hover:text-muted-foreground transition-colors">
            {item.title}
          </CardTitle>
          <CardDescription>{item.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {item.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
