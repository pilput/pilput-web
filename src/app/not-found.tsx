import Link from "next/link";
import { ArrowLeft, BookOpen, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-35 dark:opacity-20"
        aria-hidden
      >
        <div className="absolute -top-24 left-[12%] h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[8%] h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-px w-[120%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] bg-linear-to-r from-transparent via-border/80 to-transparent" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md border-primary/15 shadow-xl shadow-primary/5">
          <CardHeader className="items-center pb-2 text-center sm:px-8">
            <div className="flex animate-in fade-in-0 zoom-in-95 flex-col items-center gap-5 duration-500">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <FileQuestion
                  className="size-8"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
              <p className="bg-linear-to-br from-primary via-primary to-primary/65 bg-clip-text text-7xl font-bold tracking-tighter text-transparent sm:text-8xl">
                404
              </p>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Page not found
                </h1>
                <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  That link may be broken or the page was removed. Head home or
                  explore posts on the blog.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pb-2 sm:flex-row sm:justify-center sm:px-8">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/" className="gap-2">
                <ArrowLeft className="size-4" aria-hidden />
                Back to home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-primary/20 sm:w-auto"
            >
              <Link href="/blog" className="gap-2">
                <BookOpen className="size-4" aria-hidden />
                Browse blog
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t border-border/60 bg-muted/25 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Tip: check the URL for typos, or use the site navigation from the
              homepage.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
