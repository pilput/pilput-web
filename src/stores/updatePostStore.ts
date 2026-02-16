import type { Post, PostCreate } from '@/types/post'
import { create } from 'zustand'
import { axiosInstance2 } from '@/utils/fetch'
import { getToken } from '@/utils/Auth'

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
  loading: boolean
  updateTitle: (title: string) => void
  updateBody: (body: string) => void
  updateSlug: (slug: string) => void
  updatePhotoUrl: (photoUrl: string) => void
  updatePostId: (id: string) => void
  fetchPostById: (id: string) => Promise<Post | null>
  resetStore: () => void
  error: boolean
  total: number
}

export const updatePostStore = create<UpdatePostState>()((set, get) => ({
  postId: null,
  post: {
    title: '',
    body: DEFAULT_BODY,
    slug: '',
    photo_url: '',
    tags: []
  },
  loading: false,
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
  fetchPostById: async (id: string) => {
    const token = getToken()
    set(() => ({ loading: true, error: false }))
    try {
      const response = await axiosInstance2.get(`/v1/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const postData = response.data.data
      
      set(() => ({
        postId: postData.id,
        post: {
          title: postData.title,
          body: postData.body,
          slug: postData.slug,
          photo_url: postData.photo_url,
          tags: postData.tags || []
        },
        loading: false
      }))
      
      return postData
    } catch (error) {
      console.error('Error fetching post:', error)
      set(() => ({ loading: false, error: true }))
      return null
    }
  },
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