import { PieChart, TrendingUp } from "lucide-react";

export default function HoldingHeader() {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <PieChart className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Portfolio Management
        </h1>
      </div>
      <p className="text-muted-foreground text-xs sm:text-sm ml-10">
        Track, manage, and analyze your investment holdings
      </p>
    </div>
  );
}
