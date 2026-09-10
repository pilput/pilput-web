"use client";

import { useReportsData } from "./hooks/useReportsData";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { OverviewStatsGrid } from "./components/OverviewStatsGrid";
import { EngagementSection } from "./components/EngagementSection";
import { TopUsersSection } from "./components/TopUsersSection";
import { TopPostsSection } from "./components/TopPostsSection";

export default function ReportsPage() {
  const {
    startDate,
    endDate,
    tagId,
    tags,
    overview,
    engagement,
    userReport,
    postReport,
    isLoadingOverview,
    isLoadingEngagement,
    isLoadingUsers,
    isLoadingPosts,
    setStartDate,
    setEndDate,
    setTagId,
    resetDateRange,
  } = useReportsData();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Platform-wide statistics on users, content, and engagement.
          </p>
        </div>
      </div>

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReset={resetDateRange}
      />

      <OverviewStatsGrid overview={overview} isLoading={isLoadingOverview} />

      <EngagementSection engagement={engagement} isLoading={isLoadingEngagement} />

      <TopUsersSection userReport={userReport} isLoading={isLoadingUsers} />

      <TopPostsSection
        postReport={postReport}
        tags={tags}
        tagId={tagId}
        isLoading={isLoadingPosts}
        onTagIdChange={setTagId}
      />
    </div>
  );
}
