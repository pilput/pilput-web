import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WordLimit from "@/components/word/WordLimit";
import Image from "next/image";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { format } from "date-fns";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";

const Postlist = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  const tags = ["#javascript", "#webdev", "#beginners", "#programming"]; // Mock tags
  
  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Cover Image */}
      {post.photo_url && (
        <div className="aspect-video w-full overflow-hidden">
          <Image
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            src={getUrlImage(post.photo_url)}
            alt={post.title}
            width={800}
            height={400}
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          {post.creator?.image && (
            <Link href={`/${post.creator.username}`}>
              <img
                className="rounded-full object-cover h-8 w-8 hover:ring-2 hover:ring-blue-500 transition-all duration-200"
                src={getProfilePicture(post.creator?.image)}
                width={32}
                height={32}
                loading="lazy"
                alt={post.creator?.first_name}
              />
            </Link>
          )}
          <div className="flex flex-col">
            <Link href={`/${post.creator.username}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors text-sm">
              {post.creator?.first_name} {post.creator?.last_name}
            </Link>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {format(post.created_at, "MMM d")}
            </div>
          </div>
        </div>

        {/* Title */}
        <Link href={`/${post.creator.username}/${post.slug}`} className="group">
          <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2 leading-tight">
            {post.title}
          </h2>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 4).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors group">
              <Heart className="w-5 h-5 group-hover:fill-current" />
              <span className="text-sm">24</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">5</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">2 min read</span>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Postlist;
