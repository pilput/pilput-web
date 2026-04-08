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
    const response = await apiClient.get(`/v1/posts/u/${username}/${postSlug}`);
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
      title: post.title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        url: `${baseUrl}${canonicalUrl}`,
        title: post.title,
        description,
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: [`${baseUrl}/${params.username}`],
        tags: post.tags?.map((tag) => tag.name) || [],
        images: [
          {
            url: image,
            alt: post.title,
            width: 1200,
            height: 630,
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
      name: `${post.user.first_name} ${post.user.last_name}`.trim() || post.user.username,
      url: `${baseUrl}/${post.user.username}`,
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
      { "@type": "ListItem", position: 2, name: post.user.username, item: `${baseUrl}/${post.user.username}` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

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
                      <AvatarFallback className="bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold">
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

                <PostDetailEngagementRow
                  postId={post.id}
                  initialLiked={post.is_liked_by_current_user ?? false}
                  initialCount={getPostLikesCount(post)}
                  createdAt={post.created_at}
                  viewCount={post.view_count}
                  initialBookmarkCount={getPostBookmarkCount(post)}
                />
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
