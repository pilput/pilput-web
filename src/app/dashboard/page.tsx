// import PostsChart from "@/components/dashboard/PostChart";
import LikeChart from "@/components/dashboard/likeChat";
import UserChart from "@/components/dashboard/UserChart";
import UserDemographicsChart from "@/components/dashboard/UserDemographicsChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import EngagementChart from "@/components/dashboard/EngagementChart";
import MonthlyHoldingsChart from "@/components/dashboard/holdings/MonthlyHoldingsChart";

function page() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UserChart />
        <RevenueChart />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UserDemographicsChart />
        <PerformanceChart />
        <LikeChart />
      </div>

      {/* Third Row - Engagement */}
      <div>
        <EngagementChart />
      </div>

      {/* Fourth Row - Monthly Holdings */}
      <div>
        <MonthlyHoldingsChart />
      </div>
    </div>
  );
}

export default page;
