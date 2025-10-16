"use client";
import { Button } from "@/components/ui/button";
import { updatePostStore } from "@/stores/updatePostStore";
import { getToken } from "@/utils/Auth";
import { axiosInstence, axiosInstence2 } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { convertToSlug } from "@/utils/slug";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MyEditor from "@/components/post/Editor";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { useParams } from "next/navigation";

export default function PostEdit() {
  const [errortitle, seterrortitle] = useState("");
  const [errorimage, seterrorimage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const { id } = useParams();
  const {
    postId,
    post,
    updateTitle,
    updateBody,
    updatePhotoUrl,
    updateSlug,
    updatePostId,
  } = updatePostStore();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstence2.get(`/v1/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postData = response.data;
        updateTitle(postData.title);
        updateBody(postData.body);
        updatePhotoUrl(postData.photo_url);
        updateSlug(postData.slug);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
        setLoading(false);
      }
    };
    if (id) {
      updatePostId(id.toString());
      fetchPost();
    }
  }, [id, token]);

  const update = (data: string) => {
    updateBody(data);
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosInstence.post(
          "/api/v1/posts/image",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const photoUrl = response.data.photo_url;
        updatePhotoUrl(photoUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  async function updateHandler() {
    const toastid = toast.loading("Updating...");
    try {
      await axiosInstence2.patch(`/v1/posts/${postId}`, post, {
        headers: { Authorization: `Bearer ${token}` },
      });
      seterrortitle("");
      toast.success("Post updated successfully", { id: toastid });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        console.error("Axios error:", axiosError.message);
        if (axiosError.response) {
          // Handle errors if needed
        } else {
          console.error("Other error:", error);
        }

        if (axiosError.response?.status === 422) {
          toast.error("Validation error", { id: toastid });
        } else {
          toast.error("Error updating post", { id: toastid });
        }
      }
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto py-6 px-4">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={updateHandler} className="min-w-[100px]">
            Update
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="space-y-6 pt-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Title
            </Label>
            <input
              id="title"
              onChange={(e) => {
                updateTitle(e.target.value);
                updateSlug(convertToSlug(e.target.value));
              }}
              className="w-full text-xl py-3 font-medium text-foreground bg-transparent border-b border-border focus:border-primary focus:outline-none transition-colors"
              value={post.title}
              placeholder="Enter your post title..."
            />
            {errortitle && (
              <p className="text-sm text-red-500 mt-1">{errortitle}</p>
            )}
          </div>

          {/* Featured Image Upload */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Featured Image</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="w-full max-w-xs"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={uploadPhoto}
                accept="image/*"
              />
            </div>
            {errorimage && (
              <p className="text-sm text-red-500 mt-1">{errorimage}</p>
            )}
            {post.photo_url && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={getUrlImage(post.photo_url)}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Content</Label>
            <div className="min-h-[400px] border rounded-lg">
              <MyEditor content={post.body} onchange={update} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
