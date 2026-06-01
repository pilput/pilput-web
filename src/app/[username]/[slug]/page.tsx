import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { apiClient } from "@/utils/fetch";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUrlImage, getProfilePicture } from "@/utils/getImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPostBookmarkCount, getPostLikesCount, type Post } from "@/types/post";
import ViewRecorder from "@/components/post/RecordView";
import PostContent from "@/components/post/PostContent";
import { PostDetailEngagementRow } from "@/components/post/PostDetailEngagementRow";
import styles from "@/components/post/post-content.module.scss";
import { Config } from "@/utils/getConfig";
import { Calendar, Clock } from "lucide-react";

interface SuccessResponse {
  data: Post;
  message: string;
  success: boolean;
}

const getPostSummary = (html: string, maxLength = 160): string => {
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength - 1)}...` : plain;
};

const getReadingTime = (html: string): number => {
  const words = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getPost = async (username: string, postSlug: string): Promise<Post> => {
  try {
    const response = await apiClient.get(`/api/posts/u/${username}/${postSlug}`);
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
  const baseUrl = Config.mainbaseurl;

  try {
    const post = await getPost(params.username, params.slug);
    const description = getPostSummary(post.body || "");
    const image = post.photo_url ? getUrlImage(post.photo_url) : `${baseUrl}/pilput.png`;
    const canonicalUrl = `/${params.username}/${params.slug}`;

    return {
      title: post.title || "Untitled",
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        url: `${baseUrl}${canonicalUrl}`,
        title: post.title || "Untitled",
        description,
        publishedTime: post.created_at || undefined,
        modifiedTime: post.updated_at || post.created_at || undefined,
        authors: [`${baseUrl}/${params.username}`],
        tags: post.tags?.map((tag) => tag.name) || [],
        images: [
          {
            url: image,
            alt: post.title || "Cover",
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title || "Untitled",
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

  const baseUrl = Config.mainbaseurl;
  const postUrl = `${baseUrl}/${params.username}/${params.slug}`;
  const imageUrl = post.photo_url ? getUrlImage(post.photo_url) : `${baseUrl}/pilput.png`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: imageUrl,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      "@type": "Person",
      name: post.user?.username || "Anonymous",
      url: post.user?.username ? `${baseUrl}/${post.user.username}` : baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "pilput",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/pilput.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    ...(post.tags?.length && {
      keywords: post.tags.map((t) => t.name).join(", "),
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "pilput", item: baseUrl },
      { "@type": "ListItem", position: 2, name: post.user?.username || "Anonymous", item: post.user?.username ? `${baseUrl}/${post.user.username}` : baseUrl },
      { "@type": "ListItem", position: 3, name: post.title || "Untitled", item: postUrl },
    ],
  };

  const readingTime = getReadingTime(post.body || "");
  const authorName = post.user?.username || "Anonymous";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ViewRecorder postId={post.id} />
      <Navigation />

      <div className={styles.postViewWrapper}>
        <div className={styles.postViewContainer}>
          <article>
            {/* Header */}
            <header className={styles.postHeader}>
              {/* Breadcrumb */}
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                {post.user?.username && (
                  <>
                    <Link href={`/${post.user.username}`} className={styles.breadcrumbLink}>
                      @{post.user.username}
                    </Link>
                    <span className={styles.breadcrumbSep} aria-hidden>/</span>
                  </>
                )}
                <span className={styles.breadcrumbCurrent}>{post.title || "Untitled"}</span>
              </nav>

              <h1>{post.title || "Untitled"}</h1>

              {/* Reading time + date strip */}
              <div className={styles.postDateStrip}>
                <span className={styles.postDateItem}>
                  <Calendar className="w-3.5 h-3.5" aria-hidden />
                  {post.created_at ? formatDate(post.created_at) : "Draft"}
                </span>
                <span className={styles.postDateDot} aria-hidden>·</span>
                <span className={styles.postDateItem}>
                  <Clock className="w-3.5 h-3.5" aria-hidden />
                  {readingTime} min read
                </span>
              </div>

              {/* Author and engagement row */}
              <div className={styles.postMeta}>
                {post.user ? (
                  <Link href={`/${post.user.username}`} className={styles.authorSection}>
                    <Avatar className="w-11 h-11 ring-2 ring-border shrink-0">
                      <AvatarImage
                        src={getProfilePicture(post.user.image || "")}
                        alt={`@${post.user.username}`}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
                        {post.user.username ? post.user.username[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorName}>{authorName}</span>
                      <span className={styles.authorUsername}>@{post.user.username}</span>
                    </div>
                  </Link>
                ) : (
                  <div className={styles.authorSection}>
                    <Avatar className="w-11 h-11 ring-2 ring-border shrink-0">
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorName}>Anonymous</span>
                      <span className={styles.authorUsername}>@anonymous</span>
                    </div>
                  </div>
                )}

                <PostDetailEngagementRow
                  postId={post.id}
                  initialLiked={post.is_liked_by_current_user ?? false}
                  initialCount={getPostLikesCount(post)}
                  createdAt={post.created_at || ""}
                  viewCount={post.view_count}
                  initialBookmarkCount={getPostBookmarkCount(post)}
                />
              </div>
            </header>

            {/* Featured Image — standard post image inside the column */}
            {post.photo_url && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-border shadow-xs">
                <Image
                  src={getUrlImage(post.photo_url)}
                  alt={post.title || "Cover"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <PostContent html={post.body || ""} className={styles.postContent} />

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className={styles.tagsSection}>
                <p className={styles.tagsSectionLabel}>Tagged in</p>
                <div className={styles.tagsList}>
                  {post.tags.map((tag) => (
                    <Link
                      href={`/tags/${encodeURIComponent(tag.name)}`}
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
          <section id="comments" className={styles.commentsSection}>
            <div className={styles.commentsSectionHeader}>
              <h2>Comments</h2>
              {post.comments_count != null && post.comments_count > 0 && (
                <span className={styles.commentsCount}>{post.comments_count}</span>
              )}
            </div>
            <Comment postId={post.id} />
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
