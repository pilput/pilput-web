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
        <div className="max-w-4xl mx-auto px-6 py-8 lg:py-12">
          <article className="space-y-8">
            {/* Header */}
            <header className="space-y-6">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Author and Meta Information */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-y border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <a href={`/${post.creator.username}`} className="shrink-0">
                    <Avatar className="w-12 h-12 ring-2 ring-gray-100 dark:ring-gray-800">
                      <AvatarImage
                        src={getProfilePicture(post.creator.image)}
                        alt={`@${post.creator.username}`}
                      />
                      <AvatarFallback className="bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold">
                        {post.creator.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </a>
                  <div>
                    <a
                      href={`/${post.creator.username}`}
                      className="block font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {post.creator.first_name} {post.creator.last_name}
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{post.creator.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="hover:text-gray-900 dark:hover:text-white transition-colors">
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {new Date(post.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <span className="text-gray-300 dark:text-gray-600">•</span>

                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.view_count} views
                  </span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.photo_url && (
              <div className="rounded-xl overflow-hidden shadow-lg">
                <Image
                  className="w-full h-auto object-cover"
                  priority={true}
                  src={getUrlImage(post.photo_url)}
                  alt={post.title}
                  width={800}
                  height={400}
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none prose-gray dark:prose-invert
                           prose-headings:scroll-mt-24 prose-headings:font-bold
                           prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-800 prose-h1:pb-2
                           prose-h2:text-2xl prose-h2:text-gray-900 dark:prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6
                           prose-h3:text-xl prose-h3:text-gray-800 dark:prose-h3:text-gray-200 prose-h3:mt-10 prose-h3:mb-4
                           prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                           prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                           prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                           prose-code:text-sm prose-code:text-green-700 dark:prose-code:text-green-400 prose-code:px-2.5 prose-code:py-1 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                           prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:overflow-x-auto
                           prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:italic
                           prose-ul:space-y-2 prose-ol:space-y-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                           prose-img:rounded-lg prose-img:shadow-md"
            >
              <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
            </div>

            {/* Tags Section */}
            {post.tags != null && post.tags.length > 0 && (
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <a
                      href={`/tags/${tag.name}`}
                      key={tag.id}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-gray-500 dark:text-gray-400 mr-1">
                        #
                      </span>
                      {tag.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Comments Section */}
          <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Comments
              </h2>
              <Comment postId={post.id} />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
