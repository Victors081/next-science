import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { QuartoOutput } from '@/lib/types';

interface ExperimentSummaryProps {
  output: QuartoOutput;
}

export function ExperimentSummary({ output }: ExperimentSummaryProps) {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Key Findings</CardTitle>
        <CardDescription>Summary of analysis results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {output.highlights && output.highlights.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Highlights</h4>
              <ul className="list-disc pl-5 space-y-2">
                {output.highlights.map((highlight, index) => (
                  <li key={index} className="text-sm">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {output.metrics?.main && output.metrics.main.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {output.metrics.main.map((metric, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted"
                  >
                    <div className="text-sm text-muted-foreground mb-1">
                      {metric.label}
                    </div>
                    <div className="text-2xl font-bold">
                      {metric.value.toLocaleString()}
                      {metric.unit && (
                        <span className="text-sm font-normal ml-1">
                          {metric.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
