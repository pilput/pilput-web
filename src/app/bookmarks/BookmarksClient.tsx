"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bookmark, FolderPlus, Loader2, Trash2 } from "lucide-react";
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
      <div className="flex-1 w-full flex flex-col max-w-2xl mx-auto px-4 py-16 text-center justify-center">
        <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Reading list</h1>
        <p className="text-muted-foreground mb-6">
          Sign in to save posts and read them later.
        </p>
        <Button asChild>
          <Link href={`/login?redirect=${encodeURIComponent("/bookmarks")}`}>
            Sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col max-w-3xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reading list</h1>
          <p className="text-muted-foreground mt-1">
            Posts you have saved for later
          </p>
        </div>
        <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <FolderPlus className="w-4 h-4 mr-2" />
              New folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Name</Label>
                <Input
                  id="folder-name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Read later"
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
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFolderOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={creatingFolder}
                onClick={() => void onCreateFolder()}
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
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : !bookmarks?.length ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No saved posts yet.</p>
            <p className="text-sm mt-2">
              Browse the{" "}
              <Link href="/blog" className="text-primary underline">
                blog
              </Link>{" "}
              and click the bookmark icon on any post.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((row) => {
            const post = row.post;
            const href = `/${post.user.username}/${post.slug}`;
            const busy = removingId === row.id;
            return (
              <li key={row.id}>
                <Card className="overflow-hidden hover:border-primary/30 transition-colors">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-stretch">
                      {post.photo_url ? (
                        <Link
                          href={href}
                          className="block w-full sm:w-44 h-40 shrink-0 bg-muted overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getUrlImage(post.photo_url)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      ) : null}
                      <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
                        <Link
                          href={href}
                          className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Link
                            href={`/${post.user.username}`}
                            className="inline-flex items-center gap-2 min-w-0 hover:text-foreground"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={getProfilePicture(post.user.image)}
                                alt=""
                              />
                              <AvatarFallback className="text-[10px]">
                                {post.user.username[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">
                              {post.user.first_name} {post.user.last_name}
                            </span>
                          </Link>
                        </div>
                        {row.folder?.name ? (
                          <p className="text-xs text-muted-foreground">
                            Folder: {row.folder.name}
                          </p>
                        ) : null}
                        <div className="flex items-center gap-2 mt-auto pt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={href}>Read</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={busy}
                            onClick={() => void onRemove(row)}
                          >
                            {busy ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
