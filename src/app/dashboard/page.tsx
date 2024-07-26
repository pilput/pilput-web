// import PostsChart from "@/components/dashboard/PostChart";
import LikeChart from "@/components/dashboard/likeChat";
import UserChart from "@/components/dashboard/UserChart";

function page() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <UserChart />
      </div>
      <div className="flex gap-4">
        {/* <PostsChart /> */}
        <LikeChart />
      </div>
    </div>
  );
}

export default page;
