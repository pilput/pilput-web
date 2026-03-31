import type { Post, PostCreate } from "@/types/post";
import { create } from "zustand";
import { apiClientSecondary, apiClientApp } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";

const DEFAULT_BODY = `
  <h3>Hi there,</h3>
  <p>
    this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of
    basic text styles you'd expect from a text editor. But wait until you see the lists:
  </p>
  <ul>
    <li>That's a bullet list with one …</li>
    <li>… or two list items.</li>
  </ul>
  <p>
    Isn't that great? And all of that is editable. But wait, there's more.
    Let's try a code block:
  </p>
  <pre><code class="language-css">body {
    display: none;
  }</code></pre>
  <p>
    I know, I know, this is impressive. It's only the tip of the iceberg though.
    Give it a try and click around. Don't forget to check the other examples too.
  </p>
  <blockquote>
    Wow, that's amazing. Good work, boy! 👏<br />— Mom
  </blockquote>
`;

const MAX_TAGS = 5;

interface UpdatePostState {
  postId: string | null;
  post: PostCreate;
  loading: boolean;
  isUpdating: boolean;
  updateTitle: (title: string) => void;
  updateBody: (body: string) => void;
  updateSlug: (slug: string) => void;
  updatePhotoUrl: (photoUrl: string) => void;
  addTag: (name: string) => { ok: true } | { ok: false; reason: "empty" | "duplicate" | "limit" };
  removeTagAt: (index: number) => void;
  updatePostId: (id: string) => void;
  fetchPostById: (id: string) => Promise<Post | null>;
  updatePost: () => Promise<boolean>;
  resetStore: () => void;
  error: boolean;
  total: number;
}

export const updatePostStore = create<UpdatePostState>()((set, get) => ({
  postId: null,
  post: {
    title: "",
    body: DEFAULT_BODY,
    slug: "",
    photo_url: "",
    tags: [],
  },
  loading: false,
  isUpdating: false,
  updateTitle: (title) =>
    set((state) => ({
      post: { ...state.post, title },
    })),
  updateBody: (body) =>
    set((state) => ({
      post: { ...state.post, body },
    })),
  updateSlug: (slug) =>
    set((state) => ({
      post: { ...state.post, slug },
    })),
  updatePhotoUrl: (photo_url) =>
    set((state) => ({
      post: { ...state.post, photo_url },
    })),
  addTag: (rawName) => {
    const name = rawName.trim();
    if (!name) return { ok: false, reason: "empty" };
    const { post } = get();
    if (post.tags.length >= MAX_TAGS) return { ok: false, reason: "limit" };
    const lower = name.toLowerCase();
    if (post.tags.some((t) => t.toLowerCase() === lower))
      return { ok: false, reason: "duplicate" };
    set((state) => ({
      post: {
        ...state.post,
        tags: [...state.post.tags, name],
      },
    }));
    return { ok: true };
  },
  removeTagAt: (index) =>
    set((state) => ({
      post: {
        ...state.post,
        tags: state.post.tags.filter((_, i) => i !== index),
      },
    })),
  updatePostId: (id) =>
    set(() => ({
      postId: id,
    })),
  fetchPostById: async (id: string) => {
    const token = getToken();
    set(() => ({ loading: true, error: false }));
    try {
      const response = await apiClientApp.get(`/v1/posts/me/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postData = response.data.data;

      const rawTags = postData.tags ?? [];
      const tags: string[] = rawTags.map((t: { name?: string } | string) =>
        typeof t === "string" ? t : (t.name ?? "")
      ).filter(Boolean);

      set(() => ({
        postId: postData.id,
        post: {
          title: postData.title,
          body: postData.body,
          slug: postData.slug,
          photo_url: postData.photo_url,
          tags,
        },
        loading: false,
      }));

      return postData;
    } catch (error) {
      console.error("Error fetching post:", error);
      set(() => ({ loading: false, error: true }));
      return null;
    }
  },
  updatePost: async () => {
    const { postId, post } = get();
    const token = getToken();

    if (!postId) return false;

    set(() => ({ isUpdating: true, error: false }));

    try {
      await apiClientSecondary.patch(`/v1/posts/${postId}`, post, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set(() => ({ isUpdating: false }));
      return true;
    } catch (error) {
      console.error("Error updating post:", error);
      set(() => ({ isUpdating: false, error: true }));
      return false;
    }
  },
  resetStore: () =>
    set(() => ({
      postId: null,
      post: {
        title: "",
        body: DEFAULT_BODY,
        slug: "",
        photo_url: "",
        tags: [],
      },
    })),
  error: false,
  total: 0,
}));
