"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { postsStore } from "@/stores/postsStorage";
import { getProfilePicture } from "@/utils/getImage";
import { useEffect, useState } from "react";
import Days from "dayjs";
import Link from "next/link";
import ActionComponent from "@/components/post/dashboard/action";

export default function Posts() {
  const limit = 10;
  const [Offset, setOffset] = useState(0);
  const poststore = postsStore();
  useEffect(() => {
    poststore.fetch(limit, Offset);
  }, [Offset]);

  const refetchPosts = () => {
    poststore.fetch(limit, Offset);
  }

  function prevPaginate() {
    setOffset((prev) => prev + limit);
  }

  return (
    <>
      <div className="px-5 bg-white shadow-md py-4 rounded-lg">
        <div className="text-xl font-semibold my-3">Posts</div>
        <div>
          <Link href={"/dashboard/posts/create"}>
            <Button variant="secondary" className="border">
              Add new post
            </Button>
          </Link>
        </div>
        <Table>
          <TableCaption>A list of your Posts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Title</TableHead>
              {/* <TableHead>Body</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poststore.posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  {poststore.posts.indexOf(post) + 1 + Offset}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Avatar>
                      <AvatarImage
                        src={getProfilePicture(post.creator?.image)}
                        width={5}
                        height={5}
                        alt="Avatar"
                      ></AvatarImage>
                      {post.creator?.email}
                      <AvatarFallback>
                        {post.creator?.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-semibold">
                      {post.creator?.first_name} {post.creator?.last_name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  <div className="max-w-96 overflow-auto">{post.title}</div>
                </TableCell>
                {/* <TableCell>
                  {post.body.replace(/<.*?>/g, "").length > 5
                    ? post.body.replace(/<.*?>/g, "").substring(0, 70) + "..."
                    : post.body.replace(/<.*?>/g, "")}
                </TableCell> */}

                <TableCell>
                  <div className="flex justify-center items-center">
                    {post.published ? (
                      <div className="text-green-500 border border-green-500 rounded-md px-2 py-1">
                        Published
                      </div>
                    ) : (
                      <div className="text-red-500 border border-red-500 rounded-md px-2 py-1">
                        Draft
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {Days(post.created_at).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>
                  <ActionComponent post={post} refetchPosts={refetchPosts} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                {poststore.posts.length + Offset} / {poststore.total}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="flex gap-2">
          <button
            disabled={Offset <= 0}
            onClick={() => setOffset((prev) => prev - limit)}
          >
            Previous
          </button>
          <button
            onClick={() => setOffset((prev) => prev + limit)}
            disabled={poststore.posts.length + Offset >= poststore.total}
          >
            Next
          </button>
        </div>
        {/* <Paginate
        key={"paginate"}
        prev={() => setOffset((prev) => prev - limit)}
        Offset={Offset}
        limit={limit}
        next={() => setOffset((prev) => prev + limit)}
        total={poststore.total}
        length={poststore.posts.length}
        currentPage={currentPage}
      /> */}
      </div>
    </>
  );
}
