import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosIntence } from "@/utils/fetch";
import Image from "next/image";
import { notFound } from "next/navigation"; // Added import statement
import { getUrlImage } from "@/utils/getImage";

const getPost = async (postSlug: string): Promise<Post> => {
  try {
    const { data } = await axiosIntence(`/api/v2/posts/${postSlug}`);
    return data;
  } catch {
    throw notFound();
  }
};

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return (
    <>
      <Navigation />
      <div className="mx-auto p-3 min-h-screen max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        {post.photo_url && (
          <Image
            className="mx-auto h-auto w-auto"
            priority={false}
            src={getUrlImage(post.photo_url)}
            alt={post.title}
            width={300}
            height={200}
          />
        )}

        <div className="border-b-2">
          <div className="text-xl md:text-3xl lg:text-5xl text-gray-950 mx-auto my-7 font-bold">
            {post.title}
          </div>
        </div>
        <div className="mb-10 mt-4 md:my-10 mx-auto flex justify-center prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: post.body }}
          ></div>
        </div>
        <Comment postId={post.id} />
      </div>
      <Footer />
    </>
  );
}
