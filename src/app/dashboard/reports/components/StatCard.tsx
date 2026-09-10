import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconClassName: string;
  isLoading: boolean;
}

export function StatCard({ title, value, icon: Icon, iconClassName, isLoading }: StatCardProps) {
  return (
    <div className="glass-card border-glow-hover rounded-2xl transition-all duration-300 group flex items-center justify-between p-5">
      <div className="min-w-0">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          {title}
        </span>
        {isLoading ? (
          <Skeleton className="h-7 w-20 mt-1.5" />
        ) : (
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1.5 truncate">
            {value}
          </div>
        )}
      </div>
      <div
        className={`p-2.5 rounded-xl ring-1 ring-border/40 group-hover:scale-105 transition-transform shrink-0 ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
