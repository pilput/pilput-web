"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { getToken } from "@/utils/Auth";
import { bookmarkStore } from "@/stores/bookmarkStore";

export default function ReadingListCard() {
  const loadBookmarks = bookmarkStore((s) => s.loadBookmarks);
  const count = bookmarkStore((s) => s.bookmarks?.length ?? 0);
  const loaded = bookmarkStore((s) => s.loaded);

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    void loadBookmarks().catch(() => {});
  }, [loadBookmarks]);

  const showCount = getToken() && loaded && count > 0;

  return (
    <div className="mt-4">
      <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-muted-foreground" />
            Reading list
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Save articles for later and open them anytime from your list.
          </p>
          {showCount ? (
            <p className="text-sm font-medium text-foreground mb-4">
              {count} saved {count === 1 ? "post" : "posts"}
            </p>
          ) : null}
          <Link
            href={
              getToken()
                ? "/bookmarks"
                : `/login?redirect=${encodeURIComponent("/bookmarks")}`
            }
            className="block w-full text-center px-4 py-2 rounded-lg border border-primary/60 bg-primary text-primary-foreground hover:shadow-md transition-colors text-sm font-medium"
          >
            {getToken() ? "Open reading list" : "Sign in to save posts"}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
