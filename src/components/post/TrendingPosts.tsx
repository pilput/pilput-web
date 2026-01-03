import { motion } from "framer-motion";
import { TrendingUp, Clock, Eye, Heart, ArrowUp, Flame } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import type { Post } from "@/types/post";

interface TrendingPostsProps {
  posts: Post[];
  isLoading?: boolean;
  layout?: "sidebar" | "grid";
}

const TrendingPosts = ({ posts, isLoading, layout = "sidebar" }: TrendingPostsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-2">
              <div className="w-5 h-5 bg-muted rounded flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 bg-muted rounded w-4/5" />
                <div className="h-1.5 bg-muted rounded w-2/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No trending posts available
      </p>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Flame className="w-3.5 h-3.5 text-orange-500" />;
      case 1:
        return <Flame className="w-3.5 h-3.5 text-red-500" />;
      case 2:
        return <Flame className="w-3.5 h-3.5 text-yellow-500" />;
      default:
        return <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-2">
      {posts.filter(Boolean).map((post, index) => {
        const plaintext = post.body?.replace(/(<([^>]+)>)/gi, "").trim() || "";
        const readTime = Math.ceil(plaintext.length / 800) || 1;
        const creator = post.creator;
        const creatorUsername = creator?.username || "anonymous";
        const creatorName = creator ? `${creator.first_name || ""} ${creator.last_name || ""}`.trim() || "Anonymous" : "Anonymous";

        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group"
          >
            <Link
              href={`/${creatorUsername}/${post.slug}`}
              className="flex items-center gap-2 p-2 rounded-lg border border-border/20 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h4 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
                  {post.title}
                </h4>

                {/* Meta Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {readTime}m
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    {(post.view_count || 0).toLocaleString()}
                  </div>
                  {(post.likes_count ?? 0) > 0 && (
                    <div className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" />
                      {post.likes_count}
                    </div>
                  )}
                </div>
              </div>

              {/* Author Avatar */}
              {creator?.image && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full overflow-hidden ring-1 ring-border/30">
                  <Image
                    className="w-full h-full object-cover"
                    src={getProfilePicture(creator.image)}
                    alt={creator.first_name || "Author"}
                    width={20}
                    height={20}
                  />
                </div>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TrendingPosts;
