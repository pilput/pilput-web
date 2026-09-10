import { Bookmark, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BookmarkFolder, BookmarkRecord } from "@/types/bookmark";

interface BookmarkDialogsProps {
  editingFolder: BookmarkFolder | null;
  editFolderName: string;
  editFolderDescription: string;
  updatingFolder: boolean;
  onCloseEditFolder: () => void;
  onEditFolderNameChange: (value: string) => void;
  onEditFolderDescriptionChange: (value: string) => void;
  onSubmitEditFolder: () => void;

  deletingFolder: BookmarkFolder | null;
  deletingFolderProgress: boolean;
  onCloseDeleteFolder: () => void;
  onConfirmDeleteFolder: () => void;

  editingBookmark: BookmarkRecord | null;
  editBookmarkName: string;
  editBookmarkNotes: string;
  updatingBookmark: boolean;
  onCloseEditBookmark: () => void;
  onEditBookmarkNameChange: (value: string) => void;
  onEditBookmarkNotesChange: (value: string) => void;
  onSubmitEditBookmark: () => void;
}

export function BookmarkDialogs({
  editingFolder,
  editFolderName,
  editFolderDescription,
  updatingFolder,
  onCloseEditFolder,
  onEditFolderNameChange,
  onEditFolderDescriptionChange,
  onSubmitEditFolder,
  deletingFolder,
  deletingFolderProgress,
  onCloseDeleteFolder,
  onConfirmDeleteFolder,
  editingBookmark,
  editBookmarkName,
  editBookmarkNotes,
  updatingBookmark,
  onCloseEditBookmark,
  onEditBookmarkNameChange,
  onEditBookmarkNotesChange,
  onSubmitEditBookmark,
}: BookmarkDialogsProps) {
  return (
    <>
      <Dialog open={!!editingFolder} onOpenChange={(open) => !open && onCloseEditFolder()}>
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
                  onChange={(e) => onEditFolderNameChange(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-folder-desc">Description (optional)</Label>
                <Input
                  id="edit-folder-desc"
                  value={editFolderDescription}
                  onChange={(e) => onEditFolderDescriptionChange(e.target.value)}
                  placeholder="What this folder is about"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={onCloseEditFolder}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={updatingFolder}
              onClick={onSubmitEditFolder}
              className="cursor-pointer"
            >
              {updatingFolder && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingFolder} onOpenChange={(open) => !open && onCloseDeleteFolder()}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive leading-normal">
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
              onClick={onCloseDeleteFolder}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingFolderProgress}
              onClick={onConfirmDeleteFolder}
              className="cursor-pointer"
            >
              {deletingFolderProgress && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingBookmark} onOpenChange={(open) => !open && onCloseEditBookmark()}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 leading-normal">
              <Bookmark className="w-5 h-5 text-primary fill-primary/10" />
              Configure Saved Details
            </DialogTitle>
          </DialogHeader>
          {editingBookmark && (
            <div className="space-y-4 py-2 text-left">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Original post:</span>
                <p className="text-sm font-bold line-clamp-2 leading-snug">
                  {editingBookmark.post?.title}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bookmark-name">Custom Title / Name</Label>
                <Input
                  id="edit-bookmark-name"
                  value={editBookmarkName}
                  onChange={(e) => onEditBookmarkNameChange(e.target.value)}
                  placeholder="Give this saved post a custom title override (optional)"
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bookmark-notes">Private Notes</Label>
                <Textarea
                  id="edit-bookmark-notes"
                  value={editBookmarkNotes}
                  onChange={(e) => onEditBookmarkNotesChange(e.target.value)}
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
              onClick={onCloseEditBookmark}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={updatingBookmark}
              onClick={onSubmitEditBookmark}
              className="cursor-pointer"
            >
              {updatingBookmark && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
