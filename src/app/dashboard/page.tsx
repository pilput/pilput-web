"use client";

import { authStore } from "@/stores/userStore";
import dynamic from "next/dynamic";

const LikeChart = dynamic(() => import("@/components/dashboard/LikeChart"), { ssr: false });
const UserChart = dynamic(() => import("@/components/dashboard/UserChart"), { ssr: false });
const EngagementChart = dynamic(() => import("@/components/dashboard/EngagementChart"), { ssr: false });
const MonthlyHoldingsChart = dynamic(() => import("@/components/dashboard/holdings/MonthlyHoldingsChart"), { ssr: false });

function Page() {
  const isSuperAdmin = authStore((state) => state.data.is_super_admin);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Top Row */}
      <div>
        <UserChart />
      </div>

      {/* Second Row */}
      <div>
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
