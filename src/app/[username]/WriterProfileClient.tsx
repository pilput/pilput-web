"use client";

import { Card, CardContent } from "@/components/ui/card";
import PostsUser from "@/components/writer/posts";

interface WriterProfileClientProps {
  username: string;
}

export default function WriterProfileClient({
  username,
}: WriterProfileClientProps) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardContent className="p-0">
        <div className="border-b border-border/50 bg-muted/20 px-5 py-4 sm:px-8 sm:py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Writing
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Posts from @{username}
          </h2>
        </div>
        <div className="px-4 py-6 sm:px-8 sm:py-8">
          <PostsUser username={username} showHeading={false} />
        </div>
      </CardContent>
    </Card>
  );
}
