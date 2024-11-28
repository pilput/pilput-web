import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navbar";
import Comment from "@/components/post/Comment";
import { axiosInstence } from "@/utils/fetch";
import Image from "next/image";
import { notFound } from "next/navigation"; // Added import statement
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface succesResponse {
  data: Post;
  message: string;
  success: boolean;
}

const getPost = async (username: string, postSlug: string): Promise<Post> => {
  try {
    const { data } = await axiosInstence(`/v1/posts/u/${username}/${postSlug}`);
    const result = data as succesResponse;
    return result.data;
  } catch (error) {
    throw notFound();
  }
};

export default async function Page(
  props: {
    params: Promise<{ slug: string; username: string }>;
  }
) {
  const params = await props.params;
  const post = await getPost(params.username, params.slug);

  return (
    <>
      <Navigation />
      <div className="mx-auto p-3 pt-6 min-h-screen max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={getProfilePicture(post.creator.image)}
              alt={`@${post.creator.username}`}
            />
            <AvatarFallback>{post.creator.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-gray-700 dark:text-gray-300">
              {post.creator.first_name} {post.creator.last_name}
            </div>
            <a
              href={`/${post.creator.username}`}
              className="text-blue-600 font-semibold hover:underline"
            >
              @{post.creator.username}
            </a>
          </div>
        </div>

        <div className="border-b-2 mb-8">
          <h1 className="text-xl md:text-3xl lg:text-5xl text-gray-950 dark:text-gray-50 mx-auto my-6 font-bold">
            {post.title}
          </h1>
        </div>
        <div>
          {post.photo_url && (
            <Image
              className="mx-auto h-72 object-cover w-full"
              priority={false}
              src={getUrlImage(post.photo_url)}
              alt={post.title}
              width={400}
              height={400}
            />
          )}
        </div>
        <div className="mb-10 mt-4 md:my-10 mx-auto flex justify-center prose prose-sm sm:prose lg:prose-lg dark:prose-invert !max-w-none">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: post.body }}
          ></div>
        </div>
        {post.tags != null && (
          <div className="flex gap-2 flex-wrap mb-6">
            {post.tags.map((tag) => (
              <div
                key={tag.id}
                className="py-2 px-4 rounded-2xl bg-slate-200"
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
        <div></div>
        <Comment postId={post.id} />
      </div>
      <Footer />
    </>
  );
}
