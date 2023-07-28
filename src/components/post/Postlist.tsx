import Link from "next/link";
import { Button } from "@/components/ui/button";
import WordLimit from "@/components/word/WordLimit";

interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
}
interface PostlistProps {
  post: Post;
}

const Postlist: React.FC<PostlistProps> = ({ post }) => {
  return (
    <div className="w-full mt-4 px-5 py-5 bg-gray-50 border text-gray-600 shadow-md rounded-lg">
      <div className="">
        <h2 className="font-bold capitalize">{post.title}</h2>
        <p>
          <WordLimit text={post.body} limit={50} />
        </p>
        <div className="flex justify-end">
          <Link href={"/blogs/" + post.slug} className="btn">
            <Button>Read More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Postlist;
