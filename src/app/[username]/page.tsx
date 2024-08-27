import Navigation from "@/components/header/Navbar";
import { axiosIntence2 } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { notFound } from "next/navigation";

const getWriter = async (username: string): Promise<Writer> => {
  try {
    const { data } = await axiosIntence2(`/writers/${username}`);
    return data;
  } catch {
    throw notFound();
  }
};

export default async function page({
  params,
}: {
  params: { username: string };
}) {
  const writer = await getWriter(params.username);
  return (
    <>
      <Navigation />
      <div className="mx-auto max-w-7xl min-h-screen">
        <div className="my-10 bg-white rounded-lg shadow-md border p-5">
          <img
            className="w-32 h-32 rounded-full mx-auto"
            src={getUrlImage(writer.image)}
            alt="Profile picture"
          />
          <h2 className="text-center text-2xl font-semibold mt-3">
            {writer.first_name} {writer.last_name}
          </h2>
          <p className="text-center text-gray-600 mt-1">Software Engineer</p>
          <div className="flex justify-center mt-5">
            <a
              href={writer.profile.website}
              className="text-blue-500 hover:text-blue-700 mx-3"
            >
              {writer.profile.website}
            </a>
            <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">
              LinkedIn
            </a>
            <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">
              GitHub
            </a>
          </div>
          <div className="mt-5">
            <h3 className="text-xl font-semibold">Bio</h3>
            <p className="text-gray-600 mt-2">{writer.profile.bio}</p>
          </div>
        </div>
      </div>
    </>
  );
}
