import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignInPrompt() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-16 text-center">
      <div className="relative p-8 w-full border border-border/70 bg-card/90 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Bookmark className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Your Reading List</h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Keep track of articles, thoughts, and stories you want to read later. Sign in to save posts to your private library.
          </p>
          <div className="pt-2">
            <Button asChild className="w-full sm:w-auto px-8 py-5 font-semibold cursor-pointer">
              <Link href={`/login?redirect=${encodeURIComponent("/bookmarks")}`}>
                Sign in to Pilput
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
