import type { Post } from "@/types/post";

// Gradient presets for posts without a cover image, picked deterministically per post.
const FALLBACK_COVERS = [
  "from-emerald-500/25 via-teal-400/10 to-sky-500/20",
  "from-sky-500/25 via-indigo-400/10 to-violet-500/20",
  "from-amber-400/25 via-orange-400/10 to-rose-500/20",
  "from-violet-500/25 via-fuchsia-400/10 to-pink-500/20",
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
      className={`relative overflow-hidden w-full bg-gradient-to-br ${pickFallbackCover(post.id || post.title || "")} ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px] text-foreground/20" />
      <span className="absolute -bottom-6 right-4 select-none text-[9rem] font-black leading-none text-foreground/10 transition-transform duration-500 group-hover:scale-[1.05]">
        {(post.title || "U").trim().charAt(0).toUpperCase()}
      </span>
      {firstTag && (
        <span className="absolute left-5 top-5 rounded-full bg-background/70 px-3 py-1 text-[11px] font-bold tracking-wide text-foreground/80 backdrop-blur">
          #{firstTag.name}
        </span>
      )}
    </div>
  );
};

export default PostCoverFallback;
