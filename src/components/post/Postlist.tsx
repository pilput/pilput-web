import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { format } from "date-fns";
import {
  Heart,
  Bookmark,
  Clock,
  Eye,
  MessageCircle,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Post } from "@/types/post";

const Postlist = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, "").trim();
  const tags = post.tags || [];
  const readTime = Math.ceil(plaintext.length / 800) || 1;

  return (
    <motion.article 
      className="group relative bg-card border border-border/70 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
      whileHover={{ y: -2 }}
      layout
    >
      {/* Cover Image */}
      {post.photo_url && (
        <div className="relative overflow-hidden aspect-[16/9]">
          <Image
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            src={getUrlImage(post.photo_url)}
            alt={post.title}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Author Info */}
        <div className="flex items-center gap-3">
          <motion.div 
            className="shrink-0 relative"
            whileHover={{ scale: 1.05 }}
          >
            <Link href={`/${post.creator.username}`}>
              {post.creator?.image && (
                <Image
                  className="rounded-full object-cover border-2 border-border"
                  src={getProfilePicture(post.creator?.image)}
                  width={36}
                  height={36}
                  alt={post.creator?.first_name || "Author"}
                />
              )}
            </Link>
          </motion.div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/${post.creator.username}`}
              className="block font-semibold text-sm text-foreground hover:text-primary transition-colors"
            >
              {post.creator?.first_name} {post.creator?.last_name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {format(post.created_at, "MMM d, yyyy")}
              <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
              <span>{readTime} min read</span>
            </div>
          </div>
          <motion.button
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Bookmark className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Title & Content */}
        <div className="space-y-3">
          <Link
            href={`/${post.creator.username}/${post.slug}`}
            className="block group"
          >
            <motion.h2 
              className="font-bold text-xl md:text-2xl text-foreground leading-tight line-clamp-3 group-hover:text-primary transition-colors"
              whileHover={{ x: 2 }}
            >
              {post.title}
            </motion.h2>
          </Link>

          <p className="text-muted-foreground leading-relaxed line-clamp-3">
            {plaintext.slice(0, 150)}{plaintext.length > 150 ? '...' : ''}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  href={`/tags/${tag.name}`}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  #{tag.name}
                </Link>
              </motion.div>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Engagement */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-4">
            <motion.button 
              className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <Heart className="w-4 h-4" />
              {(post.likes_count ?? 0) > 0 && post.likes_count}
            </motion.button>
            <motion.button 
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <MessageCircle className="w-4 h-4" />
              {post.comments_count || 0}
            </motion.button>
            <motion.button 
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Eye className="w-4 h-4" />
            {(post.view_count ?? 0) > 0 && post.view_count}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default Postlist;
