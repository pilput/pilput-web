"use client";

import { useEffect, useMemo, useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { Coins, Users, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "cn";
import type { CorporateActionItem } from "@/types/corporate-action";
import type { Holding } from "@/types/holding";
import {
  fetchCorporateActionsMonth,
  normalizeSymbol,
} from "./fetchCorporateActions";

const MONTHS_BACK = 2;
const MONTHS_AHEAD = 1;

interface MyHoldingsCorporateActionsProps {
  holdings: Holding[];
}

export default function MyHoldingsCorporateActions({
  holdings,
}: MyHoldingsCorporateActionsProps) {
  const [actions, setActions] = useState<CorporateActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ownedSymbols = useMemo(() => {
    const set = new Set<string>();
    for (const h of holdings) {
      if (h.symbol) set.add(normalizeSymbol(h.symbol));
    }
    return set;
  }, [holdings]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const now = new Date();
        const months = Array.from(
          { length: MONTHS_BACK + MONTHS_AHEAD + 1 },
          (_, i) => addMonths(subMonths(now, MONTHS_BACK), i),
        );
        const results = await Promise.all(
          months.map((d) =>
            fetchCorporateActionsMonth(d.getMonth() + 1, d.getFullYear()),
          ),
        );
        if (cancelled) return;

        const from = format(subMonths(now, MONTHS_BACK), "yyyy-MM-dd");
        const to = format(addMonths(now, MONTHS_AHEAD), "yyyy-MM-dd");
        setActions(results.flat().filter((a) => a.date >= from && a.date <= to));
      } catch {
        if (!cancelled) setActions([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const today = format(new Date(), "yyyy-MM-dd");

  const { upcoming, past } = useMemo(() => {
    const owned = actions.filter((a) =>
      ownedSymbols.has(normalizeSymbol(a.symbol)),
    );
    return {
      upcoming: owned
        .filter((a) => a.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date)),
      past: owned
        .filter((a) => a.date < today)
        .sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [actions, ownedSymbols, today]);

  const isEmpty = upcoming.length === 0 && past.length === 0;

  return (
    <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
          My Holdings&apos; Corporate Actions
        </CardTitle>
        <CardDescription className="text-xs mt-1">
          Stocks you own · last {MONTHS_BACK} months to next {MONTHS_AHEAD}{" "}
          month
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        ) : ownedSymbols.size === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No holdings with a stock symbol yet.
          </p>
        ) : isEmpty ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No corporate actions for your stocks in this period.
          </p>
        ) : (
          <div className="space-y-4">
            {upcoming.length > 0 && (
              <ActionGroup label="Upcoming" actions={upcoming} />
            )}
            {past.length > 0 && (
              <ActionGroup label="Past" actions={past} muted />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActionGroup({
  label,
  actions,
  muted = false,
}: {
  label: string;
  actions: CorporateActionItem[];
  muted?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label} · {actions.length}
      </p>
      {actions.map((action, idx) => (
        <div
          key={`${action.symbol}-${action.type}-${action.date}-${idx}`}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 hover:bg-accent/30 transition-colors",
            muted && "opacity-70",
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                action.type === "dividend"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-violet-500/10 text-violet-600 dark:text-violet-400",
              )}
            >
              {action.type === "dividend" ? (
                <Coins className="h-3.5 w-3.5" />
              ) : (
                <Users className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">
                {action.symbol}{" "}
                <span className="text-muted-foreground font-normal">
                  · {action.name}
                </span>
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {action.type === "dividend" ? "Ex-date" : "RUPS"} ·{" "}
                {format(new Date(action.date), "d MMM yyyy")}
                {action.type === "dividend" && action.pay_date && (
                  <> · Pay {format(new Date(action.pay_date), "d MMM yyyy")}</>
                )}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            {action.type === "dividend" && action.amount != null ? (
              <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatCurrency(action.amount, action.currency)}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground">
                Meeting
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
