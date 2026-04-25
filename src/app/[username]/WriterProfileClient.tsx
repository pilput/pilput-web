"use client";

import PostsUser from "@/components/writer/posts";

interface WriterProfileClientProps {
  username: string;
  displayName: string;
}

export default function WriterProfileClient({
  username,
  displayName,
}: WriterProfileClientProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Writing
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Posts by {displayName}
          </h2>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          @{username}
        </p>
      </div>
      <PostsUser key={username} username={username} showHeading={false} />
    </section>
  );
}
