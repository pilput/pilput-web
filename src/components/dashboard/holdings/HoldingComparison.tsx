"use client";

import { useEffect, useState, useCallback } from "react";
import { axiosInstance3 } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import ComparisonSummaryCards from "./ComparisonSummaryCards";
import ComparisonChart from "./ComparisonChart";
import ComparisonTables from "./ComparisonTables"; // New import
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, AlertCircle } from "lucide-react";
import type {
  ComparisonSummary,
  CompareMonthsRequest,
} from "@/types/holding-comparison";

interface HoldingComparisonProps {
  isOpen: boolean;
  targetMonth: number;
  targetYear: number;
  hideValues?: boolean;
}

export default function HoldingComparison({
  isOpen,
  targetMonth,
  targetYear,
  hideValues = false,
}: HoldingComparisonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ComparisonSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    if (!isOpen) return;

    setIsLoading(true);
    setError(null);

    try {
      // Calculate previous month
      let fromMonth = targetMonth - 1;
      let fromYear = targetYear;

      if (fromMonth === 0) {
        fromMonth = 12;
        fromYear = targetYear - 1;
      }

      const params: CompareMonthsRequest = {
        fromMonth,
        fromYear,
        toMonth: targetMonth,
        toYear: targetYear,
      };

      const token = getToken();

      const response = await axiosInstance3.get<{
        success: boolean;
        data: ComparisonSummary;
        message: string;
      }>("/v1/holdings/compare", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch progress data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, targetMonth, targetYear]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  if (!isOpen) return null;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-wrap items-center gap-2 px-1">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
        <h2 className="text-base sm:text-lg font-semibold tracking-tight">
          Monthly Performance
        </h2>
        <span className="text-xs sm:text-sm text-muted-foreground">
          (vs. previous month)
        </span>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-muted/5 animate-pulse border-dashed">
              <div className="h-24 sm:h-32" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800">
          <CardContent className="flex items-center justify-center py-4 sm:py-6 gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm px-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="break-words">{error}</span>
          </CardContent>
        </Card>
      ) : data && data.summary ? (
        <>
          <ComparisonSummaryCards data={data} hideValues={hideValues} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6"> {/* Added margin top */}
            <div className="lg:col-span-2">
              <ComparisonTables data={data} hideValues={hideValues} />
            </div>
            <div className="lg:col-span-1">
              <ComparisonChart data={data} hideValues={hideValues} />
            </div>
          </div>
        </>
      ) : (
        <Card className="border-dashed bg-muted/5">
          <CardContent className="flex items-center justify-center py-8 sm:py-10 text-muted-foreground text-xs sm:text-sm px-4">
            No comparison data available for this period.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
