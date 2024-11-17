import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosInstence2 } from "@/utils/fetch";
import Image from "next/image";
import { notFound } from "next/navigation"; // Added import statement
import { getUrlImage } from "@/utils/getImage";
import Link from "next/link";

const getPost = async (postSlug: string): Promise<Post> => {
  try {
    const { data } = await axiosInstence2(`/posts/slug/${postSlug}`);
    return data;
  } catch {
    throw notFound();
  }
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPost(params.slug);

  return (
    <>
      <Navigation />
      <div className="mx-auto p-3 pt-6 min-h-screen max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <div className="flex gap-2 items-center">
          <Link href={`/${post.creator.username}`}>
            <img
              className="w-14 h-14 rounded-full object-cover hover:ring-2 ring-blue-500"
              src={getUrlImage(post.creator.image)}
              alt={post.creator.image}
              width={60}
              height={60}
            />
          </Link>
          <div>
            <div>
              <Link
                href={`/${post.creator.username}`}
                className="text-gray-700 font-medium hover:font-semibold dark:text-gray-300"
              >
                {post.creator.first_name} {post.creator.last_name}
              </Link>
            </div>
            <a
              href={`/${post.creator.username}`}
              className="text-blue-600 font-semibold hover:underline"
            >
              @{post.creator.username}
            </a>
          </div>
        </div>

        <div className="border-b-2 mb-8">
          <div className="text-xl md:text-3xl lg:text-5xl text-gray-950 mx-auto my-6 font-bold dark:text-gray-300">
            {post.title}
          </div>
        </div>
        <div>
          {post.photo_url && (
            <Image
              className="mx-auto h-72 object-cover w-full"
              priority={false}
              src={getUrlImage(post.photo_url)}
              alt={post.title}
              width={400}
              height={400}
            />
          )}
        </div>
        <div className="mb-10 mt-4 md:my-10 mx-auto flex justify-center prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: post.body }}
          ></div>
        </div>
        {post.tags != null && (
          <div className="flex gap-2 flex-wrap mb-6">
            {post.tags.map((tag) => (
              <div
                key={tag.id}
                className="py-2 px-4 rounded-2xl bg-slate-200"
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
        <div></div>
        <Comment postId={post.id} />
      </div>
      <Footer />
    </>
  );
}
