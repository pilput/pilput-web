"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { Bookmark, Loader2 } from "lucide-react";
import { getToken } from "@/utils/Auth";
import { bookmarkStore } from "@/stores/bookmarkStore";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";
import type { BookmarkFolder, BookmarkRecord } from "@/types/bookmark";
import { useBookmarkFilters } from "./hooks/useBookmarkFilters";
import { SignInPrompt } from "./components/SignInPrompt";
import { CreateFolderDialog } from "./components/CreateFolderDialog";
import { FolderSidebar } from "./components/FolderSidebar";
import { FolderHeaderCard } from "./components/FolderHeaderCard";
import { BookmarkCard } from "./components/BookmarkCard";
import { BookmarkDialogs } from "./components/BookmarkDialogs";
import { EmptyState } from "./components/EmptyState";
import type { FolderSelection } from "./components/types";

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

  const [selectedFolderId, setSelectedFolderId] = useState<FolderSelection>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderDescription, setFolderDescription] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [editingFolder, setEditingFolder] = useState<BookmarkFolder | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderDescription, setEditFolderDescription] = useState("");
  const [updatingFolder, setUpdatingFolder] = useState(false);

  const [deletingFolder, setDeletingFolder] = useState<BookmarkFolder | null>(null);
  const [deletingFolderProgress, setDeletingFolderProgress] = useState(false);

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

  const {
    uncategorizedCount,
    currentFolder,
    currentFolderName,
    currentFolderDesc,
    filteredBookmarks,
  } = useBookmarkFilters(bookmarks, folders, selectedFolderId, searchQuery);

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

  const openEditFolder = (folder: BookmarkFolder) => {
    setEditingFolder(folder);
    setEditFolderName(folder.name);
    setEditFolderDescription(folder.description || "");
  };

  const openEditBookmark = (row: BookmarkRecord) => {
    setEditingBookmark(row);
    setEditBookmarkName(row.name || "");
    setEditBookmarkNotes(row.notes || "");
  };

  if (!getToken()) {
    return <SignInPrompt />;
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 pt-4 pb-12">
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

        <CreateFolderDialog
          open={folderOpen}
          name={folderName}
          description={folderDescription}
          creating={creatingFolder}
          onOpenChange={setFolderOpen}
          onNameChange={setFolderName}
          onDescriptionChange={setFolderDescription}
          onSubmit={() => void onCreateFolder()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        <FolderSidebar
          folders={folders}
          totalCount={bookmarks?.length ?? 0}
          uncategorizedCount={uncategorizedCount}
          selectedFolderId={selectedFolderId}
          loadingFolders={loadingFolders}
          onSelect={setSelectedFolderId}
          onEdit={openEditFolder}
          onDelete={setDeletingFolder}
        />

        <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
          <FolderHeaderCard
            title={currentFolderName}
            description={currentFolderDesc}
            currentFolder={currentFolder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEditFolder={openEditFolder}
            onDeleteFolder={setDeletingFolder}
          />

          {loading && !bookmarks?.length ? (
            <div className="flex justify-center py-24 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !filteredBookmarks.length ? (
            <EmptyState
              searching={!!searchQuery.trim()}
              folderName={currentFolderName}
              onClearSearch={() => setSearchQuery("")}
            />
          ) : (
            <ul className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredBookmarks.map((row) => (
                  <BookmarkCard
                    key={row.id}
                    row={row}
                    folders={folders}
                    busy={removingId === row.id}
                    onEdit={openEditBookmark}
                    onRemove={(r) => void onRemoveBookmark(r)}
                    onMove={(id, folderId) => void onMoveBookmark(id, folderId)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>

      <BookmarkDialogs
        editingFolder={editingFolder}
        editFolderName={editFolderName}
        editFolderDescription={editFolderDescription}
        updatingFolder={updatingFolder}
        onCloseEditFolder={() => setEditingFolder(null)}
        onEditFolderNameChange={setEditFolderName}
        onEditFolderDescriptionChange={setEditFolderDescription}
        onSubmitEditFolder={() => void onEditFolder()}
        deletingFolder={deletingFolder}
        deletingFolderProgress={deletingFolderProgress}
        onCloseDeleteFolder={() => setDeletingFolder(null)}
        onConfirmDeleteFolder={() => void onDeleteFolder()}
        editingBookmark={editingBookmark}
        editBookmarkName={editBookmarkName}
        editBookmarkNotes={editBookmarkNotes}
        updatingBookmark={updatingBookmark}
        onCloseEditBookmark={() => setEditingBookmark(null)}
        onEditBookmarkNameChange={setEditBookmarkName}
        onEditBookmarkNotesChange={setEditBookmarkNotes}
        onSubmitEditBookmark={() => void onEditBookmark()}
      />
    </div>
  );
}
