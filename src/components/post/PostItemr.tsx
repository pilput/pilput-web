import WordLimit from "../word/WordLimit";
import { mainbaseurl } from "@/utils/getCofig";
import Link from "next/link";

const PostItemr = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  return (
    <div className="max-w-md border mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden w-full m-3 h-64">
      <div className="p-8">
        <Link
          href={`/blogs/` + post.slug}
          className="block mt-1 text-lg leading-tight font-medium text-black dark:text-gray-200 text-pretty hover:underline"
        >
          {post.title}
        </Link>
        <div className="mt-2 text-gray-500 overflow-auto">
          <WordLimit text={plaintext} limit={20} />
        </div>
      </div>
    </div>
  );
};

export default PostItemr;
