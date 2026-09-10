import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function holdingsChartColorVar(index: number) {
  return `var(--chart-${(index % 5) + 1})`;
}

interface AllocationBreakdownProps {
  platformDistribution: { platform: string; value: number; percent: number }[];
}

export function AllocationBreakdown({ platformDistribution }: AllocationBreakdownProps) {
  const items = platformDistribution.map((d) => ({ label: d.platform, percent: d.percent }));

  return (
    <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          Platform Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5">
        <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: holdingsChartColorVar(index) }}
                />
                <span className="truncate font-medium">{item.label}</span>
              </div>
              <span className="font-bold ml-2 shrink-0 tabular-nums">
                {item.percent.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: holdingsChartColorVar(index),
                }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No data</p>
        )}
        </div>
      </CardContent>
    </Card>
  );
}
