"use client";

import Link from "next/link";
import Image from "next/image";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Eye, MessageCircle, Sparkles } from "lucide-react";
import BookmarkButton from "@/components/post/BookmarkButton";
import LikeButton from "@/components/post/LikeButton";
import { motion } from "framer-motion";
import {
  getPostBookmarkCount,
  getPostLikesCount,
  type Post,
} from "@/types/post";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeaturedPostCardProps {
  post: Post;
}

const FeaturedPostCard = ({ post }: FeaturedPostCardProps) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, "").trim();
  const tags = post.tags || [];

  return (
    <motion.article
      className="group relative glass-card border-glow-hover rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-350 bg-card/40 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex flex-col lg:flex-row min-h-[320px]">
        {/* Cover Image */}
        {post.photo_url && (
          <div className="relative w-full lg:w-[48%] aspect-[16/10] lg:aspect-auto min-h-[200px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-border/40">
            <Image
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              src={getUrlImage(post.photo_url)}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              <span className="bg-primary text-primary-foreground text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3 h-3 fill-current" />
                Featured Story
              </span>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Author Info */}
            <div className="flex items-center gap-2.5">
              <Link href={`/${post.user?.username || "anonymous"}`}>
                <Avatar className="h-8 w-8 border border-primary/20 shadow-xs hover:scale-105 transition-transform">
                  <AvatarImage
                    src={getProfilePicture(post.user?.image)}
                    alt={post.user?.first_name || post.user?.username || "Author"}
                  />
                  <AvatarFallback className="text-xs font-bold bg-primary/5 text-primary">
                    {post.user?.first_name?.[0] || post.user?.username?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/${post.user?.username || "anonymous"}`}
                  className="block font-bold text-xs hover:text-primary transition-colors leading-none mb-0.5"
                >
                  {post.user ? `${post.user.first_name || ""} ${post.user.last_name || ""}`.trim() || post.user.username : "Anonymous"}
                </Link>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3 opacity-70" />
                  <span>{format(post.created_at, "MMMM d, yyyy")}</span>
                </div>
              </div>
            </div>

            {/* Title & Excerpt */}
            <div className="space-y-2">
              <Link href={`/${post.user?.username || "anonymous"}/${post.slug}`}>
                <h2 className="font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-tight leading-snug text-foreground group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h2>
              </Link>
              <p className="text-xs sm:text-sm text-muted-foreground/95 leading-relaxed line-clamp-3">
                {plaintext.slice(0, 180)}{plaintext.length > 180 ? "..." : ""}
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${encodeURIComponent(tag.name)}`}
                    className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-primary bg-primary/5 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
                {tags.length > 3 && (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 cursor-help underline decoration-dotted decoration-muted-foreground/50 underline-offset-2">
                          +{tags.length - 3} more
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-left">
                        <p className="mb-1 font-medium text-background text-[11px]">
                          Tags not shown in preview
                        </p>
                        <ul className="space-y-0.5 font-normal text-[10px]">
                          {tags.slice(3).map((tag) => (
                            <li key={tag.id}>#{tag.name}</li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>

          {/* Engagement Section */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <div className="flex items-center gap-1 sm:gap-2">
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
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                aria-label={`${post.comments_count || 0} comments`}
              >
                <MessageCircle className="h-4 w-4 shrink-0 stroke-[1.75]" />
                <span className="tabular-nums text-[13px]">
                  {post.comments_count || 0}
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
              <Eye className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span>{post.view_count?.toLocaleString() || 0} views</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedPostCard;
