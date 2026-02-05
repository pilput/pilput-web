"use client";

// import PostsChart from "@/components/dashboard/PostChart";
import LikeChart from "@/components/dashboard/likeChat";
import UserChart from "@/components/dashboard/UserChart";
import UserDemographicsChart from "@/components/dashboard/UserDemographicsChart";
import EngagementChart from "@/components/dashboard/EngagementChart";
import MonthlyHoldingsChart from "@/components/dashboard/holdings/MonthlyHoldingsChart";
import { authStore } from "@/stores/userStore";

function Page() {
  const isSuperAdmin = authStore((state) => state.data.is_super_admin);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Row */}
      <div>
        <UserChart />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UserDemographicsChart />
        <LikeChart />
      </div>

      {/* Third Row - Engagement (Super Admin Only) */}
      {isSuperAdmin && (
        <div>
          <EngagementChart />
        </div>
      )}

      {/* Fourth Row - Monthly Holdings */}
      <div>
        <MonthlyHoldingsChart />
      </div>
    </div>
  );
}

export default Page;
