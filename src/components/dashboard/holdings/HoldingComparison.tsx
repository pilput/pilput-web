"use client";

import { useEffect, useState } from "react";
import { axiosInstence3 } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import ComparisonSummaryCards from "./ComparisonSummaryCards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw, X, ArrowRight, CalendarDays } from "lucide-react";
import type { ComparisonSummary, CompareMonthsRequest } from "@/types/holding-comparison";

interface HoldingComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const months = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function HoldingComparison({ isOpen, onClose }: HoldingComparisonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ComparisonSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [fromMonth, setFromMonth] = useState((currentMonth === 1 ? 12 : (currentMonth - 1)).toString());
  const [fromYear, setFromYear] = useState((currentMonth === 1 ? (currentYear - 1) : currentYear).toString());
  const [toMonth, setToMonth] = useState(currentMonth.toString());
  const [toYear, setToYear] = useState(currentYear.toString());

  useEffect(() => {
    if (isOpen) {
      fetchComparison();
    }
  }, [isOpen]);

  async function fetchComparison() {
    setIsLoading(true);
    setError(null);

    try {
      const params: CompareMonthsRequest = {
        fromMonth: parseInt(fromMonth),
        fromYear: parseInt(fromYear),
        toMonth: parseInt(toMonth),
        toYear: parseInt(toYear),
      };

      const token = getToken();

      const response = await axiosInstence3.get<{ success: boolean; data: ComparisonSummary; message: string }>("/v1/holdings/compare", { 
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch comparison data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="space-y-6">
      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6 border-b bg-muted/5">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Performance Comparison
            </CardTitle>
            <CardDescription>
              Analyze your portfolio performance between two time periods.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="-mt-1">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 bg-muted/10 p-4 rounded-xl border border-muted/20">
            
            {/* From Group */}
            <div className="flex-1 w-full space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Base Period (From)</Label>
              <div className="flex gap-2">
                <Select value={fromMonth} onValueChange={setFromMonth}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={fromYear} onValueChange={setFromYear}>
                  <SelectTrigger className="w-[100px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center pt-6 lg:pt-4">
              <div className="bg-primary/10 p-2 rounded-full">
                 <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </div>

            {/* To Group */}
            <div className="flex-1 w-full space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comparison Period (To)</Label>
               <div className="flex gap-2">
                <Select value={toMonth} onValueChange={setToMonth}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={toYear} onValueChange={setToYear}>
                  <SelectTrigger className="w-[100px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action */}
            <div className="w-full lg:w-auto pt-6 lg:pt-4">
              <Button onClick={fetchComparison} disabled={isLoading} className="w-full lg:w-auto min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Compare
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-md text-sm text-center">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && !data && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          <p className="text-muted-foreground animate-pulse">Gathering financial data...</p>
        </div>
      )}

      {!isLoading && data && data.summary && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <ComparisonSummaryCards data={data} />
        </div>
      )}
    </div>
  );
}