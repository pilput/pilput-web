import WordLimit from "../word/WordLimit";
import { mainbaseurl } from "@/utils/fetch";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  creator: any;
}

const PostItemr = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, "");
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden w-full m-3 h-64">
      <div className="md:flex">
        {/* <div className="md:flex-shrink-0">
          <Image width={200} height={200}
            className="h-48 w-full object-cover md:w-48"
            src="/#"
            alt="Post"
          />
        </div> */}
        <div className="p-8">
          <Link
            href={mainbaseurl+`/blogs/`+post.slug}
            className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
          >
            {post.title}
          </Link>
          <div className="mt-2 text-gray-500">
              <WordLimit text={plaintext} limit={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItemr;
