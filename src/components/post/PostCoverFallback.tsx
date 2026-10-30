import type { Post } from "@/types/post";

// Flat, low-contrast surfaces for posts without a cover image, picked deterministically per post.
const FALLBACK_COVERS = [
  "bg-muted",
  "bg-primary/10",
  "bg-secondary",
  "bg-chart-4/15",
];

const pickFallbackCover = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return FALLBACK_COVERS[Math.abs(hash) % FALLBACK_COVERS.length];
};

/** Decorative cover shown in place of `photo_url` so image and text-only cards line up in a grid. */
const PostCoverFallback = ({
  post,
  className = "",
}: {
  post: Post;
  className?: string;
}) => {
  const firstTag = post.tags?.[0];

  return (
    <div
      className={`relative overflow-hidden w-full ${pickFallbackCover(post.id || post.title || "")} ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px] text-foreground/20" />
      <span className="absolute -bottom-6 right-4 select-none text-[9rem] font-black leading-none text-foreground/10 transition-transform duration-500 group-hover:scale-[1.05]">
        {(post.title || "U").trim().charAt(0).toUpperCase()}
      </span>
      {firstTag && (
        <span className="absolute left-5 top-5 rounded-full bg-background px-3 py-1 text-[11px] font-bold tracking-wide text-foreground/80">
          #{firstTag.name}
        </span>
      )}
    </div>
  );
};

export default PostCoverFallback;
