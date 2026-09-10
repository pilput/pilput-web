import { useMemo } from "react";
import { parseDecimal } from "@/types/holding";
import type { Holding, HoldingSummaryResponse } from "@/types/holding";

export function usePortfolioStatistics(
  holdings: Holding[],
  summary: HoldingSummaryResponse | null,
) {
  return useMemo(() => {
    if (!holdings || holdings.length === 0) return null;

    const totalInvested = summary
      ? parseDecimal(summary.totalInvested)
      : holdings.reduce((sum, h) => sum + parseDecimal(h.invested_amount), 0);
    const totalCurrent = summary
      ? parseDecimal(summary.totalCurrentValue)
      : holdings.reduce((sum, h) => sum + parseDecimal(h.current_value), 0);
    const totalReturn = summary
      ? parseDecimal(summary.totalProfitLoss)
      : (() => {
          const hasGainAmounts = holdings.every(
            (h) => h.gain_amount != null && h.gain_amount !== "",
          );
          return hasGainAmounts
            ? holdings.reduce((sum, h) => sum + parseDecimal(h.gain_amount), 0)
            : totalCurrent - totalInvested;
        })();
    const totalReturnPercent = summary
      ? parseDecimal(summary.totalProfitLossPercentage)
      : totalInvested > 0
        ? (totalReturn / totalInvested) * 100
        : 0;

    const currencyBreakdown = holdings.reduce((acc, h) => {
      const currency = h.currency || "Unknown";
      const invested = parseFloat(h.invested_amount);
      const current = parseFloat(h.current_value);
      const returnAmount =
        h.gain_amount != null && h.gain_amount !== ""
          ? parseFloat(h.gain_amount)
          : current - invested;
      if (!acc[currency])
        acc[currency] = { invested: 0, current: 0, returnAmount: 0, count: 0 };
      acc[currency].invested += invested;
      acc[currency].current += current;
      acc[currency].returnAmount += returnAmount;
      acc[currency].count += 1;
      return acc;
    }, {} as Record<string, { invested: number; current: number; returnAmount: number; count: number }>);

    const assetTypePerformance = holdings.reduce((acc, h) => {
      const typeName = h.holding_type?.name || "Unknown";
      const invested = parseFloat(h.invested_amount);
      const current = parseFloat(h.current_value);
      const returnAmount =
        h.gain_amount != null && h.gain_amount !== ""
          ? parseFloat(h.gain_amount)
          : current - invested;
      if (!acc[typeName])
        acc[typeName] = {
          invested: 0,
          current: 0,
          returnAmount: 0,
          count: 0,
          avgReturnPercent: 0,
        };
      acc[typeName].invested += invested;
      acc[typeName].current += current;
      acc[typeName].returnAmount += returnAmount;
      acc[typeName].count += 1;
      acc[typeName].avgReturnPercent =
        acc[typeName].invested > 0
          ? (acc[typeName].returnAmount / acc[typeName].invested) * 100
          : 0;
      return acc;
    }, {} as Record<string, { invested: number; current: number; returnAmount: number; count: number; avgReturnPercent: number }>);

    const holdingsWithReturn = holdings
      .map((h) => {
        const invested = parseFloat(h.invested_amount);
        const current = parseFloat(h.current_value);
        const returnAmount =
          h.gain_amount != null && h.gain_amount !== ""
            ? parseFloat(h.gain_amount)
            : current - invested;
        const returnPercent =
          h.gain_percent != null && h.gain_percent !== ""
            ? parseFloat(h.gain_percent)
            : invested > 0
              ? (returnAmount / invested) * 100
              : 0;
        return { ...h, returnAmount, returnPercent };
      })
      .sort((a, b) => b.returnPercent - a.returnPercent);

    const topPerformers = holdingsWithReturn.slice(0, 5);
    const worstPerformers = holdingsWithReturn.slice(-3).reverse();

    const platformStats = holdings.reduce((acc, h) => {
      const platform = h.platform || "Unknown";
      const current = parseFloat(h.current_value);
      if (!acc[platform]) acc[platform] = { value: 0, count: 0 };
      acc[platform].value += current;
      acc[platform].count += 1;
      return acc;
    }, {} as Record<string, { value: number; count: number }>);

    const topPlatform = Object.entries(platformStats).sort(
      (a, b) => b[1].value - a[1].value
    )[0];

    const assetTypeEntries = Object.entries(assetTypePerformance)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.avgReturnPercent - a.avgReturnPercent);

    const mostCommonCurrency =
      Object.keys(currencyBreakdown).length > 0
        ? Object.entries(currencyBreakdown).sort(
            (a, b) => b[1].count - a[1].count
          )[0][0]
        : "IDR";

    const platformDistribution = Object.entries(
      holdings.reduce((acc, h) => {
        const platform = h.platform || "Unknown";
        const value = parseFloat(h.current_value);
        if (!acc[platform]) acc[platform] = 0;
        acc[platform] += value;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([platform, value]) => ({
        platform,
        value,
        percent: totalCurrent > 0 ? (value / totalCurrent) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const assetTypeDistribution = Object.entries(
      holdings.reduce((acc, h) => {
        const typeName = h.holding_type?.name || "Unknown";
        const value = parseFloat(h.current_value);
        if (!acc[typeName]) acc[typeName] = 0;
        acc[typeName] += value;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([typeName, value]) => ({
        typeName,
        value,
        percent: totalCurrent > 0 ? (value / totalCurrent) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      totalInvested,
      totalCurrent,
      totalReturn,
      totalReturnPercent,
      currencyBreakdown,
      currencyCount: Object.keys(currencyBreakdown).length,
      assetTypePerformance,
      topPerformers,
      worstPerformers,
      topPlatform,
      bestAssetType: assetTypeEntries[0],
      worstAssetType: assetTypeEntries[assetTypeEntries.length - 1],
      primaryCurrency: mostCommonCurrency,
      totalAssets: summary?.holdingsCount ?? holdings.length,
      totalPlatforms: new Set(holdings.map((h) => h.platform)).size,
      totalAssetTypes: new Set(holdings.map((h) => h.holding_type?.name)).size,
      platformDistribution,
      assetTypeDistribution,
    };
  }, [holdings, summary]);
}

export type PortfolioStatistics = NonNullable<
  ReturnType<typeof usePortfolioStatistics>
>;
