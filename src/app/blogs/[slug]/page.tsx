import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosIntence } from "@/utils/fetch";
import { notFound } from "next/navigation";
import React from "react";

async function getpost(slug: string) {
  try {
    const res = await axiosIntence("/api/v2/posts/" + slug);
    return res.data;
  } catch (error) {
    throw notFound();
  }
}

const page = async ({ params }: { params: { slug: string } }) => {
  const post = await getpost(params.slug);
  return (
    <>
      <Navigation />
      <div className="mx-auto p-3 min-h-screen prose prose-sm sm:prose lg:prose-lg xl:prose-2xl">
        <div className="border-b-2">
          <div className="text-5xl text-gray-950 mx-auto my-7 font-bold">
            {post.title}
          </div>
        </div>
        <div className="my-10 mx-auto flex justify-center ">
          <div
            dangerouslySetInnerHTML={{ __html: post.body }}
          ></div>
        </div>
        <Comment post_id={post.id} />
      </div>
    </>
  );
};

export default page;
