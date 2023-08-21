import { Skeleton } from "../ui/skeleton";

interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  creator: any;
}

const PostItemrPulse = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden w-full m-3 h-64">
      <div className="md:flex">
        <div className="p-8">
          <div>
            <div className="flex flex-row ">
              <Skeleton className="w-80 h-5" />
            </div>
            <div className="mt-2">
              <Skeleton className="w-44 h-5" />
            </div>
          </div>
          <div className="mt-8 text-gray-500 ">
            <div className="flex">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="ml-5 h-4 flex-grow" />
            </div>
            <div className="flex mt-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="ml-5 h-4 w-32" />
            </div>
            <div className="flex mt-3">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItemrPulse;
