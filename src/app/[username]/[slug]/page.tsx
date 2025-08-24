
import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosInstence } from "@/utils/fetch";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUrlImage, getProfilePicture } from "@/utils/getImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Post } from "@/types/post";
import ViewRecorder from "@/components/post/RecordView";

interface succesResponse {
  data: Post;
  message: string;
  success: boolean;
}

const getPost = async (username: string, postSlug: string): Promise<Post> => {
  try {
    const response = await axiosInstence(`/v1/posts/u/${username}/${postSlug}`);
    const result = response.data as succesResponse;
    return result.data;
  } catch (error) {
    throw notFound();
  }
};

export default async function Page(props: {
  params: Promise<{ slug: string; username: string }>;
}) {
  const params = await props.params;
  const post = await getPost(params.username, params.slug);

  return (
    <>
      <ViewRecorder postId={post.id} />
      <Navigation />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <article>
            {/* Header */}
            <header className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <a href={`/${post.creator.username}`} className="flex-shrink-0">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={getProfilePicture(post.creator.image)}
                        alt={`@${post.creator.username}`}
                      />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium">
                        {post.creator.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </a>
                  <a
                    href={`/${post.creator.username}`}
                    className="hover:text-gray-900 dark:hover:text-white font-medium"
                  >
                    {post.creator.first_name} {post.creator.last_name}
                  </a>
                </div>
                <span>•</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="hover:text-gray-900 dark:hover:text-white">
                        {formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>•</span>
                <span>{post.view_count} views</span>
                
              </div>
            </header>

            {/* Featured Image */}
            {post.photo_url && (
              <div className="mb-12">
                <Image
                  className="w-full h-auto object-cover rounded-lg"
                  priority={true}
                  src={getUrlImage(post.photo_url)}
                  alt={post.title}
                  width={800}
                  height={400}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none leading-relaxed
                           text-gray-800 dark:text-gray-200
                           prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-semibold
                           prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                           prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
                           prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-6
                           prose-p:text-base prose-p:mb-6 prose-p:leading-7
                           prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline
                           prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                           prose-em:text-gray-800 dark:prose-em:text-gray-200
                           prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:px-2 prose-code:py-1 prose-code:rounded
                           prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900 prose-pre:text-gray-100 dark:prose-pre:text-gray-200 prose-pre:p-4 prose-pre:rounded-lg
                           prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                           prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                           prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                           prose-li:mb-2">
              <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
            </div>

            {/* Tags Section */}
            {post.tags != null && post.tags.length > 0 && (
              <div className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <a
                      href={`/tags/${tag.name}`}
                      key={tag.id}
                      className="inline-block px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {tag.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Comments Section */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Comments
            </h2>
            <Comment postId={post.id} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
