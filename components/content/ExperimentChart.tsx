import Image from 'next/image';
import { getQuartoAssetPath } from '@/lib/content';

interface ExperimentChartProps {
  slug: string;
  filename: string;
  alt: string;
  caption?: string;
}

export function ExperimentChart({
  slug,
  filename,
  alt,
  caption,
}: ExperimentChartProps) {
  const assetPath = getQuartoAssetPath(slug, filename);
  const isHtml = filename.endsWith('.html');

  if (isHtml) {
    // Render interactive HTML chart (e.g., Plotly)
    return (
      <figure className="my-8">
        <div className="relative w-full" style={{ minHeight: '500px' }}>
          <iframe
            src={assetPath}
            className="w-full rounded-lg border border-border"
            style={{ height: '500px', width: '100%' }}
            title={alt}
            allowFullScreen
          />
        </div>
        {caption && (
          <figcaption className="text-sm text-muted-foreground text-center mt-2">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Render static image
  return (
    <figure className="my-8">
      <div className="relative w-full h-auto">
        <Image
          src={assetPath}
          alt={alt}
          width={1200}
          height={800}
          className="rounded-lg border border-border"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
