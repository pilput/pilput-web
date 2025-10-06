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
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, "").trim();
  const tags = post.tags || [];
  const readTime = Math.ceil(plaintext.length / 800) || 1; // Better estimate

  return (
    <article className="group relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
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

      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/${post.creator.username}`} className="shrink-0">
            {post.creator?.image && (
              <img
                className="rounded-full object-cover w-8 h-8"
                src={getProfilePicture(post.creator?.image)}
                width={32}
                height={32}
                loading="lazy"
                alt={post.creator?.first_name}
              />
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/${post.creator.username}`}
              className="block font-medium text-sm text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {post.creator?.first_name} {post.creator?.last_name}
            </Link>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {format(post.created_at, "MMM d, yyyy")} · {readTime} min read
            </div>
          </div>
        </div>

        {/* Title & Content */}
        <div className="space-y-3 mb-4">
          <Link
            href={`/${post.creator.username}/${post.slug}`}
            className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          >
            <h2 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white leading-tight line-clamp-3">
              {post.title}
            </h2>
          </Link>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
            {plaintext.slice(0, 150)}{plaintext.length > 150 ? '...' : ''}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.name}`}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Engagement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors text-sm">
              <Heart className="w-4 h-4" />
              {(post.likes_count ?? 0) > 0 && post.likes_count}
            </button>
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Eye className="w-4 h-4" />
            {(post.view_count ?? 0) > 0 && post.view_count}
          </div>
        </div>
      </div>
    </article>
  );
};

export default Postlist;
