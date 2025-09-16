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
} from "lucide-react";
import type { Post } from "@/types/post";

const Postlist = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  const tags = post.tags || []; // Use real tags from post data
  const readTime = Math.ceil(plaintext.length / 1000) || 1; // Estimate read time

  return (
    <article className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Cover Image */}
      {post.photo_url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
            src={getUrlImage(post.photo_url)}
            alt={post.title}
            width={800}
            height={450}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      )}

      <div className="p-5">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          {post.creator?.image && (
            <Link href={`/${post.creator.username}`} className="shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <img
                  className="relative rounded-full object-cover h-9 w-9 ring-2 ring-white dark:ring-gray-800 transition-all duration-300"
                  src={getProfilePicture(post.creator?.image)}
                  width={36}
                  height={36}
                  loading="lazy"
                  alt={post.creator?.first_name}
                />
              </div>
            </Link>
          )}
          <div className="min-w-0">
            <Link
              href={`/${post.creator.username}`}
              className="block font-medium text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {post.creator?.first_name} {post.creator?.last_name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <time dateTime={post.created_at} className="whitespace-nowrap">
                {format(post.created_at, "MMM d, yyyy")}
              </time>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Title & Content */}
        <div className="space-y-2.5">
          <Link
            href={`/${post.creator.username}/${post.slug}`}
            className="block"
          >
            <h2 className="font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h2>
          </Link>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
            {plaintext.slice(0, 120)}...
          </p>
        </div>

        {/* Tags & Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-2.5 py-1 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="px-2 py-1 text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Heart className="w-4 h-4" />
              {(post.likes_count ?? 0) > 0 && (
                <span className="text-xs font-medium">{post.likes_count}</span>
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
              <Eye className="w-4 h-4" />
              {(post.view_count ?? 0) > 0 && (
                <span className="text-xs font-medium">{post.view_count}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Postlist;
