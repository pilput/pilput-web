import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosIntence } from "@/utils/fetch";
import { storagebaseurl } from "@/utils/getCofig";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getpost(slug: string) {
  try {
    const res = await axiosIntence("/api/v2/posts/" + slug);
    return res.data;
  } catch (error) {
    throw notFound();
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getpost(params.slug);
  return (
    <>
      <Navigation />
      <div className="mx-auto p-3 min-h-screen prose prose-sm sm:prose lg:prose-lg">
        {post.photo_url && (
          <Image
            className="mx-auto h-auto w-auto"
            priority={false}
            src={storagebaseurl+"/"+post.photo_url}
            alt={post.photo_url}
            width={300}
            height={200}
          />
        )}

        <div className="border-b-2">
          <div className="text-5xl text-gray-950 mx-auto my-7 font-bold">
            {post.title}
          </div>
        </div>
        <div className="my-10 mx-auto flex justify-center ">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: post.body }}
          ></div>
        </div>
        <Comment post_id={post.id} />
      </div>
      <Footer />
    </>
  );
}
