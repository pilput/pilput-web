import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, TrendingUp, PiggyBank, Scale } from "lucide-react";
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
  const totalRealized = totalCurrent - totalInvested;
  const totalPercent =
    totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;

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
          <Card key={i} className="animate-pulse border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <div className="h-3 sm:h-4 w-16 sm:w-24 bg-muted rounded" />
              <div className="h-3 sm:h-4 w-3 sm:w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="h-6 sm:h-8 w-20 sm:w-32 bg-muted rounded mb-1" />
              <div className="h-2 sm:h-3 w-12 sm:w-16 bg-muted rounded" />
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
      color: "blue",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
      borderColor: "border-blue-100 dark:border-blue-900/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Current Value",
      value: hideValues ? maskValue() : formatCurrency(totalCurrent, primaryCurrency),
      icon: DollarSign,
      color: "purple",
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50/50 dark:bg-purple-950/20",
      borderColor: "border-purple-100 dark:border-purple-900/30",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Profit / Loss",
      value: hideValues
        ? maskValue()
        : `${totalRealized > 0 ? "+" : ""}${formatCurrency(Math.abs(totalRealized), primaryCurrency)}`,
      icon: totalRealized >= 0 ? ArrowUpRight : ArrowDownRight,
      color: totalRealized >= 0 ? "emerald" : "rose",
      textColor: totalRealized >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
      bgColor: totalRealized >= 0 ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-rose-50/50 dark:bg-rose-950/20",
      borderColor: totalRealized >= 0 ? "border-emerald-100 dark:border-emerald-900/30" : "border-rose-100 dark:border-rose-900/30",
      iconBg: totalRealized >= 0 ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-rose-100 dark:bg-rose-900/30",
    },
    {
      title: "Return Rate",
      value: hideValues ? maskValue() : `${totalPercent > 0 ? "+" : ""}${totalPercent.toFixed(2)}%`,
      icon: TrendingUp,
      color: totalPercent >= 0 ? "emerald" : "rose",
      textColor: totalPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
      bgColor: totalPercent >= 0 ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-rose-50/50 dark:bg-rose-950/20",
      borderColor: totalPercent >= 0 ? "border-emerald-100 dark:border-emerald-900/30" : "border-rose-100 dark:border-rose-900/30",
      iconBg: totalPercent >= 0 ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-rose-100 dark:bg-rose-900/30",
    },
  ];

  return (
    <motion.div
      className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div key={card.title} variants={cardVariants}>
            <Card
              className={`relative overflow-hidden border ${card.borderColor} ${card.bgColor} shadow-sm hover:shadow-md transition-all duration-300 group h-full`}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${card.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6 relative">
                <CardTitle
                  className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate pr-1 ${card.textColor}`}
                >
                  {card.title}
                </CardTitle>
                <div className={`p-1.5 rounded-lg ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${card.textColor} shrink-0`} />
                </div>
              </CardHeader>

              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 relative">
                <div
                  className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight break-words ${
                    hideValues ? "" : card.textColor
                  }`}
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
