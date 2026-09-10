import { useMemo } from "react";
import type { BookmarkFolder, BookmarkRecord } from "@/types/bookmark";
import type { FolderSelection } from "../components/types";

interface BookmarkFilters {
  uncategorizedCount: number;
  currentFolder: BookmarkFolder | null;
  currentFolderName: string;
  currentFolderDesc: string;
  filteredBookmarks: BookmarkRecord[];
}

export function useBookmarkFilters(
  bookmarks: BookmarkRecord[] | null,
  folders: BookmarkFolder[] | null,
  selectedFolderId: FolderSelection,
  searchQuery: string,
): BookmarkFilters {
  return useMemo(() => {
    const list = bookmarks ?? [];

    const uncategorizedCount = list.filter((b) => b.folder_id === null).length;

    const currentFolder =
      selectedFolderId !== "all" && selectedFolderId !== "uncategorized"
        ? (folders?.find((f) => f.id === selectedFolderId) ?? null)
        : null;

    const currentFolderName =
      selectedFolderId === "all"
        ? "All Bookmarks"
        : selectedFolderId === "uncategorized"
          ? "Uncategorized"
          : (currentFolder?.name ?? "Reading List");

    const currentFolderDesc =
      selectedFolderId === "all"
        ? "Everything you've saved to read later."
        : selectedFolderId === "uncategorized"
          ? "Saved items that are not filed under any folder."
          : (currentFolder?.description ?? "Organized bookmarks folder.");

    const q = searchQuery.trim().toLowerCase();
    const filteredBookmarks = list.filter((row) => {
      // 1. Folder filtering
      if (selectedFolderId === "uncategorized") {
        if (row.folder_id !== null) return false;
      } else if (selectedFolderId !== "all") {
        if (row.folder_id !== selectedFolderId) return false;
      }

      // 2. Search query filtering
      if (!q) return true;
      return (
        row.post?.title?.toLowerCase().includes(q) ||
        row.name?.toLowerCase().includes(q) ||
        row.notes?.toLowerCase().includes(q) ||
        row.post?.user?.username?.toLowerCase().includes(q)
      );
    });

    return {
      uncategorizedCount,
      currentFolder,
      currentFolderName,
      currentFolderDesc,
      filteredBookmarks,
    };
  }, [bookmarks, folders, selectedFolderId, searchQuery]);
}
