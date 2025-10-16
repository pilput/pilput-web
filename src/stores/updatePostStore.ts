import { PostCreate } from '@/types/post'
import { create } from 'zustand'

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
`

interface UpdatePostState {
  postId: string | null
  post: PostCreate
  updateTitle: (title: string) => void
  updateBody: (body: string) => void
  updateSlug: (slug: string) => void
  updatePhotoUrl: (photoUrl: string) => void
  updatePostId: (id: string) => void
  resetStore: () => void
  error: boolean
  total: number
}

export const updatePostStore = create<UpdatePostState>()((set) => ({
  postId: null,
  post: {
    title: '',
    body: DEFAULT_BODY,
    slug: '',
    photo_url: '',
    tags: []
  },
  updateTitle: (title) =>
    set((state) => ({
      post: { ...state.post, title }
    })),
  updateBody: (body) =>
    set((state) => ({
      post: { ...state.post, body }
    })),
  updateSlug: (slug) =>
    set((state) => ({
      post: { ...state.post, slug }
    })),
  updatePhotoUrl: (photo_url) =>
    set((state) => ({
      post: { ...state.post, photo_url }
    })),
  updatePostId: (id) =>
    set(() => ({
      postId: id
    })),
  resetStore: () =>
    set(() => ({
      postId: null,
      post: {
        title: '',
        body: DEFAULT_BODY,
        slug: '',
        photo_url: '',
        tags: []
      }
    })),
  error: false,
  total: 0
}))