"use client";

import Link from "next/link";
import Image from "next/image";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Eye, MessageCircle } from "lucide-react";
import BookmarkButton from "@/components/post/BookmarkButton";
import LikeButton from "@/components/post/LikeButton";
import { motion } from "framer-motion";
import {
  getPostBookmarkCount,
  getPostLikesCount,
  type Post,
} from "@/types/post";

interface PostGridCardProps {
  post: Post;
}

const PostGridCard = ({ post }: PostGridCardProps) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, "").trim();
  const tags = post.tags || [];

  return (
    <motion.article
      className="group flex flex-col h-full relative glass-card border-glow-hover rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-350 bg-card/30 backdrop-blur-sm"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* Cover Image */}
      {post.photo_url && (
        <div className="relative overflow-hidden aspect-[16/10] border-b border-border/40 w-full shrink-0">
          <Image
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            src={getUrlImage(post.photo_url)}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3.5">
          {/* Author Info */}
          <div className="flex items-center gap-2.5">
            <Link href={`/${post.user?.username || "anonymous"}`}>
              <Avatar className="h-7 w-7 border border-primary/10 shadow-xs hover:scale-105 transition-transform">
                <AvatarImage
                  src={getProfilePicture(post.user?.image)}
                  alt={post.user?.first_name || post.user?.username || "Author"}
                />
                <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
                  {post.user?.first_name?.[0] || post.user?.username?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="min-w-0 leading-none">
              <Link
                href={`/${post.user?.username || "anonymous"}`}
                className="block font-bold text-xs hover:text-primary transition-colors mb-0.5 truncate"
              >
                {post.user ? `${post.user.first_name || ""} ${post.user.last_name || ""}`.trim() || post.user.username : "Anonymous"}
              </Link>
              <span className="text-[10px] text-muted-foreground">
                {format(post.created_at, "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Title & Excerpt */}
          <div className="space-y-2">
            <Link href={`/${post.user?.username || "anonymous"}/${post.slug}`} className="block group/title">
              <h3 className="font-bold text-base md:text-lg leading-snug tracking-tight text-foreground group-hover/title:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground/90 leading-relaxed line-clamp-3">
              {plaintext.slice(0, 110)}{plaintext.length > 110 ? "..." : ""}
            </p>
          </div>
        </div>

        {/* Tags and Engagement */}
        <div className="space-y-3 pt-2">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold text-primary bg-primary/5 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
              {tags.length > 2 && (
                <span className="text-[10px] text-muted-foreground self-center">
                  +{tags.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Engagement Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 sm:gap-1.5">
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
                <MessageCircle className="h-3.5 w-3.5 shrink-0 stroke-[1.75]" />
                <span className="tabular-nums text-[11px]">
                  {post.comments_count || 0}
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-1 text-[11px] tabular-nums text-muted-foreground">
              <Eye className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span>{post.view_count?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostGridCard;
