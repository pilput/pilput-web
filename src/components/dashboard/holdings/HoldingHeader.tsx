import Link from "next/link";
import { PieChart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface HoldingHeaderProps {
  /** 1-12 */
  month?: number;
  year?: number;
  /** Show link to the overview page (defaults to true on the holdings list page) */
  showOverviewLink?: boolean;
}

export default function HoldingHeader({
  month,
  year,
  showOverviewLink = true,
}: HoldingHeaderProps) {
  const periodLabel =
    month && year && month >= 1 && month <= 12
      ? `${MONTH_LABELS[month - 1]} ${year}`
      : null;

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 flex items-center justify-center ring-1 ring-primary/10 shadow-sm">
          <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Portfolio Management
            </h1>
            {periodLabel && (
              <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium tracking-wide text-muted-foreground">
                {periodLabel}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Track, manage, and analyze your investment holdings
          </p>
        </div>
      </div>

      {showOverviewLink && (
        <div className="mt-3 ml-12 sm:ml-[52px]">
          <Button
            asChild
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs sm:text-sm font-medium text-primary hover:text-primary/80"
          >
            <Link href="/dashboard/holdings/overview" className="inline-flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Open portfolio overview
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
