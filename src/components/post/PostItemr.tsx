import Image from "next/image";
interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  creator: any;
}

const PostItemr = ({ post }: { post: Post }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <Image width={200} height={200}
            className="h-48 w-full object-cover md:w-48"
            src="/#"
            alt="Post"
          />
        </div>
        <div className="p-8">
          <a
            href="#"
            className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
          >
            {post.title}
          </a>
          <p className="mt-2 text-gray-500">Ringkasan postingan...</p>
        </div>
      </div>
    </div>
  );
};

export default PostItemr;
