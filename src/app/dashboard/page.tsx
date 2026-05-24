"use client";

import { useEffect } from "react";
import { format, subDays } from "date-fns";
import { authStore } from "@/stores/userStore";
import { useHoldingsStore } from "@/stores/holdingsStore";
import { postsStore } from "@/stores/posts-store";
import { formatCurrency } from "@/lib/utils";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Users, Heart, FileText, Wallet, BookOpen } from "lucide-react";

const LikeChart = dynamic(() => import("@/components/dashboard/LikeChart"), { ssr: false });
const PostViewsChart = dynamic(() => import("@/components/dashboard/PostViewsChart"), { ssr: false });
const TopPostsWidget = dynamic(() => import("@/components/dashboard/TopPostsWidget"), { ssr: false });
const MonthlyHoldingsChart = dynamic(() => import("@/components/dashboard/holdings/MonthlyHoldingsChart"), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

function Page() {
  const user = authStore((state) => state.data);
  const fetchHoldings = useHoldingsStore((state) => state.fetchHoldings);
  const holdingsSummary = useHoldingsStore((state) => state.summary);
  const fetchPosts = postsStore((state) => state.fetch);
  const fetchAnalytics = postsStore((state) => state.fetchAnalytics);
  const analytics = postsStore((state) => state.analytics);

  useEffect(() => {
    fetchHoldings();
    fetchPosts(1, 0);
    
    // Fetch last 30 days post analytics by default
    const endDate = format(new Date(), "yyyy-MM-dd");
    const startDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
    void fetchAnalytics(startDate, endDate);
  }, [fetchHoldings, fetchPosts, fetchAnalytics]);

  // Derive portfolio values
  const totalCurrentValue = holdingsSummary ? parseFloat(holdingsSummary.totalCurrentValue) : 0;
  const totalProfitLoss = holdingsSummary ? parseFloat(holdingsSummary.totalProfitLoss) : 0;
  const totalProfitLossPercentage = holdingsSummary ? parseFloat(holdingsSummary.totalProfitLossPercentage) : 0;

  // Derive analytics values
  const totalViews = analytics?.summary?.total_views ?? 0;
  const totalLikes = analytics?.summary?.total_likes ?? 0;
  const publishedPostsCount = analytics?.summary?.published_posts ?? 0;
  const totalPostsCount = analytics?.summary?.total_posts ?? 0;

  // Render metric cards
  const kpis = [
    {
      title: "Visitor Traffic",
      value: totalViews.toLocaleString(),
      helper: "Total article views",
      icon: Users,
      iconColor: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Social Feedback",
      value: totalLikes.toLocaleString(),
      helper: "Total article likes",
      icon: Heart,
      iconColor: "text-rose-500 bg-rose-500/10",
    },
    {
      title: "Active Content",
      value: `${publishedPostsCount} Posts`,
      helper: `${totalPostsCount} total posts written`,
      icon: FileText,
      iconColor: "text-indigo-500 bg-indigo-500/10",
    },
    {
      title: "Investment Net Worth",
      value: totalCurrentValue > 0 ? formatCurrency(totalCurrentValue, "IDR", { decimals: 0 }) : "Rp 0",
      helper: totalProfitLoss !== 0 ? (
        <span className={totalProfitLoss >= 0 ? "text-emerald-500 font-semibold" : "text-destructive font-semibold"}>
          {totalProfitLoss >= 0 ? "+" : ""}{totalProfitLossPercentage.toFixed(1)}% Return
        </span>
      ) : "No tracked holdings",
      icon: Wallet,
      iconColor: "text-emerald-500 bg-emerald-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Welcome Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-muted/40 p-6 shadow-sm border border-border/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            Welcome back, {user.first_name || user.username || "there"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Here&apos;s a performance overview of your publishing activity, user engagement, and investment portfolio.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={idx} variants={cardVariants}>
              <div className="relative overflow-hidden glass-card border-glow-hover shadow-premium hover:shadow-premium-hover rounded-2xl transition-all duration-300 group h-full flex flex-col justify-between p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    {kpi.title}
                  </span>
                  <div className={`p-2 rounded-xl ring-1 ring-border/40 ${kpi.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-4 w-4 shrink-0" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {kpi.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {kpi.helper}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PostViewsChart />
        </div>
        <div>
          <MonthlyHoldingsChart />
        </div>
      </div>

      {/* Secondary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopPostsWidget />
        </div>
        <div className="h-full">
          <LikeChart />
        </div>
      </div>
    </div>
  );
}

export default Page;
