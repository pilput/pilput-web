"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bookmark,
  FolderPlus,
  Loader2,
  Trash2,
  Folder,
  Calendar,
  BookOpen,
  MoreVertical,
  Edit2,
  Search,
  FolderOpen,
  Tag,
  ArrowRight,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getToken } from "@/utils/Auth";
import { bookmarkStore } from "@/stores/bookmarkStore";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";
import { getUrlImage, getProfilePicture } from "@/utils/getImage";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookmarkRecord, BookmarkFolder } from "@/types/bookmark";

export default function BookmarksClient() {
  const loadBookmarks = bookmarkStore((s) => s.loadBookmarks);
  const loadFolders = bookmarkStore((s) => s.loadFolders);
  const bookmarks = bookmarkStore((s) => s.bookmarks);
  const folders = bookmarkStore((s) => s.folders);
  const loading = bookmarkStore((s) => s.loading);
  const loadingFolders = bookmarkStore((s) => s.loadingFolders);

  const toggleBookmark = bookmarkStore((s) => s.toggleBookmark);
  const createFolder = bookmarkStore((s) => s.createFolder);
  const updateFolder = bookmarkStore((s) => s.updateFolder);
  const deleteFolder = bookmarkStore((s) => s.deleteFolder);
  const updateBookmark = bookmarkStore((s) => s.updateBookmark);
  const moveBookmark = bookmarkStore((s) => s.moveBookmark);

  // States
  const [selectedFolderId, setSelectedFolderId] = useState<string | "all" | "uncategorized">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Folder creation state
  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderDescription, setFolderDescription] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Folder editing state
  const [editingFolder, setEditingFolder] = useState<BookmarkFolder | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderDescription, setEditFolderDescription] = useState("");
  const [updatingFolder, setUpdatingFolder] = useState(false);

  // Folder deletion state
  const [deletingFolder, setDeletingFolder] = useState<BookmarkFolder | null>(null);
  const [deletingFolderProgress, setDeletingFolderProgress] = useState(false);

  // Bookmark editing state
  const [editingBookmark, setEditingBookmark] = useState<BookmarkRecord | null>(null);
  const [editBookmarkName, setEditBookmarkName] = useState("");
  const [editBookmarkNotes, setEditBookmarkNotes] = useState("");
  const [updatingBookmark, setUpdatingBookmark] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    void loadBookmarks(true).catch(() => {
      toast.error("Could not load your reading list.");
    });
    void loadFolders(true).catch(() => {
      toast.error("Could not load folders.");
    });
  }, [loadBookmarks, loadFolders]);

  const onCreateFolder = async () => {
    const name = folderName.trim();
    if (!name) {
      toast.error("Please enter a folder name.");
      return;
    }
    setCreatingFolder(true);
    try {
      await createFolder(name, folderDescription.trim() || undefined);
      toast.success("Folder created successfully");
      setFolderOpen(false);
      setFolderName("");
      setFolderDescription("");
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setCreatingFolder(false);
    }
  };

  const onEditFolder = async () => {
    if (!editingFolder) return;
    const name = editFolderName.trim();
    if (!name) {
      toast.error("Please enter a folder name.");
      return;
    }
    setUpdatingFolder(true);
    try {
      await updateFolder(
        editingFolder.id,
        name,
        editFolderDescription.trim() || undefined,
      );
      toast.success("Folder updated");
      setEditingFolder(null);
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setUpdatingFolder(false);
    }
  };

  const onDeleteFolder = async () => {
    if (!deletingFolder) return;
    setDeletingFolderProgress(true);
    try {
      await deleteFolder(deletingFolder.id);
      toast.success("Folder deleted. Bookmarks are preserved.");
      if (selectedFolderId === deletingFolder.id) {
        setSelectedFolderId("all");
      }
      setDeletingFolder(null);
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setDeletingFolderProgress(false);
    }
  };

  const onEditBookmark = async () => {
    if (!editingBookmark) return;
    setUpdatingBookmark(true);
    try {
      await updateBookmark(
        editingBookmark.id,
        editBookmarkName.trim() || undefined,
        editBookmarkNotes.trim() || undefined,
      );
      toast.success("Saved details successfully");
      setEditingBookmark(null);
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setUpdatingBookmark(false);
    }
  };

  const onMoveBookmark = async (bookmarkId: string, folderId: string | null) => {
    try {
      await moveBookmark(bookmarkId, folderId);
      toast.success("Moved bookmark to selected folder");
    } catch (error) {
      ErrorHandlerAPI(error);
    }
  };

  const onRemoveBookmark = async (row: BookmarkRecord) => {
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

  // Derived Values
  const uncategorizedCount =
    bookmarks?.filter((b) => b.folder_id === null).length ?? 0;

  const currentFolder =
    selectedFolderId !== "all" && selectedFolderId !== "uncategorized"
      ? folders?.find((f) => f.id === selectedFolderId)
      : null;

  const currentFolderName =
    selectedFolderId === "all"
      ? "All Bookmarks"
      : selectedFolderId === "uncategorized"
        ? "Uncategorized"
        : currentFolder?.name ?? "Reading List";

  const currentFolderDesc =
    selectedFolderId === "all"
      ? "Everything you've saved to read later."
      : selectedFolderId === "uncategorized"
        ? "Saved items that are not filed under any folder."
        : currentFolder?.description ?? "Organized bookmarks folder.";

  const filteredBookmarks = (bookmarks ?? []).filter((row) => {
    // 1. Folder filtering
    if (selectedFolderId === "uncategorized") {
      if (row.folder_id !== null) return false;
    } else if (selectedFolderId !== "all") {
      if (row.folder_id !== selectedFolderId) return false;
    }

    // 2. Search query filtering
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.post?.title?.toLowerCase().includes(q) ||
      row.name?.toLowerCase().includes(q) ||
      row.notes?.toLowerCase().includes(q) ||
      row.post?.user?.first_name?.toLowerCase().includes(q) ||
      row.post?.user?.last_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 pt-4 pb-12">
      {/* Header Summary */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Bookmark className="w-8 h-8 text-primary fill-primary/10" />
            Reading List
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Organize articles, write notes, and save summaries of what you read.
          </p>
        </div>

        {/* Dialog for folder creation */}
        <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 cursor-pointer shadow-md font-semibold gap-1.5 self-start md:self-auto">
              <FolderPlus className="w-4 h-4" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md text-left">
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
                  placeholder="e.g. Artificial Intelligence, Marketing"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-desc">Description (optional)</Label>
                <Input
                  id="folder-desc"
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  placeholder="What this folder is about"
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
                {creatingFolder && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Create folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* SIDEBAR: Folder Manager */}
        <Card className="col-span-1 border border-border/70 shadow-sm bg-card/90 p-4 shrink-0">
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-border/50">
            <h3 className="font-bold text-sm tracking-wide text-foreground/80 uppercase">
              Folders
            </h3>
            {loadingFolders && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Global View: All Bookmarks */}
            <div
              onClick={() => setSelectedFolderId("all")}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all border text-sm",
                selectedFolderId === "all"
                  ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-xs"
                  : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Bookmark className={cn("w-4 h-4 shrink-0", selectedFolderId === "all" ? "text-primary fill-primary/10" : "text-muted-foreground/85")} />
                <span>All Bookmarks</span>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                selectedFolderId === "all"
                  ? "bg-primary/20 border-primary/30 text-primary"
                  : "bg-muted border-border text-muted-foreground"
              )}>
                {bookmarks?.length ?? 0}
              </span>
            </div>

            {/* Uncategorized */}
            <div
              onClick={() => setSelectedFolderId("uncategorized")}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all border text-sm",
                selectedFolderId === "uncategorized"
                  ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-xs"
                  : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FolderOpen className={cn("w-4 h-4 shrink-0", selectedFolderId === "uncategorized" ? "text-primary fill-primary/10" : "text-muted-foreground/85")} />
                <span>Uncategorized</span>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                selectedFolderId === "uncategorized"
                  ? "bg-primary/20 border-primary/30 text-primary"
                  : "bg-muted border-border text-muted-foreground"
              )}>
                {uncategorizedCount}
              </span>
            </div>

            {/* Folder Lists */}
            {folders && folders.length > 0 && (
              <div className="mt-2 border-t border-border/40 pt-2 flex flex-col gap-1">
                {folders.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all border text-sm",
                      selectedFolderId === f.id
                        ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-xs"
                        : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Folder className={cn("w-4 h-4 shrink-0", selectedFolderId === f.id ? "text-primary fill-primary/10" : "text-muted-foreground/80")} />
                      <span className="truncate">{f.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        selectedFolderId === f.id
                          ? "bg-primary/20 border-primary/30 text-primary"
                          : "bg-muted border-border text-muted-foreground"
                      )}>
                        {f.bookmark_count ?? 0}
                      </span>

                      {/* Folder options dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-muted/80 rounded-md cursor-pointer transition-opacity"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 text-left">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFolder(f);
                              setEditFolderName(f.name);
                              setEditFolderDescription(f.description || "");
                            }}
                            className="cursor-pointer gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Folder
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingFolder(f);
                            }}
                            className="cursor-pointer gap-2 text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Folder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* MAIN PANEL: Bookmarks list */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
          {/* Active Folder Header details & Search bar */}
          <Card className="border border-border/70 p-5 bg-card/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {currentFolderName}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {currentFolderDesc}
                </p>
              </div>

              {/* Action buttons if custom folder */}
              {currentFolder && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs cursor-pointer shadow-xs"
                    onClick={() => {
                      setEditingFolder(currentFolder);
                      setEditFolderName(currentFolder.name);
                      setEditFolderDescription(currentFolder.description || "");
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Rename
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => setDeletingFolder(currentFolder)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Local Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, custom name, author, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9.5 text-sm"
              />
            </div>
          </Card>

          {/* Bookmarks List Container */}
          {loading && !bookmarks?.length ? (
            <div className="flex justify-center py-24 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !filteredBookmarks.length ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-dashed border-2 border-border bg-card/45 backdrop-blur-xs">
                <CardContent className="py-16 text-center text-muted-foreground space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      {searchQuery.trim() ? "No search results match" : "No saved posts here"}
                    </p>
                    <p className="text-sm max-w-sm mx-auto">
                      {searchQuery.trim()
                        ? "Try clearing your search query or trying other search keywords."
                        : `Organize posts into '${currentFolderName}' by editing saved items or saving new posts.`}
                    </p>
                  </div>
                  {searchQuery.trim() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="cursor-pointer"
                    >
                      Clear search
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredBookmarks.map((row) => {
                  const post = row.post;
                  if (!post) return null; // Defensive check
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
                                className="block w-full sm:w-44 h-40 sm:h-auto shrink-0 bg-muted overflow-hidden relative"
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
                            <div className="flex-1 p-5 flex flex-col gap-3 min-w-0 justify-between">
                              <div className="space-y-2.5 text-left">
                                {/* Display user custom name or post title */}
                                <div className="space-y-1">
                                  {row.name && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary uppercase tracking-wider">
                                      <Tag className="w-3 h-3" />
                                      Customized Title
                                    </span>
                                  )}
                                  <Link
                                    href={href}
                                    className="block font-bold text-lg hover:text-primary transition-colors line-clamp-2 leading-snug"
                                  >
                                    {row.name || post.title}
                                  </Link>
                                  {row.name && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      Original: {post.title}
                                    </p>
                                  )}
                                </div>

                                {/* Author Metadata */}
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

                                  <span className="h-3 w-px bg-border" aria-hidden />

                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                                    {new Date(post.created_at).toLocaleDateString([], {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>

                                {/* Custom notes display */}
                                {row.notes && (
                                  <div className="mt-3.5 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10/40 relative">
                                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">
                                      <Tag className="w-3 h-3" />
                                      <span>My Note:</span>
                                    </div>
                                    <p className="text-xs text-foreground/90 font-mono italic leading-relaxed whitespace-pre-wrap">
                                      &ldquo;{row.notes}&rdquo;
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-border/40">
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold cursor-pointer shadow-xs">
                                    <Link href={href} className="inline-flex items-center">
                                      Read post
                                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                    onClick={() => {
                                      setEditingBookmark(row);
                                      setEditBookmarkName(row.name || "");
                                      setEditBookmarkNotes(row.notes || "");
                                    }}
                                  >
                                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                                    Edit Note
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                    disabled={busy}
                                    onClick={() => void onRemoveBookmark(row)}
                                  >
                                    {busy ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    )}
                                    Remove
                                  </Button>
                                </div>

                                {/* Folder move action dropdown */}
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                                    Folder:
                                  </span>
                                  <Select
                                    value={row.folder_id || "none"}
                                    onValueChange={(val) =>
                                      void onMoveBookmark(
                                        row.id,
                                        val === "none" ? null : val,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-8 text-xs font-semibold w-[140px] shadow-2xs border-border/80">
                                      <SelectValue placeholder="Move folder..." />
                                    </SelectTrigger>
                                    <SelectContent align="end">
                                      <SelectItem value="none">Uncategorized</SelectItem>
                                      {folders?.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>
                                          {f.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
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
      </div>

      {/* Edit Folder Dialog */}
      <Dialog open={!!editingFolder} onOpenChange={(open) => !open && setEditingFolder(null)}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle>Edit folder</DialogTitle>
          </DialogHeader>
          {editingFolder && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-folder-name">Name</Label>
                <Input
                  id="edit-folder-name"
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-folder-desc">Description (optional)</Label>
                <Input
                  id="edit-folder-desc"
                  value={editFolderDescription}
                  onChange={(e) => setEditFolderDescription(e.target.value)}
                  placeholder="What this folder is about"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingFolder(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={updatingFolder}
              onClick={() => void onEditFolder()}
              className="cursor-pointer"
            >
              {updatingFolder && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder confirmation Dialog */}
      <Dialog open={!!deletingFolder} onOpenChange={(open) => !open && setDeletingFolder(null)}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Info className="w-5 h-5" />
              Delete Folder
            </DialogTitle>
          </DialogHeader>
          {deletingFolder && (
            <div className="py-2 space-y-2.5">
              <p className="text-sm font-semibold">
                Are you sure you want to delete folder &ldquo;{deletingFolder.name}&rdquo;?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This action will delete the folder itself. The saved posts in this folder will NOT be deleted; they will be moved to your Uncategorized list.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeletingFolder(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingFolderProgress}
              onClick={() => void onDeleteFolder()}
              className="cursor-pointer"
            >
              {deletingFolderProgress && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bookmark details/notes Dialog */}
      <Dialog open={!!editingBookmark} onOpenChange={(open) => !open && setEditingBookmark(null)}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary fill-primary/10" />
              Configure Saved Details
            </DialogTitle>
          </DialogHeader>
          {editingBookmark && (
            <div className="space-y-4 py-2 text-left">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Original post:</span>
                <p className="text-sm font-bold truncate leading-none">
                  {editingBookmark.post?.title}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bookmark-name">Custom Title / Name</Label>
                <Input
                  id="edit-bookmark-name"
                  value={editBookmarkName}
                  onChange={(e) => setEditBookmarkName(e.target.value)}
                  placeholder="Give this saved post a custom title override (optional)"
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bookmark-notes">Private Notes</Label>
                <Textarea
                  id="edit-bookmark-notes"
                  value={editBookmarkNotes}
                  onChange={(e) => setEditBookmarkNotes(e.target.value)}
                  placeholder="Add private summaries, reminders, or insights..."
                  maxLength={2000}
                  className="resize-none min-h-[120px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingBookmark(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={updatingBookmark}
              onClick={() => void onEditBookmark()}
              className="cursor-pointer"
            >
              {updatingBookmark && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
