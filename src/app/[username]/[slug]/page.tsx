import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosInstence } from "@/utils/fetch";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUrlImage, getProfilePicture } from "@/utils/getImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatDistanceToNow } from "date-fns";
import ViewRecorder from "@/components/post/ViewRecorder";
import type { Post } from "@/types/post";

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
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
                {post.title}
              </h1>

              <div className="flex items-center gap-4">
                <a href={`/${post.creator.username}`} className="flex-shrink-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={getProfilePicture(post.creator.image)}
                      alt={`@${post.creator.username}`}
                    />
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {post.creator.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </a>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                  <a href={`/${post.creator.username}`} className="hover:text-gray-900 dark:hover:text-white font-medium">
                    {post.creator.first_name} {post.creator.last_name}
                  </a>
                  <span>•</span>
                  <span>{post.view_count} views</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.photo_url && (
              <div className="mb-12">
                <Image
                  className="w-full h-64 object-cover rounded-lg"
                  priority={true}
                  src={getUrlImage(post.photo_url)}
                  alt={post.title}
                  width={800}
                  height={400}
                />
              </div>
            )}

            {/* Article Meta Info */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="mb-2">
                  <span className="font-medium">Published:</span> {new Date(post.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Author:</span> 
                  <a href={`/${post.creator.username}`} className="ml-1 hover:text-blue-600 dark:hover:text-blue-400">
                    {post.creator.first_name} {post.creator.last_name}
                  </a>
                </div>
                <div>
                  <span className="font-medium">Reading time:</span> 5 minutes
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="mb-12">
              <div className="prose prose-lg max-w-none leading-relaxed
                           text-gray-900 dark:text-gray-100
                           prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-semibold
                           prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6
                           prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6
                           prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
                           prose-p:text-gray-900 dark:prose-p:text-gray-100 prose-p:mb-4 prose-p:leading-7
                           prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                           prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                           prose-em:text-gray-800 dark:prose-em:text-gray-200 prose-em:italic
                           prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                           prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-900 dark:prose-pre:text-gray-100
                           prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                           prose-ul:text-gray-900 dark:prose-ul:text-gray-100
                           prose-ol:text-gray-900 dark:prose-ol:text-gray-100
                           prose-li:text-gray-900 dark:prose-li:text-gray-100">
                <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
              </div>
            </div>

            {/* Tags Section */}
            {post.tags != null && post.tags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Topics
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* Comments Section */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Discussion
            </h2>
            <Comment postId={post.id} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
