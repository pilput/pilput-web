"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePostStore } from "@/stores/updatePostStore";
import { getToken } from "@/utils/Auth";
import { axiosInstance } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { convertToSlug } from "@/utils/slug";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import MyEditor from "@/components/post/Editor";
import {
  ImagePlus,
  X,
  FileText,
  Link as LinkIcon,
  Hash,
  Save,
  ArrowLeft,
  Eye,
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";
import styles from "@/components/post/post-editor.module.scss";

const MAX_TITLE_LENGTH = 150;
const MAX_SLUG_LENGTH = 200;

export default function PostEdit() {
  const params = useParams();
  const id = params?.id as string;
  const [errorTitle, setErrorTitle] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = getToken();

  const {
    post,
    loading,
    isUpdating,
    updateTitle,
    updateBody,
    updatePhotoUrl,
    updateSlug,
    updatePostId,
    fetchPostById,
    updatePost,
  } = updatePostStore();

  useEffect(() => {
    if (id) {
      updatePostId(id.toString());
      fetchPostById(id);
    }
  }, [id]);

  const update = (data: string) => {
    updateBody(data);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post(
        "/api/v1/posts/image",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const photoUrl = response.data.photo_url;
      updatePhotoUrl(photoUrl);
      setErrorImage("");
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorImage("Failed to upload image. Please try again.");
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleRemoveImage = () => {
    updatePhotoUrl("");
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTagInput("");
    }
  };

  async function updateHandler() {
    if (!post.title.trim()) {
      setErrorTitle("Title is required");
      toast.error("Title is required");
      return;
    }

    if (!post.body.trim() || post.body === "<p></p>") {
      toast.error("Content is required");
      return;
    }

    const toastId = toast.loading("Updating post...");
    const success = await updatePost();

    if (success) {
      setErrorTitle("");
      setErrorImage("");
      toast.success("Post updated successfully!", { id: toastId });
    } else {
      toast.error("Failed to update post. Please try again.", { id: toastId });
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-100">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading post...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Post</h1>
            <p className="text-sm text-muted-foreground">
              Make changes to your article
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" disabled className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={updateHandler}
            disabled={isUpdating}
            className="min-w-30 gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className={styles.postLayout}>
        {/* Main Content */}
        <div className={styles.postMain}>
          {/* Title */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className={styles.titleWrapper}>
                <input
                  id="title"
                  onChange={(e) => {
                    updateTitle(e.target.value);
                    updateSlug(convertToSlug(e.target.value));
                    setErrorTitle("");
                  }}
                  className={styles.titleInput}
                  value={post.title}
                  placeholder="Enter your post title..."
                  maxLength={MAX_TITLE_LENGTH}
                />
                <span
                  className={`${styles.titleCounter} ${
                    post.title.length > MAX_TITLE_LENGTH * 0.8 ? styles.warn : ""
                  }`}
                >
                  {post.title.length}/{MAX_TITLE_LENGTH}
                </span>
              </div>
              {errorTitle && (
                <p className="text-sm text-destructive mt-2">{errorTitle}</p>
              )}
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ImagePlus className="h-4 w-4" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              {post.photo_url ? (
                <div className={styles.imagePreviewWrapper}>
                  <img
                    src={getUrlImage(post.photo_url)}
                    alt="Featured"
                  />
                  <div className={styles.imageOverlay}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Change
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={`${styles.imageUploadZone} ${isDragging ? styles.dragging : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-10 w-10 uploadIcon" />
                  <span className={styles.uploadText}>
                    {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
                  </span>
                  <span className={styles.uploadSubtext}>
                    PNG, JPG, GIF up to 5MB
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              )}
              {errorImage && (
                <p className="text-sm text-destructive mt-2">{errorImage}</p>
              )}
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MyEditor
                content={post.body}
                onchange={update}
                placeholder="Start writing your amazing post..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className={styles.postSidebar}>
          {/* Slug */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                URL Slug
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.slugWrapper}>
                <span className={styles.slugPrefix}>/posts/</span>
                <input
                  value={post.slug}
                  onChange={(e) => updateSlug(e.target.value)}
                  className={styles.slugInput}
                  placeholder="your-post-title"
                  maxLength={MAX_SLUG_LENGTH}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This will be the URL of your post
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.tagsWrapper}>
                {post.tags?.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag.name}
                    <button type="button">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className={styles.tagInput}
                  placeholder="Add tag..."
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to add a tag
              </p>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Post Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium text-green-600">Published</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-sm text-muted-foreground">Visibility</span>
                <span className="text-sm font-medium">Public</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">Just now</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}