import { getToken } from "./Auth";
import { apiClient } from "./fetch";
import type {
  UpdateBookmarkRequest,
  CreateBookmarkFolderRequest,
  UpdateBookmarkFolderRequest,
} from "@/types/bookmark";

/** Toggle bookmark for a post (add / remove). */
export function toggleBookmark(
  postId: string,
  body?: { folder_id?: string | null; name?: string; notes?: string },
) {
  return apiClient.post(`/api/bookmarks/${postId}`, body ?? {}, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

/** List bookmarks for the current user. */
export function getBookmarks(folderId?: string | null) {
  const params: Record<string, string> | undefined =
    folderId === undefined
      ? undefined
      : { folder_id: folderId === null ? "null" : folderId };
  return apiClient.get(`/api/bookmarks`, {
    ...(params ? { params } : {}),
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

/** Update bookmark name / notes annotations. */
export function updateBookmark(bookmarkId: string, body: UpdateBookmarkRequest) {
  return apiClient.patch(`/api/bookmarks/${bookmarkId}`, body, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

/** Move bookmark to a different folder. */
export function moveBookmark(bookmarkId: string, folderId: string | null) {
  return apiClient.patch(
    `/api/bookmarks/${bookmarkId}/move`,
    { folder_id: folderId },
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );
}

/** Create a new bookmark folder. */
export function createBookmarkFolder(body: CreateBookmarkFolderRequest) {
  return apiClient.post(`/api/bookmarks/folders`, body, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

/** List all bookmark folders. */
export function getBookmarkFolders() {
  return apiClient.get(`/api/bookmarks/folders`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

/** Update bookmark folder name and/or description. */
export function updateBookmarkFolder(
  folderId: string,
  body: UpdateBookmarkFolderRequest,
) {
  return apiClient.patch(`/api/bookmarks/folders/${folderId}`, body, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

/** Delete a bookmark folder. */
export function deleteBookmarkFolder(folderId: string) {
  return apiClient.delete(`/api/bookmarks/folders/${folderId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}
