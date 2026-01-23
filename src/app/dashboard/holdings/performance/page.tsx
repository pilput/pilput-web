"use client";

import { useState, useEffect } from "react";
import HoldingComparison from "@/components/dashboard/holdings/HoldingComparison";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function PerformancePage() {
  const [activeMonth] = useState((new Date().getMonth() + 1).toString());
  const [activeYear] = useState(new Date().getFullYear().toString());
  const [hideValues, setHideValues] = useState(() => {
    // Load preference from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hideHoldingValues");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("hideHoldingValues", hideValues.toString());
    }
  }, [hideValues]);

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/dashboard/holdings">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Monthly Performance
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Compare your portfolio performance month over month.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setHideValues(!hideValues)}
          title={hideValues ? "Show values" : "Hide values"}
          className="shrink-0 self-start sm:self-center"
          aria-label={hideValues ? "Show values" : "Hide values"}
        >
          {hideValues ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </Button>
      </div>

      <HoldingComparison
        isOpen={true}
        targetMonth={parseInt(activeMonth)}
        targetYear={parseInt(activeYear)}
        hideValues={hideValues}
      />
    </div>
  );
}
