import WordLimit from "../word/WordLimit";
import Link from "next/link";
import { Eye, Heart, MessageCircle, Calendar } from "lucide-react";
import type { Post } from "@/types/post";

const PostItemr = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  const formattedDate = new Date(post.created_at).toLocaleDateString();

  return (
    <article className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-5">
        {/* Title & Content */}
        <div className="space-y-3">
          <Link
            href={`/${post.creator.username}/${post.slug}`}
            className="block"
          >
            <h3 className="font-bold text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
            <WordLimit text={plaintext} limit={20} />
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            <time dateTime={post.created_at}>
              {formattedDate}
            </time>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Eye className="mr-1 h-3.5 w-3.5" />
                <span>{post.view_count}</span>
              </div>
              <div className="flex items-center">
                <Heart className="mr-1 h-3.5 w-3.5" />
                <span>{post.likes_count || 0}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="mr-1 h-3.5 w-3.5" />
                <span>{post.comments_count || 0}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {post.creator.username}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostItemr;
