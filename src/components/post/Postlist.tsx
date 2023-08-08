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
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, "");
  return (
    <div className="w-full mt-4 px-5 py-5 bg-gray-50 border text-gray-600 shadow-md rounded-lg">
      <div className="">
        <Link href={"/blogs/" + post.slug}>
          <Button variant={"link"} className="font-bold capitalize text-xl">{post.title}</Button>
        </Link>
        <p className="px-4">
          <WordLimit text={plaintext} limit={50} />
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
