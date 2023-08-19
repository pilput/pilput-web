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
      <div className="mx-auto p-3 max-w-2xl min-h-screen">
        <div className="border-b-2">
          <h2 className="text-2xl max-w-2xl mx-auto my-7 font-bold">
            {post.title}
          </h2>
        </div>
        <div className="my-10 mx-auto flex justify-center ">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.body }}
          ></div>
        </div>
        <Comment post_id={post.id} />
      </div>
    </>
  );
};

export default page;
