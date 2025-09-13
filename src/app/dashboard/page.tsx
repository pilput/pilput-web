// import PostsChart from "@/components/dashboard/PostChart";
import LikeChart from "@/components/dashboard/likeChat";
import UserChart from "@/components/dashboard/UserChart";
import UserDemographicsChart from "@/components/dashboard/UserDemographicsChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import EngagementChart from "@/components/dashboard/EngagementChart";

function page() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Row - Full Width Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UserChart />
        <RevenueChart />
      </div>

      {/* Second Row - Mixed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UserDemographicsChart />
        <PerformanceChart />
        <LikeChart />
      </div>

      {/* Third Row - Full Width Chart */}
      <div>
        <EngagementChart />
      </div>
    </div>
  );
}

export default page;
