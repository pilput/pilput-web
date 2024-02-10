import Link from "next/link";
import { Button } from "@/components/ui/button";
import WordLimit from "@/components/word/WordLimit";
import Image from "next/image";
import { storagebaseurl } from "@/utils/getCofig";

interface PostlistProps {
  post: Post;
}

const Postlist: React.FC<PostlistProps> = ({ post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, "");
  return (
    <div className="w-full mt-4 px-5 py-5 bg-gray-50 border text-gray-600 shadow-md rounded-lg ">
      <div className="flex gap-3">
        {post.photo_url && (
          <Image
            className="object-cover"
            src={storagebaseurl + post.photo_url}
            alt=""
            width={150}
            height={150}
          />
        )}
        <div className="flex-grow">
          <Link href={"/blogs/" + post.slug}>
            <Button variant={"link"} className="font-bold capitalize text-xl">
              {post.title}
            </Button>
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
    </div>
  );
};

export default Postlist;
