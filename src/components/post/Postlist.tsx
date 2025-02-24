import Link from "next/link";
import { Button } from "@/components/ui/button";
import WordLimit from "@/components/word/WordLimit";
import Image from "next/image";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { format } from "date-fns";

const Postlist = ({ post }: { post: Post }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  return (
    <div className="group mt-4 p-6 bg-card hover:bg-accent/10 transition-colors duration-200 border rounded-xl dark:border-gray-800 dark:bg-slate-800/90 shadow-sm hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div>
          {post.creator?.image && (
            <Link href={`/${post.creator.username}`}>
              <img
                className="rounded-full object-cover h-10 w-10 ring-2 ring-background hover:ring-primary transition-all duration-200"
                src={getProfilePicture(post.creator?.image)}
                width={50}
                height={50}
                loading="lazy"
                alt={post.creator?.first_name}
              />
            </Link>
          )}
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-foreground hover:text-primary transition-colors">
            {post.creator?.first_name} {post.creator?.last_name}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(post.created_at, "dd MMM yyyy")}
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        {post.photo_url && (
          <div className="flex-shrink-0">
            <Image
              className="object-cover rounded-lg w-[200px] h-[150px] hover:opacity-90 transition-opacity"
              src={getUrlImage(post.photo_url)}
              alt={post.title}
              width={200}
              height={150}
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Link href={`/${post.creator.username}/${post.slug}`} className="group/title">
            <h2 className="font-bold capitalize text-xl text-foreground group-hover/title:text-primary transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted-foreground leading-relaxed">
            <WordLimit text={plaintext} limit={50} />
          </p>
          <div className="mt-2">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 -ml-2">
              Read more →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Postlist;
