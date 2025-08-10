import { PostCreate } from '@/types/post'
import { create } from 'zustand'

interface PostsState {
    post: PostCreate
    updatetitle: (title: string) => void
    updatebody: (body: string) => void
    updateSlug: (slug: string) => void
    updatePhoto_url: (photo_url: string) => void
    error: boolean
    total: number;
}

export const postsStore = create<PostsState>()((set) => ({
    post: {
        title: '', body: `
    <h3>
      Hi there,
    </h3>
    <p>
      this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    </p>
    <pre><code class="language-css">body {
    display: none;
    }</code></pre>
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
    `, slug: '', photo_url: "", tags: []
    },
    updatetitle: (title: string) => set((state) => ({ post: { ...state.post, title } })),
    updatebody: (body: string) => set((state) => ({ post: { ...state.post, body } })),
    updateSlug: (slug: string) => set((state) => ({ post: { ...state.post, slug } })),
    updatePhoto_url :(photo_url: string) => set((state) => ({ post: { ...state.post, photo_url } })),
    error: false,
    total: 0
}))