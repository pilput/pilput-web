"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bookmark, Folder, Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getToken } from "@/utils/Auth";
import { bookmarkStore } from "@/stores/bookmarkStore";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { BookmarkFolder, BookmarkRecord } from "@/types/bookmark";

interface BookmarkButtonProps {
  postId: string;
  /** Server-side bookmark total; optional optimistic count updates on toggle. */
  initialCount?: number;
  /** When true, shows total bookmarks (compact: icon + number, like likes). */
  showCount?: boolean;
  className?: string;
  iconClassName?: string;
  variant?: "default" | "compact";
}

function normalizeBookmarkCount(value: number | undefined): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export default function BookmarkButton({
  postId,
  initialCount = 0,
  showCount = false,
  className,
  iconClassName,
  variant = "default",
}: BookmarkButtonProps) {
  const pathname = usePathname();
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || "/")}`;

  const loadBookmarks = bookmarkStore((s) => s.loadBookmarks);
  const toggleBookmark = bookmarkStore((s) => s.toggleBookmark);
  const isBookmarked = bookmarkStore((s) => Boolean(s.byPostId[postId]));
  const loadingList = bookmarkStore((s) => s.loading);
  const loaded = bookmarkStore((s) => s.loaded);

  // Store actions and state for folder & annotation editing
  const bookmarks = bookmarkStore((s) => s.bookmarks);
  const folders = bookmarkStore((s) => s.folders);
  const loadFolders = bookmarkStore((s) => s.loadFolders);
  const createFolder = bookmarkStore((s) => s.createFolder);
  const updateBookmark = bookmarkStore((s) => s.updateBookmark);
  const moveBookmark = bookmarkStore((s) => s.moveBookmark);

  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(() => normalizeBookmarkCount(initialCount));
  const [prevPostId, setPrevPostId] = useState(postId);
  const [prevInitialCount, setPrevInitialCount] = useState(initialCount);

  // Dialog open state
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);

  const bookmark = bookmarks?.find((b) => b.post_id === postId);

  if (postId !== prevPostId || initialCount !== prevInitialCount) {
    setPrevPostId(postId);
    setPrevInitialCount(initialCount);
    setCount(normalizeBookmarkCount(initialCount));
  }

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    void loadBookmarks().catch(() => {
      /* optional: silent fail until user interacts */
    });
  }, [loadBookmarks]);

  useEffect(() => {
    if (isManageOpen && getToken()) {
      void loadFolders().catch(() => {});
    }
  }, [isManageOpen, loadFolders]);

  const onClick = async () => {
    if (!getToken()) {
      toast.error("Sign in to save posts to your reading list.");
      return;
    }
    setBusy(true);
    try {
      const action = await toggleBookmark(postId);
      setCount((c) => {
        if (action === "added") return c + 1;
        if (action === "removed") return Math.max(0, c - 1);
        return c;
      });
      if (action === "added") {
        toast.success("Saved to reading list", {
          action: {
            label: "Add details",
            onClick: () => {
              setIsManageOpen(true);
            },
          },
        });
      } else {
        toast.success("Removed from reading list");
      }
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setBusy(false);
    }
  };

  const onSaveDetails = async (
    name: string,
    notes: string,
    folderId: string,
    newFolder?: { name: string; description: string },
  ) => {
    if (!bookmark) return;
    setSavingDetails(true);
    try {
      let targetFolderId = folderId;
      if (folderId === "new" && newFolder) {
        const folderNameStr = newFolder.name.trim();
        if (!folderNameStr) {
          toast.error("Please enter a folder name.");
          setSavingDetails(false);
          return;
        }
        await createFolder(folderNameStr, newFolder.description.trim() || undefined);
        const freshFolders = bookmarkStore.getState().folders;
        const createdFolder = freshFolders?.find((f) => f.name === folderNameStr);
        if (createdFolder) {
          targetFolderId = createdFolder.id;
        } else {
          targetFolderId = "none";
        }
      }

      await updateBookmark(
        bookmark.id,
        name.trim() || undefined,
        notes.trim() || undefined,
      );

      const currentFolderId = bookmark.folder_id || "none";
      if (targetFolderId !== currentFolderId) {
        await moveBookmark(
          bookmark.id,
          targetFolderId === "none" ? null : targetFolderId,
        );
      }

      toast.success("Bookmark updated successfully");
      setIsManageOpen(false);
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setSavingDetails(false);
    }
  };

  const showSpinner =
    busy || (Boolean(getToken()) && !loaded && loadingList);

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            {variant === "compact" ? (
              <motion.button
                type="button"
                disabled={showSpinner}
                onClick={() => void onClick()}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors",
                  "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  "disabled:pointer-events-none disabled:opacity-50",
                  isBookmarked &&
                    "text-primary hover:bg-primary/10 hover:text-primary",
                  className,
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={isBookmarked}
                aria-label={
                  showCount
                    ? `${isBookmarked ? "Remove bookmark" : "Add bookmark"}, ${count} saves`
                    : isBookmarked
                      ? "Remove bookmark"
                      : "Add bookmark"
                }
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4 shrink-0 stroke-[1.75]",
                    isBookmarked
                      ? "fill-primary text-primary"
                      : "text-muted-foreground",
                    iconClassName,
                  )}
                />
                {showCount && (
                  <span className="min-w-[1ch] tabular-nums text-[13px]">
                    {count}
                  </span>
                )}
              </motion.button>
            ) : (
              <motion.button
                type="button"
                disabled={showSpinner}
                onClick={() => void onClick()}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border/80 bg-background px-3 text-sm font-medium text-muted-foreground shadow-sm transition-colors",
                  "hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
                  isBookmarked && "border-primary/40 text-primary",
                  className,
                )}
                whileHover={{ scale: 1.01 }}
                aria-pressed={isBookmarked}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isBookmarked ? "fill-primary text-primary" : "",
                    iconClassName,
                  )}
                />
                {showCount && (
                  <span className="tabular-nums min-w-[1ch]">{count}</span>
                )}
                {isBookmarked ? "Saved" : "Save"}
              </motion.button>
            )}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {!getToken() ? (
              <span>
                Sign in to save —{" "}
                <Link href={loginHref} className="underline font-medium">
                  Log in
                </Link>
              </span>
            ) : isBookmarked ? (
              "Click to remove from reading list. Or configure details."
            ) : (
              "Save this post for later"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Annotation Dialog */}
      {isManageOpen && bookmark && (
        <ConfigureBookmarkDialog
          open={isManageOpen}
          onOpenChange={setIsManageOpen}
          bookmark={bookmark}
          folders={folders}
          onSave={onSaveDetails}
          saving={savingDetails}
        />
      )}
    </>
  );
}

interface ConfigureBookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookmark: BookmarkRecord;
  folders: BookmarkFolder[] | null;
  onSave: (
    name: string,
    notes: string,
    folderId: string,
    newFolder?: { name: string; description: string },
  ) => Promise<void>;
  saving: boolean;
}

function ConfigureBookmarkDialog({
  open,
  onOpenChange,
  bookmark,
  folders,
  onSave,
  saving,
}: ConfigureBookmarkDialogProps) {
  const [customName, setCustomName] = useState(bookmark.name || "");
  const [customNotes, setCustomNotes] = useState(bookmark.notes || "");
  const [selectedFolderId, setSelectedFolderId] = useState(bookmark.folder_id || "none");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");

  const handleSave = () => {
    void onSave(
      customName,
      customNotes,
      selectedFolderId,
      selectedFolderId === "new"
        ? { name: newFolderName, description: newFolderDescription }
        : undefined,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary fill-primary" />
            Configure Bookmark
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 text-left">
          <div className="space-y-2">
            <Label htmlFor="bookmark-name">Custom Title / Name</Label>
            <Input
              id="bookmark-name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Give this saved post a custom title (optional)"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookmark-folder">Folder</Label>
            <Select
              value={selectedFolderId}
              onValueChange={setSelectedFolderId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    No Folder (Uncategorized)
                  </span>
                </SelectItem>
                {folders?.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    <span className="flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5" />
                      {f.name}
                    </span>
                  </SelectItem>
                ))}
                <SelectItem value="new" className="text-primary font-medium">
                  <span className="flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Create New Folder...
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedFolderId === "new" && (
            <div className="space-y-3.5 p-3 rounded-lg border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-1.5 duration-200">
              <div className="space-y-1.5">
                <Label htmlFor="new-folder-name" className="text-xs">New Folder Name</Label>
                <Input
                  id="new-folder-name"
                  size={30}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  maxLength={100}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-folder-desc" className="text-xs">Description (optional)</Label>
                <Input
                  id="new-folder-desc"
                  size={30}
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  placeholder="Description"
                  maxLength={1000}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bookmark-notes">Private Notes</Label>
            <Textarea
              id="bookmark-notes"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Add your notes, ideas, or key takeaways from this article..."
              maxLength={2000}
              className="resize-none min-h-[90px]"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="cursor-pointer"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
