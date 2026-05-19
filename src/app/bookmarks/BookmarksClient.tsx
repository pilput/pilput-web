"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bookmark, FolderPlus, Loader2, Trash2, Folder, Calendar, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getToken } from "@/utils/Auth";
import { bookmarkStore } from "@/stores/bookmarkStore";
import { createBookmarkFolder } from "@/utils/bookmarks";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";
import { getUrlImage, getProfilePicture } from "@/utils/getImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BookmarkRecord } from "@/types/bookmark";

export default function BookmarksClient() {
  const loadBookmarks = bookmarkStore((s) => s.loadBookmarks);
  const toggleBookmark = bookmarkStore((s) => s.toggleBookmark);
  const bookmarks = bookmarkStore((s) => s.bookmarks);
  const loading = bookmarkStore((s) => s.loading);

  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderDescription, setFolderDescription] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    void loadBookmarks(true).catch(() => {
      toast.error("Could not load your reading list.");
    });
  }, [loadBookmarks]);

  const onCreateFolder = async () => {
    const name = folderName.trim();
    if (!name) {
      toast.error("Please enter a folder name.");
      return;
    }
    if (!getToken()) {
      return;
    }
    setCreatingFolder(true);
    try {
      await createBookmarkFolder({
        name,
        description: folderDescription.trim() || undefined,
      });
      toast.success("Folder created");
      setFolderOpen(false);
      setFolderName("");
      setFolderDescription("");
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setCreatingFolder(false);
    }
  };

  const onRemove = async (row: BookmarkRecord) => {
    if (!getToken()) {
      return;
    }
    setRemovingId(row.id);
    try {
      await toggleBookmark(row.post_id);
      toast.success("Removed from reading list");
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setRemovingId(null);
    }
  };

  if (!getToken()) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-16 text-center">
        <div className="relative p-8 w-full border border-border/70 bg-card/90 shadow-xl rounded-2xl backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-5">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Bookmark className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Your Reading List</h1>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Keep track of articles, thoughts, and stories you want to read later. Sign in to save posts to your private library.
            </p>
            <div className="pt-2">
              <Button asChild className="w-full sm:w-auto px-8 py-5 shadow-md shadow-primary/15 font-semibold cursor-pointer">
                <Link href={`/login?redirect=${encodeURIComponent("/bookmarks")}`}>
                  Sign in to Pilput
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col max-w-3xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Reading list</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Posts you have saved for later
          </p>
        </div>
        <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="shrink-0 cursor-pointer shadow-sm">
              <FolderPlus className="w-4 h-4 mr-2" />
              New folder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Create folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Name</Label>
                <Input
                  id="folder-name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Technical posts, In-depth guides"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-desc">Description (optional)</Label>
                <Input
                  id="folder-desc"
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  placeholder="What this folder is for"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFolderOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={creatingFolder}
                onClick={() => void onCreateFolder()}
                className="cursor-pointer"
              >
                {creatingFolder ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading && !bookmarks?.length ? (
        <div className="flex justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !bookmarks?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-dashed border-2 border-border bg-card/45 backdrop-blur-xs">
            <CardContent className="py-16 text-center text-muted-foreground space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">No saved posts yet</p>
                <p className="text-sm max-w-sm mx-auto">
                  Browse the{" "}
                  <Link href="/blog" className="text-primary font-medium hover:underline">
                    blog
                  </Link>{" "}
                  and click the bookmark icon on any post to save it here.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence mode="popLayout">
            {bookmarks.map((row) => {
              const post = row.post;
              const href = `/${post.user.username}/${post.slug}`;
              const busy = removingId === row.id;
              return (
                <motion.li
                  key={row.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  layout
                >
                  <Card className="group overflow-hidden border-border/70 hover:border-primary/25 bg-card/90 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row sm:items-stretch">
                        {post.photo_url ? (
                          <Link
                            href={href}
                            className="block w-full sm:w-48 h-44 sm:h-auto shrink-0 bg-muted overflow-hidden relative"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getUrlImage(post.photo_url)}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Link>
                        ) : null}
                        <div className="flex-1 p-5 flex flex-col gap-3.5 min-w-0 justify-between">
                          <div className="space-y-2.5">
                            <Link
                              href={href}
                              className="block font-bold text-lg hover:text-primary transition-colors line-clamp-2 leading-snug"
                            >
                              {post.title}
                            </Link>
                            
                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                              <Link
                                href={`/${post.user.username}`}
                                className="inline-flex items-center gap-1.5 min-w-0 hover:text-foreground font-medium transition-colors"
                              >
                                <Avatar className="h-5 w-5 border border-border">
                                  <AvatarImage
                                    src={getProfilePicture(post.user.image)}
                                    alt=""
                                  />
                                  <AvatarFallback className="text-[9px] font-bold">
                                    {post.user.username[0]?.toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate">
                                  {post.user.first_name} {post.user.last_name}
                                </span>
                              </Link>
                              
                              <span className="h-3 w-px bg-border" />
                              
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 opacity-70" />
                                {new Date(post.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-border/40">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold cursor-pointer shadow-xs">
                                <Link href={href}>Read post</Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                disabled={busy}
                                onClick={() => void onRemove(row)}
                              >
                                {busy ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                                )}
                                Remove
                              </Button>
                            </div>

                            {row.folder?.name ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                                <Folder className="w-3 h-3" />
                                {row.folder.name}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
