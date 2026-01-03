import { motion } from "framer-motion";
import { TrendingUp, Clock, Eye, Heart, User, Sparkles } from "lucide-react";
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
      <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {Array(layout === "grid" ? 3 : 5).fill(0).map((_, i) => (
          <div key={i} className={`animate-pulse bg-card border border-border/40 rounded-xl overflow-hidden ${layout === "sidebar" ? "flex gap-3 p-3" : "h-[320px]"}`}>
            {layout === "sidebar" ? (
              <>
                <div className="w-10 h-10 bg-muted rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col">
                <div className="w-full h-48 bg-muted" />
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="w-24 h-3 bg-muted rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-muted rounded w-full" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl border border-dashed border-border/60 bg-muted/5">
        <TrendingUp className="w-8 h-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No trending stories yet</p>
      </div>
    );
  }

  return (
    <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
      {posts.filter(Boolean).map((post, index) => {
        const plaintext = post.body?.replace(/(<([^>]+)>)/gi, "").trim() || "";
        const readTime = Math.ceil(plaintext.length / 800) || 1;
        const creator = post.creator;
        const creatorUsername = creator?.username || "anonymous";
        const creatorName = creator ? `${creator.first_name} ${creator.last_name}`.trim() : creatorUsername;

        if (layout === "grid") {
          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-card hover:bg-card/80 border border-border hover:border-primary/20 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <Link href={`/${creatorUsername}/${post.slug}`} className="block h-full flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden">
                   <Image
                    src={getUrlImage(post.photo_url)}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                     <span className="bg-background/90 backdrop-blur text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/50 shadow-sm flex items-center gap-1">
                       <Sparkles className="w-3 h-3 text-primary" />
                       Trending
                     </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border">
                        {creator?.image ? (
                          <Image
                            src={getProfilePicture(creator.image)}
                            alt={creatorName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3 h-3 text-primary" />
                          </div>
                        )}
                     </div>
                     <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                       {creatorName}
                     </span>
                  </div>

                  <h3 className="font-bold text-lg leading-tight mb-auto group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.view_count?.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {readTime} min
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-primary/80">
                       <Heart className="w-3.5 h-3.5" />
                       {post.likes_count || 0}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        }

        // Sidebar Layout - "Mini Card" style
        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/${creatorUsername}/${post.slug}`}
              className="group flex gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              {/* Author Avatar */}
              <div className="shrink-0">
                 <div className="w-10 h-10 rounded-full overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
                    {creator?.image ? (
                        <Image
                          src={getProfilePicture(creator.image)}
                          alt={creatorName}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                           <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                 </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {readTime}m
                  </span>
                  <span className="w-0.5 h-0.5 bg-muted-foreground/50 rounded-full" />
                  <span className="flex items-center gap-0.5">
                     <Eye className="w-3 h-3" />
                     {post.view_count?.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TrendingPosts;
