import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosInstence } from "@/utils/fetch";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getToken } from "@/utils/Auth";

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

const recordView = async (postId: string, token?: string) => {
  try {
    await axiosInstence.post(`/v1/posts/${postId}/view`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    // Silently fail view recording to avoid disrupting user experience
    console.error("Failed to record view:", error);
  }
};

export default async function Page(props: {
  params: Promise<{ slug: string; username: string }>;
}) {
  const params = await props.params;
  const post = await getPost(params.username, params.slug);

  // Check if user is authenticated before recording view
  const hasToken = await getToken();

  if (hasToken) {
    await recordView(post.id, hasToken);
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-8 md:p-12">
              <div className="">
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 bg-gray-800 dark:bg-gray-600 rounded-full text-white text-sm font-medium">
                    Article
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
                  style={{ fontFamily: "inherit" }}
                >
                  {post.title}
                </h1>

                {/* Author Card */}
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <a
                    href={`/${post.creator.username}`}
                    className="flex-shrink-0"
                  >
                    <Avatar className="w-14 h-14 ring-2 ring-gray-200 dark:ring-gray-600">
                      <AvatarImage
                        src={getProfilePicture(post.creator.image)}
                        alt={`@${post.creator.username}`}
                      />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-medium text-lg">
                        {post.creator.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </a>
                  <div className="flex-1">
                    <div className="text-gray-900 dark:text-white font-semibold text-lg mb-1">
                      <a
                        href={`/${post.creator.username}`}
                        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        {post.creator.first_name} {post.creator.last_name}
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.view_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />5 min read
                      </span>
                    </div>
                  </div>
                  <button className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.photo_url && (
              <div className="relative -mt-8 mx-8 mb-8">
                <div className="relative overflow-hidden rounded-2xl shadow-sm">
                  <Image
                    className="w-full h-64 md:h-80 object-cover"
                    priority={true}
                    src={getUrlImage(post.photo_url)}
                    alt={post.title}
                    width={800}
                    height={400}
                  />
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="px-8 md:px-12 pb-8">
              <div
                className="prose prose-slate max-w-none focus:outline-none
                         prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold
                         prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-2
                         prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6
                         prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                         prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                         prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-em:italic
                        prose-code:px-1 prose-code:py-0.5 
                         prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-green-500
                         prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300
                         prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
                         prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                         prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                         prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                         prose-li:mb-1 prose-li:text-gray-700 dark:prose-li:text-gray-300"
                style={{ fontFamily: "inherit" }}
              >
                <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
              </div>
            </div>

            {/* Tags Section */}
            {post.tags != null && post.tags.length > 0 && (
              <div className="px-8 md:px-12 pb-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Topics
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Author Bio Section */}
            <div className="mx-8 md:mx-12 mb-8 bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
              <div className="flex gap-6">
                <a href={`/${post.creator.username}`} className="flex-shrink-0">
                  <Avatar className="w-20 h-20 ring-4 ring-white dark:ring-gray-600 shadow-sm">
                    <AvatarImage
                      src={getProfilePicture(post.creator.image)}
                      alt={`@${post.creator.username}`}
                    />
                    <AvatarFallback className="bg-gray-600 dark:bg-gray-500 text-white font-bold text-xl">
                      {post.creator.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </a>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {post.creator.first_name} {post.creator.last_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Writer, developer, and creator sharing insights about
                    technology and life. Passionate about building meaningful
                    digital experiences.
                  </p>
                  <a
                    href={`/${post.creator.username}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
                  >
                    Follow @{post.creator.username}
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="bg-gray-50 dark:bg-gray-800 mx-4 mt-4">
            <Comment postId={post.id} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
