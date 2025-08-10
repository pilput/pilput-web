import WordLimit from "../word/WordLimit";
import Link from "next/link";
import type { Post } from "@/types/post";

const PostItemr = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg dark:bg-slate-800/90 w-full m-2 h-64">
      <div className="flex h-full flex-col justify-between p-6">
        <div className="space-y-4">
          <Link
            href={`/${post.creator.username}/${post.slug}`}
            className="inline-block"
          >
            <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h3>
          </Link>
          <div className="text-sm text-muted-foreground line-clamp-3">
            <WordLimit text={plaintext} limit={20} />
          </div>
        </div>
        
        <div className="pt-4 flex items-center text-sm text-muted-foreground">
          <div className="flex items-center">
            <span className="text-xs">By {post.creator.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItemr;
