import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosInstance } from "@/utils/fetch";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
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
import PostContent from "@/components/post/PostContent";
import styles from "@/components/post/post-content.module.scss";

interface SuccessResponse {
  data: Post;
  message: string;
  success: boolean;
}

const getPostSummary = (html: string, maxLength = 160): string => {
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength - 1)}...` : plain;
};

const getPost = async (username: string, postSlug: string): Promise<Post> => {
  try {
    const response = await axiosInstance.get(`/v1/posts/u/${username}/${postSlug}`);
    const result = response.data as SuccessResponse;
    return result.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("POST_NOT_FOUND");
  }
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string; username: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  try {
    const post = await getPost(params.username, params.slug);
    const description = getPostSummary(post.body || "");
    const image = post.photo_url ? getUrlImage(post.photo_url) : "/pilput.png";
    const canonicalUrl = `/${params.username}/${params.slug}`;

    return {
      title: post.title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        url: canonicalUrl,
        title: post.title,
        description,
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: [`/${params.username}`],
        tags: post.tags?.map((tag) => tag.name) || [],
        images: [
          {
            url: image,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function Page(props: {
  params: Promise<{ slug: string; username: string }>;
}) {
  const params = await props.params;
  let post: Post;
  try {
    post = await getPost(params.username, params.slug);
  } catch {
    throw notFound();
  }

  return (
    <>
      <ViewRecorder postId={post.id} />
      <Navigation />
      <div className={styles.postViewWrapper}>
        <div className={styles.postViewContainer}>
          <article>
            {/* Header */}
            <header className={styles.postHeader}>
              <h1>{post.title}</h1>

              {/* Author and Meta Information */}
              <div className={styles.postMeta}>
                <div className={styles.authorSection}>
                  <Link href={`/${post.user.username}`} className="shrink-0">
                    <Avatar className="w-12 h-12 ring-2 ring-gray-100 dark:ring-gray-800">
                      <AvatarImage
                        src={getProfilePicture(post.user.image)}
                        alt={`@${post.user.username}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold">
                        {post.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className={styles.authorInfo}>
                    <Link
                      href={`/${post.user.username}`}
                      className={styles.authorName}
                    >
                      {post.user.first_name} {post.user.last_name}
                    </Link>
                    <span className={styles.authorUsername}>
                      @{post.user.username}
                    </span>
                  </div>
                </div>

                <div className={styles.metaInfo}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="hover:text-foreground transition-colors cursor-default">
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

                  <span className={styles.separator}>•</span>

                  <span className={styles.viewCount}>
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
              <div className={styles.featuredImage}>
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

            {/* Article Content - Using shared SCSS styles */}
            <PostContent html={post.body} className={styles.postContent} />

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className={styles.tagsSection}>
                <h3>Tags</h3>
                <div className={styles.tagsList}>
                  {post.tags.map((tag) => (
                    <Link
                      href={`/tags/${tag.name}`}
                      key={tag.id}
                      className={styles.tagLink}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Comments Section */}
          <section className={styles.commentsSection}>
            <h2>Comments</h2>
            <Comment postId={post.id} />
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
