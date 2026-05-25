"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { OAuthCallback } from "@/components/auth/OAuthCallback";

export default function CallbackPage() {
  return (
    <ErrorBoundary>
      <main
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4"
        role="main"
      >
        {/* Background designs matching login/register pages */}
        <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-muted/70 to-transparent dark:from-muted/25" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 border-l border-border/60 bg-muted/25 lg:block" />

        <Suspense
          fallback={
            <Card className="relative z-10 w-full max-w-md border-border/70 bg-card/95 p-8 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20 glass-card">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </Card>
          }
        >
          <OAuthCallback />
        </Suspense>
      </main>
    </ErrorBoundary>
  );
}
