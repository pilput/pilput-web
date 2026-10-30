"use client";

import Link from "next/link";
import Image from "next/image";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageCircle } from "lucide-react";
import BookmarkButton from "@/components/post/BookmarkButton";
import PostCoverFallback from "@/components/post/PostCoverFallback";
import LikeButton from "@/components/post/LikeButton";
import { motion, useReducedMotion } from "framer-motion";
import {
  getPostBookmarkCount,
  getPostLikesCount,
  type Post,
} from "@/types/post";

interface PostGridCardProps {
  post: Post;
}

const PostGridCard = ({ post }: PostGridCardProps) => {
  const plaintext = (post.body || "").replace(/(<([^>]+)>)/gi, "").trim();
  const tags = post.tags || [];
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="group flex flex-col h-full relative cursor-pointer bg-card border border-border/60 border-glow-hover rounded-2xl overflow-hidden transition-[transform,border-color] duration-200 motion-safe:hover:-translate-y-1 has-[.card-link:focus-visible]:ring-2 has-[.card-link:focus-visible]:ring-ring has-[.card-link:focus-visible]:ring-offset-2 has-[.card-link:focus-visible]:ring-offset-background"
      initial={reduceMotion ? false : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover Image */}
      {post.photo_url ? (
        <div className="relative overflow-hidden aspect-[16/10] border-b border-border/40 w-full shrink-0">
          <Image
            className="object-cover motion-safe:group-hover:scale-[1.03] transition-transform duration-300"
            src={getUrlImage(post.photo_url)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <PostCoverFallback post={post} className="aspect-[16/10] border-b border-border/40 shrink-0" />
      )}

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3.5">
          {/* Author Info */}
          <div className="flex items-center gap-2.5">
            <Link
              href={`/${post.user?.username || "anonymous"}`}
              className="relative z-10 rounded-full"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Avatar className="h-8 w-8 border border-primary/10">
                <AvatarImage
                  src={getProfilePicture(post.user?.image || "")}
                  alt={post.user?.username || "Author"}
                />
                <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
                  {post.user?.username?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="min-w-0 leading-none">
              <Link
                href={`/${post.user?.username || "anonymous"}`}
                className="relative z-10 block font-bold text-sm hover:text-primary transition-colors duration-200 mb-0.5 truncate"
              >
                {post.user?.username || "Anonymous"}
              </Link>
              <span className="text-xs text-muted-foreground">
                {post.created_at ? format(new Date(post.created_at), "MMM d, yyyy") : "Draft"}
              </span>
            </div>
          </div>

          {/* Title & Excerpt */}
          <div className="space-y-2">
            <Link href={`/${post.user?.username || "anonymous"}/${post.slug || ""}`} className="block card-link outline-none after:absolute after:inset-0 after:z-0 after:content-['']">
              <h3 className="font-bold text-base md:text-lg leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {post.title || "Untitled"}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {plaintext.slice(0, 110)}{plaintext.length > 110 ? "..." : ""}
            </p>
          </div>
        </div>

        {/* Tags and Engagement */}
        <div className="space-y-3 pt-2">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-primary bg-primary/5 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors duration-200"
                >
                  #{tag.name}
                </Link>
              ))}
              {tags.length > 2 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{tags.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Engagement Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
            <div className="relative z-10 flex items-center gap-1 sm:gap-1.5">
              <LikeButton
                postId={post.id}
                initialLiked={post.is_liked_by_current_user ?? false}
                initialCount={getPostLikesCount(post)}
                variant="compact"
              />
              <BookmarkButton
                postId={post.id}
                initialCount={getPostBookmarkCount(post)}
                showCount
                variant="compact"
              />
              <Link
                href={`/${post.user?.username || "anonymous"}/${post.slug}#comments`}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                aria-label={`${post.comments_count || 0} comments`}
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0 stroke-[1.75]" aria-hidden="true" />
                <span className="tabular-nums text-xs">
                  {post.comments_count || 0}
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
              <Eye className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
              <span>{post.view_count?.toLocaleString() || 0}<span className="sr-only"> views</span></span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostGridCard;
