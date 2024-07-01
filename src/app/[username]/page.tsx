import Navigation from "@/components/header/Navbar";
import { axiosIntence } from "@/utils/fetch";
import { notFound } from "next/navigation";


const getuser = async (postSlug: string): Promise<Post> => {
  try {
    const { data } = await axiosIntence(`/api/v2/posts/${postSlug}`);
    return data;
  } catch {
    throw notFound();
  }
};
function page({ params }: { params: { username: string } }) {
  return (
    <>
      <Navigation />
      <div className="mx-auto max-w-7xl min-h-screen">
        <div className="text-center">
          {params.username}
        </div>

      </div>
    </>
  );
}

export default page;
