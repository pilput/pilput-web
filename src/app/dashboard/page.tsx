import PostsChart from "@/components/dashboard/PostChart"
import LikeChart from "@/components/dashboard/likeChat"

function page() {
  return (
    <div className="flex gap-4">
        <PostsChart />
        <LikeChart />
    </div>
  )
}

export default page