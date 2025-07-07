import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosInstence } from "@/utils/fetch";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUrlImage } from "@/utils/getImage";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock, Calendar, User, Tag } from "lucide-react";

const getPost = async (postSlug: string): Promise<Post> => {
  try {
    const { data } = await axiosInstence(`/v1/posts/slug/${postSlug}`);
    return data;
  } catch {
    throw notFound();
  }
};

const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = textContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getPost(params.slug);
  const readingTime = estimateReadingTime(post.body);
  
  return (
    <>
      <Navigation />
      <article className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-800">
        {/* Hero Section */}
        <div className="relative">
          {post.photo_url && (
            <div className="relative h-[60vh] w-full overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                priority={true}
                src={getUrlImage(post.photo_url)}
                alt={post.title}
                fill
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}
          
          {/* Article Header */}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`${post.photo_url ? '-mt-32 relative z-10' : 'pt-12'}`}>
              <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-zinc-700/50">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Blog
                  </Link>
                  <span>/</span>
                  <span className="text-gray-700 dark:text-gray-300">{post.title}</span>
                </nav>
                
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                  {post.title}
                </h1>
                
                {/* Author and Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Link href={`/${post.creator.username}`} className="group">
                      <img
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-zinc-700 group-hover:ring-blue-500 transition-all duration-300 shadow-lg"
                        src={getUrlImage(post.creator.image)}
                        alt={`${post.creator.first_name} ${post.creator.last_name}`}
                        width={64}
                        height={64}
                      />
                    </Link>
                    <div>
                      <Link
                        href={`/${post.creator.username}`}
                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.creator.first_name} {post.creator.last_name}
                      </Link>
                      <Link
                        href={`/${post.creator.username}`}
                        className="block text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        @{post.creator.username}
                      </Link>
                    </div>
                  </div>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{readingTime} min read</span>
                    </div>
                    {post.updated_at !== post.created_at && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Updated {formatDistanceToNow(new Date(post.updated_at))} ago</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="prose prose-lg sm:prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-900 dark:prose-pre:bg-zinc-800 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20">
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Comment postId={post.id} />
        </div>
      </article>
      <Footer />
    </>
  );
}
