"use client";
import { Button } from "@/components/ui/button";
import { postsStore } from "@/stores/createPostStore";
import { getToken } from "@/utils/Auth";
import { axiosIntence, axiosIntence2 } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { convertToSlug } from "@/utils/slug";
import { useCurrentEditor } from "@tiptap/react";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import MyEditor from "@/components/post/Editor";

export default function PostCreate() {
  const { editor } = useCurrentEditor();
  const [errortitle, seterrortitle] = useState("");
  const [errorimage, seterrorimage] = useState("");
  const token = getToken();
  const { post, updatetitle, updatebody, updatePhoto_url, updateSlug } =
    postsStore();

  const update = (data: string) => {
    updatebody(data);
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        // Adjust the URL for your file upload endpoint
        const response = await axiosIntence.post(
          "/api/v2/posts/image",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Assuming your server responds with the uploaded file URL
        const photoUrl = response.data.photo_url;

        // Update the post's photo URL
        // You might need to modify your store method based on your implementation
        // For example, if you have an updatePhoto method, use it accordingly
        updatePhoto_url(photoUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  async function pulishHandler() {
    const toastid = toast.loading("Loading...");
    try {
      await axiosIntence2.post("/posts", post, {
        headers: { Authorization: `Bearer ${token}` },
      });
      seterrortitle("");
      toast.success("success", { id: toastid });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        console.error("Axios error:", axiosError.message);
        if (axiosError.response) {
          // seterrortitle(
          //   (axiosError.response.data as ErrorCreatePost)?.error?.title || ""
          // );
          // seterrorimage(
          //   (axiosError.response.data as ErrorCreatePost)?.error?.photo_url || ""
          // );
          // console.log(errortitle);
        } else {
          console.error("Other error:", error);
        }

        if (axiosError.response?.status === 422) {
          toast.error("Validation error", { id: toastid });
        } else {
          toast.error("error", { id: toastid });
        }
      }
    }
  }
  return (
    <div>
      <div className="">
        <div className="mb-5 mx-auto max-w-3xl text-end">
          <Button onClick={pulishHandler}>Publish</Button>
        </div>
        <div className="max-w-3xl mx-auto bg-white px-5 py-5">
          <div className="w-full">
            <input type="file" onChange={uploadPhoto} />
            <div className="text-red-400">{errorimage}</div>
          </div>

          <div className="flex justify-center">
            <img
              src={getUrlImage(post.photo_url)}
              alt=""
              className="max-h-96"
            />
          </div>
          <div className="my-7 w-full">
            <input
              onChange={(e) => {
                updatetitle(e.target.value);
                updateSlug(convertToSlug(e.target.value));
              }}
              className="w-full text-2xl py-3 font-bold text-black bg-transparent border-none focus:outline-none"
              value={post.title}
              placeholder="Input title..."
            />
            <div className="text-red-400">{errortitle}</div>
          </div>
          <div className="mt-5 w-full">
            <MyEditor content={post.body} onchange={update} />
          </div>
        </div>
      </div>
    </div>
  );
}
