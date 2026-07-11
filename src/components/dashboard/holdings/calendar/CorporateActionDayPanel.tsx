"use client";

import { format, parseISO } from "date-fns";
import { Coins, Users, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import type { CorporateActionItem } from "@/types/corporate-action";

interface CorporateActionDayPanelProps {
  date: string | null;
  actions: CorporateActionItem[];
}

export default function CorporateActionDayPanel({
  date,
  actions,
}: CorporateActionDayPanelProps) {
  return (
    <Card className="glass-card border-glow-hover shadow-premium rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
        <CardTitle className="text-sm font-semibold">
          {date ? format(parseISO(date), "EEEE, d MMMM yyyy") : "Select a date"}
        </CardTitle>
        <CardDescription className="text-xs">
          {date
            ? `${actions.length} corporate action${actions.length === 1 ? "" : "s"}`
            : "Pick a day on the calendar to see its events"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5">
        {!date ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Info className="h-5 w-5 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">No date selected</p>
          </div>
        ) : actions.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            No dividend or RUPS events on this date.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {actions.map((action, idx) => (
              <div
                key={`${action.symbol}-${action.type}-${idx}`}
                className="rounded-lg border border-border/50 bg-muted/20 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        action.type === "dividend"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                      )}
                    >
                      {action.type === "dividend" ? (
                        <Coins className="h-3.5 w-3.5" />
                      ) : (
                        <Users className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{action.symbol}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {action.name}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0",
                      action.type === "dividend"
                        ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                        : "border-violet-500/30 text-violet-700 dark:text-violet-300"
                    )}
                  >
                    {action.type === "dividend" ? "Dividend" : "RUPS"}
                  </Badge>
                </div>

                <div className="mt-2 space-y-1 text-[11px]">
                  {action.type === "dividend" && action.amount != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount / share</span>
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(action.amount, action.currency)}
                      </span>
                    </div>
                  )}
                  {action.pay_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pay date</span>
                      <span className="font-medium tabular-nums">
                        {format(parseISO(action.pay_date), "d MMM yyyy")}
                      </span>
                    </div>
                  )}
                  {action.note && (
                    <p className="pt-1 text-muted-foreground leading-relaxed">
                      {action.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
