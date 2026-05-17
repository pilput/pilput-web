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
      <div className="flex flex-col gap-1 border-b border-border/70 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          A quick view of publishing activity and platform performance.
        </p>
      </div>

      <div>
        <UserChart />
      </div>

      <div>
        <LikeChart />
      </div>

      {isSuperAdmin && (
        <div>
          <EngagementChart />
        </div>
      )}

      <div>
        <MonthlyHoldingsChart />
      </div>
    </div>
  );
}

export default Page;
