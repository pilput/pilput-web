import { getToken } from "./Auth";
import { apiClient } from "./fetch";

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

export function createBookmarkFolder(body: {
  name: string;
  description?: string;
}) {
  return apiClient.post(`/api/bookmarks/folders`, body, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export function getBookmarkFolders() {
  return apiClient.get(`/api/bookmarks/folders`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}
