"use client";

import { useState, useEffect } from "react";
import HoldingComparison from "@/components/dashboard/holdings/HoldingComparison";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/holdings">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <div>
                <CardTitle className="text-xl sm:text-2xl">
                  Monthly Performance
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Compare your portfolio performance month over month.
                </CardDescription>
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
        </CardHeader>
        <CardContent>
          <HoldingComparison
            isOpen={true}
            targetMonth={parseInt(activeMonth)}
            targetYear={parseInt(activeYear)}
            hideValues={hideValues}
          />
        </CardContent>
      </Card>
    </div>
  );
}
