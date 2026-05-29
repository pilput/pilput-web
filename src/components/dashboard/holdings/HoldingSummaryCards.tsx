import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, TrendingUp } from "lucide-react";
import type { Holding, HoldingSummaryResponse } from "@/types/holding";
import { parseDecimal } from "@/types/holding";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface HoldingSummaryCardsProps {
  holdings: Holding[];
  summary?: HoldingSummaryResponse | null;
  isLoading: boolean;
  hideValues?: boolean;
  primaryCurrency?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export default function HoldingSummaryCards({
  holdings,
  summary,
  isLoading,
  hideValues = false,
  primaryCurrency: primaryCurrencyProp,
}: HoldingSummaryCardsProps) {
  const totalInvested = summary
    ? parseDecimal(summary.totalInvested)
    : holdings.reduce(
        (sum, holding) => sum + parseDecimal(holding.invested_amount),
        0,
      );
  const totalCurrent = summary
    ? parseDecimal(summary.totalCurrentValue)
    : holdings.reduce(
        (sum, holding) => sum + parseDecimal(holding.current_value),
        0,
      );
  const totalRealized = summary
    ? parseDecimal(summary.totalProfitLoss)
    : (() => {
        const hasGainAmounts = holdings.every(
          (h) => h.gain_amount != null && h.gain_amount !== "",
        );
        return hasGainAmounts
          ? holdings.reduce(
              (sum, holding) => sum + parseDecimal(holding.gain_amount),
              0,
            )
          : totalCurrent - totalInvested;
      })();
  const totalPercent = summary
    ? parseDecimal(summary.totalProfitLossPercentage)
    : totalInvested > 0
      ? (totalRealized / totalInvested) * 100
      : 0;
  const holdingsCount = summary?.holdingsCount ?? holdings.length;

  const mostCommonCurrency =
    holdings.length > 0
      ? holdings.reduce(
          (acc, holding) => {
            acc[holding.currency] = (acc[holding.currency] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        )
      : {};
  const primaryCurrency =
    primaryCurrencyProp ??
    (Object.keys(mostCommonCurrency).length > 0
      ? Object.entries(mostCommonCurrency).sort((a, b) => b[1] - a[1])[0][0]
      : "IDR");

  const maskValue = () => "••••••";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse overflow-hidden glass-card border-glow-hover shadow-premium rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-5 pt-4 sm:pt-5">
              <div className="h-3 sm:h-4 w-16 sm:w-24 bg-muted/80 rounded-md" />
              <div className="h-8 w-8 bg-muted/80 rounded-lg" />
            </CardHeader>
            <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
              <div className="h-6 sm:h-8 w-20 sm:w-32 bg-muted/80 rounded-md mb-2" />
              <div className="h-3 w-12 sm:w-16 bg-muted/60 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Invested",
      value: hideValues ? maskValue() : formatCurrency(totalInvested, primaryCurrency),
      icon: Wallet,
      valueColor: "text-foreground",
      helper: `${holdingsCount} asset${holdingsCount === 1 ? "" : "s"} tracked`,
    },
    {
      title: "Current Value",
      value: hideValues ? maskValue() : formatCurrency(totalCurrent, primaryCurrency),
      icon: DollarSign,
      valueColor: "text-foreground",
      helper: hideValues
        ? "—"
        : totalInvested > 0
          ? `${((totalCurrent / totalInvested - 1) * 100).toFixed(2)}% vs invested`
          : "—",
    },
    {
      title: "Profit / Loss",
      value: hideValues
        ? maskValue()
        : `${totalRealized > 0 ? "+" : ""}${formatCurrency(Math.abs(totalRealized), primaryCurrency)}`,
      icon: totalRealized >= 0 ? ArrowUpRight : ArrowDownRight,
      valueColor:
        hideValues
          ? "text-foreground"
          : totalRealized >= 0
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-destructive",
      iconSemantic: totalRealized >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
      helper: primaryCurrency,
    },
    {
      title: "Return Rate",
      value: hideValues ? maskValue() : `${totalPercent > 0 ? "+" : ""}${totalPercent.toFixed(2)}%`,
      icon: TrendingUp,
      valueColor:
        hideValues
          ? "text-foreground"
          : totalPercent >= 0
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-destructive",
      iconSemantic: totalPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
      helper:
        hideValues
          ? "—"
          : totalPercent >= 0
            ? "Gaining ground"
            : "Losing ground",
    },
  ];

  return (
    <motion.div
      className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const iconColor =
          "iconSemantic" in card && card.iconSemantic
            ? card.iconSemantic
            : "text-muted-foreground";
        return (
          <motion.div key={card.title} variants={cardVariants}>
            <Card className="relative overflow-hidden glass-card border-glow-hover shadow-premium hover:shadow-premium-hover rounded-2xl transition-all duration-300 group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-5 pt-4 sm:pt-5 relative">
                <CardTitle className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate pr-1 text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="p-2 rounded-xl bg-muted/70 ring-1 ring-border/40 transition-transform duration-300 group-hover:scale-105">
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconColor} shrink-0`} />
                </div>
              </CardHeader>

              <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 relative">
                <div
                  className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight break-words ${card.valueColor}`}
                >
                  {card.value}
                </div>
                {card.helper && (
                  <p className="mt-1.5 text-[11px] text-muted-foreground truncate">
                    {card.helper}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
