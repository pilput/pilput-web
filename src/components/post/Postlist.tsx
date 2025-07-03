import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { format } from "date-fns";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Clock,
  Eye,
} from "lucide-react";

const Postlist = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  const tags = post.tags || []; // Use real tags from post data
  const readTime = Math.ceil(plaintext.length / 1000) || 1; // Estimate read time

  return (
    <article className="group relative bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        {/* Cover Image with Overlay */}
        {post.photo_url && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              src={getUrlImage(post.photo_url)}
              alt={post.title}
              width={800}
              height={450}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Floating Action Button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button className="p-2 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Author Info with Enhanced Design */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {post.creator?.image && (
                <Link href={`/${post.creator.username}`} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  <img
                    className="relative rounded-full object-cover h-10 w-10 ring-2 ring-white dark:ring-gray-700 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all duration-300"
                    src={getProfilePicture(post.creator?.image)}
                    width={40}
                    height={40}
                    loading="lazy"
                    alt={post.creator?.first_name}
                  />
                </Link>
              )}
              <div className="flex flex-col">
                <Link
                  href={`/${post.creator.username}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {post.creator?.first_name} {post.creator?.last_name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{format(post.created_at, "MMM d, yyyy")}</span>
                  <span>•</span>
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title with Enhanced Typography */}
          <Link
            href={`/${post.creator.username}/${post.slug}`}
            className="group/title"
          >
            <h2 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white group-hover/title:text-transparent group-hover/title:bg-gradient-to-r group-hover/title:from-blue-600 group-hover/title:to-purple-600 group-hover/title:bg-clip-text transition-all duration-300 mb-3 leading-tight line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {/* Content Preview */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
            {plaintext.slice(0, 120)}...
          </p>

          {/* Enhanced Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                #{tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Enhanced Engagement Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-all duration-300 group/heart hover:scale-110">
                <div className="relative">
                  <Heart className="w-5 h-5 group-hover/heart:fill-current" />
                  <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover/heart:opacity-20 group-hover/heart:animate-ping" />
                </div>
                <span className="text-sm font-medium">24</span>
              </button>

              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-all duration-300 group/comment hover:scale-110">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">5</span>
              </button>

              <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-all duration-300 group/view hover:scale-110">
                <Eye className="w-5 h-5" />
                <span className="text-sm font-medium">1.2k</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-300 hover:scale-110">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Postlist;
