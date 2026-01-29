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
    <div className="container mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/holdings">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Monthly Performance
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Compare your portfolio performance month over month.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setHideValues(!hideValues)}
            title={hideValues ? "Show values" : "Hide values"}
            aria-label={hideValues ? "Show values" : "Hide values"}
          >
            {hideValues ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none dark:bg-muted/20 backdrop-blur-sm">
        <HoldingComparison
          isOpen={true}
          targetMonth={parseInt(activeMonth)}
          targetYear={parseInt(activeYear)}
          hideValues={hideValues}
        />
      </div>
    </div>
  );
}
