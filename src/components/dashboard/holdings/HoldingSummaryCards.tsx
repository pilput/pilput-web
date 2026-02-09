import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, TrendingUp } from "lucide-react";
import type { Holding } from "@/types/holding";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface HoldingSummaryCardsProps {
  holdings: Holding[];
  isLoading: boolean;
  hideValues?: boolean;
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
  isLoading,
  hideValues = false,
}: HoldingSummaryCardsProps) {
  const totalInvested = holdings.reduce(
    (sum, holding) => sum + parseFloat(holding.invested_amount),
    0
  );
  const totalCurrent = holdings.reduce(
    (sum, holding) => sum + parseFloat(holding.current_value),
    0
  );
  const hasGainAmounts = holdings.every(
    (h) => h.gain_amount != null && h.gain_amount !== ""
  );
  const totalRealized = hasGainAmounts
    ? holdings.reduce(
        (sum, holding) => sum + parseFloat(holding.gain_amount ?? "0"),
        0
      )
    : totalCurrent - totalInvested;
  const totalPercent =
    totalInvested > 0
      ? hasGainAmounts
        ? (totalRealized / totalInvested) * 100
        : ((totalCurrent - totalInvested) / totalInvested) * 100
      : 0;

  // Get the most common currency from holdings, default to IDR
  const mostCommonCurrency =
    holdings.length > 0
      ? holdings.reduce((acc, holding) => {
          acc[holding.currency] = (acc[holding.currency] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : {};
  const primaryCurrency =
    Object.keys(mostCommonCurrency).length > 0
      ? Object.entries(mostCommonCurrency).sort((a, b) => b[1] - a[1])[0][0]
      : "IDR";

  const maskValue = () => "••••••";

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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
    },
    {
      title: "Current Value",
      value: hideValues ? maskValue() : formatCurrency(totalCurrent, primaryCurrency),
      icon: DollarSign,
      valueColor: "text-foreground",
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
    },
  ];

  return (
    <motion.div
      className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4"
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
            <Card className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:hover:shadow-none dark:border-border transition-all duration-300 group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-5 pt-4 sm:pt-5 relative">
                <CardTitle className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate pr-1 text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="p-2 rounded-xl bg-muted transition-transform duration-300 group-hover:scale-105">
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconColor} shrink-0`} />
                </div>
              </CardHeader>

              <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 relative">
                <div
                  className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight wrap-break-word ${card.valueColor}`}
                >
                  {card.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
