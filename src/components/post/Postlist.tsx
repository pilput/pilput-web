import Link from "next/link";
import { Button } from "@/components/ui/button";
import WordLimit from "@/components/word/WordLimit";
import Image from "next/image";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import Days from 'dayjs'

const Postlist = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  return (
    <div className="w-full mt-4 px-5 py-5 bg-gray-50 dark:bg-slate-800 border text-gray-600 shadow-md rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <div>
          {post.creator?.image && (
            <a href={`/${post.creator.username}`} >
              <img
                className="rounded-full object-cover h-7 w-7 hover:ring-2 ring-blue-500"
                src={getProfilePicture(post.creator?.image)}
                width={50}
                height={50}
                loading="lazy"
                alt={post.creator?.first_name}
              />
            </a>
          )}
        </div>
        <div className="font-bold">
          {post.creator?.first_name} {post.creator?.last_name}
        </div>
        <div>{Days(post.created_at).format("DD MMM YYYY")}</div>
      </div>
      <div className="flex gap-3">
        {post.photo_url && (
          <Image
            className="object-cover"
            src={getUrlImage(post.photo_url)}
            alt={post.title}
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
        </div>
      </div>
    </div>
  );
};

export default Postlist;
