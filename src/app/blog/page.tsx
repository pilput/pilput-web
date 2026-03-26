import Navigation from "@/components/header/Navbar";
import BlogContent from "@/components/blog/BlogContent";
import {
  fetchInitialPosts,
  fetchTrendingTags,
  postsPerPage,
} from "@/lib/blog-feed-data";

export const revalidate = 30;

export default async function BlogPage() {
  const [{ posts, total }, trendingTags] = await Promise.all([
    fetchInitialPosts(),
    fetchTrendingTags(),
  ]);

  return (
    <>
      <Navigation />
      <BlogContent
        initialPosts={posts}
        initialTotal={total}
        postsPerPage={postsPerPage}
        trendingTags={trendingTags}
      />
    </>
  );
}
