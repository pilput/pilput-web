"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePostStore } from "@/stores/updatePostStore";
import { getToken } from "@/utils/Auth";
import { apiClient } from "@/utils/fetch";
import { getUrlImage, getProfilePicture } from "@/utils/getImage";
import { convertToSlug } from "@/utils/slug";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MyEditor = dynamic(() => import("@/components/post/Editor"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-lg bg-muted flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <FileText className="h-8 w-8 text-muted-foreground/50" />
        <span className="text-sm text-muted-foreground">Loading editor...</span>
      </div>
    </div>
  ),
});

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
  Send,
  Calendar,
  Clock,
  Settings,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { authStore } from "@/stores/userStore";
import styles from "@/components/post/post-editor.module.scss";
import contentStyles from "@/components/post/post-content.module.scss";

const MAX_TITLE_LENGTH = 150;
const MAX_SLUG_LENGTH = 200;

export default function PostEdit() {
  const authData = authStore((state) => state.data);
  const username = authData.username;
  const params = useParams();
  const id = params?.id as string;
  const [errorTitle, setErrorTitle] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = getToken();
  const router = useRouter();

  const {
    post,
    loading,
    isUpdating,
    updateTitle,
    updateBody,
    updatePhotoUrl,
    updateSlug,
    addTag,
    removeTagAt,
    updatePostId,
    fetchPostById,
    updatePost,
  } = updatePostStore();

  useEffect(() => {
    if (id) {
      updatePostId(id.toString());
      fetchPostById(id);
    }
  }, [id, updatePostId, fetchPostById]);

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

      const response = await apiClient.post(
        "/api/posts/image",
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
  };

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
      const result = addTag(tagInput);
      if (result.ok) {
        setTagInput("");
      } else if (result.reason === "duplicate") {
        toast.error("Tag already added");
      } else if (result.reason === "limit") {
        toast.error("You can add up to 5 tags");
      }
    }
  };

  async function updateHandler(published: boolean) {
    if (!post.title.trim()) {
      setErrorTitle("Title is required");
      toast.error("Title is required");
      return;
    }

    if (!post.body.trim() || post.body === "<p></p>") {
      toast.error("Content is required");
      return;
    }

    const toastId = toast.loading(published ? "Publishing post..." : "Saving draft...");
    const success = await updatePost(published);

    if (success) {
      setErrorTitle("");
      setErrorImage("");
      toast.success(
        published ? "Post published successfully!" : "Draft saved successfully!",
        { id: toastId }
      );
      setTimeout(() => {
        router.push("/dashboard/posts");
      }, 1000);
    } else {
      toast.error(
        published
          ? "Failed to publish post. Please try again."
          : "Failed to save draft. Please try again.",
        { id: toastId }
      );
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-4 px-3 sm:py-6 sm:px-4 lg:px-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading post...</span>
          </div>
        </div>
      </div>
    );
  }

  const authorName = [authData.first_name, authData.last_name].filter(Boolean).join(" ") || authData.username;

  return (
    <div className="max-w-7xl mx-auto py-4 px-3 sm:py-6 sm:px-4 lg:px-6">
      {/* Sticky top action header */}
      <div className="sticky top-16 z-20 bg-background/85 backdrop-blur-md border-b border-border/40 py-3.5 px-4 mb-6 shadow-xs rounded-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground h-9 px-3 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-4 w-[1px] bg-border/60" />
            <span className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
              post.published 
                ? "bg-green-500/10 text-green-600 dark:text-green-500" 
                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
              {post.published ? "Published" : "Draft Mode"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateHandler(false)}
              disabled={isUpdating}
              className="gap-1.5 h-9"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Draft
            </Button>
            
            <Button
              size="sm"
              onClick={() => updateHandler(true)}
              disabled={isUpdating}
              className="gap-1.5 h-9"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </div>
      
      {/* Two-column layout grid */}
      <div className={styles.postLayout}>
        {/* Left Column: Main post canvas */}
        <div className={`${styles.postMain} max-w-[52rem] mx-auto w-full`}>
          <article className="w-full">
            {/* Header */}
            <header className={contentStyles.postHeader}>
              {/* Breadcrumb */}
              <nav className={contentStyles.breadcrumb} aria-label="Breadcrumb">
                <span className={contentStyles.breadcrumbLink}>
                  @{username}
                </span>
                <span className={contentStyles.breadcrumbSep} aria-hidden>/</span>
                <span className={contentStyles.breadcrumbCurrent}>
                  {post.title || "Untitled Post"}
                </span>
              </nav>

              {/* Title Input */}
              <textarea
                id="title"
                onChange={(e) => {
                  updateTitle(e.target.value);
                  updateSlug(convertToSlug(e.target.value));
                  setErrorTitle("");
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                ref={(el) => {
                  if (el) {
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
                className="w-full text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 text-foreground mb-4 leading-tight"
                value={post.title}
                placeholder="Enter your title..."
                maxLength={MAX_TITLE_LENGTH}
                rows={1}
              />

              {errorTitle && (
                <p className="text-sm text-destructive -mt-2 mb-4">{errorTitle}</p>
              )}

              {/* Date / Reading Strip */}
              <div className={contentStyles.postDateStrip}>
                <span className={contentStyles.postDateItem}>
                  <Calendar className="w-3.5 h-3.5" aria-hidden />
                  Today
                </span>
                <span className={contentStyles.postDateDot} aria-hidden>·</span>
                <span className={contentStyles.postDateItem}>
                  <Clock className="w-3.5 h-3.5" aria-hidden />
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>

              {/* Author Meta Row */}
              <div className={contentStyles.postMeta}>
                <div className={contentStyles.authorSection}>
                  <Avatar className="w-11 h-11 ring-2 ring-border shrink-0">
                    <AvatarImage
                      src={getProfilePicture(authData.image)}
                      alt={`@${username}`}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
                      {username ? username[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={contentStyles.authorInfo}>
                    <span className={contentStyles.authorName}>{authorName}</span>
                    <span className={contentStyles.authorUsername}>@{username}</span>
                  </div>
                </div>

                {/* Mock engagement statistics */}
                <div className="flex items-center gap-4 text-muted-foreground text-xs sm:text-sm select-none border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> 0 views</span>
                  <span className="flex items-center gap-1">👍 0 likes</span>
                  <span className="flex items-center gap-1">🔖 0 saves</span>
                </div>
              </div>
            </header>

            {/* Featured Image — aspect-video standard post image, not full-bleed banner */}
            {post.photo_url ? (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-xs mt-4 mb-6 group">
                <Image
                  src={getUrlImage(post.photo_url)}
                  alt="Post cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-white/95 text-black border-none shadow-md font-semibold h-9"
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Change Cover
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="shadow-md font-semibold h-9"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Cover
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-44 border-2 border-dashed border-border/80 hover:border-primary/50 bg-muted/30 hover:bg-primary/5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 mt-4 mb-6 group text-center px-4"
              >
                <ImagePlus className="h-8 w-8 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {isUploading ? "Uploading header..." : "Add a cover image"}
                </span>
                <span className="text-xs text-muted-foreground/70">
                  Drag and drop or click to upload (PNG, JPG up to 5MB)
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
              <p className="text-sm text-destructive mt-1 mb-4">{errorImage}</p>
            )}

            {/* Inline Editor */}
            <div className="mt-4">
              <MyEditor
                content={post.body}
                onchange={update}
                placeholder="Start writing your amazing post..."
                isInline={true}
              />
            </div>

            {/* Static Tags Preview */}
            {post.tags && post.tags.length > 0 && (
              <div className={contentStyles.tagsSection}>
                <p className={contentStyles.tagsSectionLabel}>Tagged in</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className={contentStyles.tagLink}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Right Column: Sidebar */}
        <div className={styles.postSidebar}>
          {/* URL Slug */}
          <Card className={styles.floatingWidget}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                URL Slug
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.slugWrapper}>
                <span className={styles.slugPrefix}>/{username}/</span>
                <input
                  value={post.slug}
                  onChange={(e) => updateSlug(e.target.value)}
                  className={styles.slugInput}
                  placeholder="your-post-title"
                  maxLength={MAX_SLUG_LENGTH}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This will be the URL permalink of your post.
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className={styles.floatingWidget}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.tagsWrapper}>
                {post.tags?.map((tag, index) => (
                  <span key={`${tag}-${index}`} className={styles.tag}>
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove tag ${tag}`}
                      onClick={() => removeTagAt(index)}
                    >
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
                Press Enter to add a tag (max 5)
              </p>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className={styles.floatingWidget}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Post Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-semibold ${post.published ? 'text-green-600' : 'text-yellow-600'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-2">
                <span className="text-muted-foreground text-xs">Visibility</span>
                <span className="font-semibold text-xs">Public</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-2">
                <span className="text-muted-foreground text-xs">Last Updated</span>
                <span className="font-semibold text-xs">Just now</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
