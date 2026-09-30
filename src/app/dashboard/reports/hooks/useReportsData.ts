import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getToken, RemoveToken } from "@/utils/Auth";
import { apiClient, isHttpError } from "@/utils/fetch";
import type { Tags } from "@/types/post";
import type {
  EngagementMetrics,
  OverviewStats,
  PostReport,
  PostStats,
  TagPerformance,
  UserReport,
} from "@/types/report";
import { defaultEndDate, defaultStartDate } from "../utils";

const USERS_LIMIT = 10;
const POSTS_LIMIT = 10;
const TAGS_LIMIT = 10;

export function useReportsData() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [tagId, setTagId] = useState<string>("all");
  const [tags, setTags] = useState<Tags[]>([]);

  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [postReport, setPostReport] = useState<PostReport | null>(null);

  const [isLoadingEngagement, setIsLoadingEngagement] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const handleAuthError = useCallback((error: unknown): boolean => {
    if (isHttpError(error)) {
      if (error.response?.status === 401) {
        RemoveToken();
        router.push("/login");
        return true;
      }
      if (error.response?.status === 403) {
        router.push("/forbidden");
        return true;
      }
    }
    return false;
  }, [router]);

  const setAllLoading = useCallback(() => {
    setIsLoadingEngagement(true);
    setIsLoadingUsers(true);
    setIsLoadingPosts(true);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadTags() {
      try {
        const { data: response } = await apiClient.get<{ data?: Tags[] }>("/api/tags");
        if (!ignore && response?.data) {
          setTags(response.data);
        }
      } catch {
        // Tag filter is a nice-to-have; silently ignore failures.
      }
    }
    loadTags();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadReports() {
      try {
        const [engagementRes, usersRes] = await Promise.allSettled([
          apiClient.get<{ success: boolean; data: EngagementMetrics }>("/api/posts/stats/engagement", {
            params: { startDate, endDate },
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          apiClient.get<{ success: boolean; data: UserReport }>("/api/users/stats", {
            params: { startDate, endDate, limit: USERS_LIMIT },
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        if (ignore) return;

        if (engagementRes.status === "fulfilled" && engagementRes.value.data?.data) {
          setEngagement(engagementRes.value.data.data);
        } else if (engagementRes.status === "rejected") {
          if (!handleAuthError(engagementRes.reason)) {
            toast.error("Failed to load engagement metrics");
          }
        }

        if (usersRes.status === "fulfilled" && usersRes.value.data?.data) {
          setUserReport(usersRes.value.data.data);
        } else if (usersRes.status === "rejected") {
          if (!handleAuthError(usersRes.reason)) {
            toast.error("Failed to load user report");
          }
        }
      } finally {
        if (!ignore) {
          setIsLoadingEngagement(false);
          setIsLoadingUsers(false);
        }
      }
    }

    loadReports();

    return () => {
      ignore = true;
    };
  }, [startDate, endDate, handleAuthError]);

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      try {
        const headers = { Authorization: `Bearer ${getToken()}` };
        const [{ data }, tagRes] = await Promise.all([
          apiClient.get<{ success: boolean; data: PostStats }>("/api/posts/stats", {
            params: {
              startDate,
              endDate,
              limit: POSTS_LIMIT,
              tagId: tagId !== "all" ? tagId : undefined,
            },
            headers,
          }),
          // The tag breakdown is decorative; a failure must not blank the posts section.
          apiClient
            .get<{ success: boolean; data: TagPerformance[] }>("/api/tags/stats", {
              params: { limit: TAGS_LIMIT },
              headers,
            })
            .catch(() => null),
        ]);
        if (!ignore) {
          if (data?.data) {
            setPostReport({ ...data.data, tagPerformance: tagRes?.data?.data ?? [] });
          } else {
            toast.error("Cannot connect to server");
          }
        }
      } catch (error) {
        if (!ignore) {
          if (!handleAuthError(error)) {
            toast.error("Failed to load post report");
          }
        }
      } finally {
        if (!ignore) {
          setIsLoadingPosts(false);
        }
      }
    }

    loadPosts();

    return () => {
      ignore = true;
    };
  }, [startDate, endDate, tagId, handleAuthError]);

  const overview = useMemo<OverviewStats | null>(() => {
    if (!userReport || !postReport) return null;
    return {
      totalUsers: userReport.totalUsers,
      totalPosts: postReport.totalPosts,
      totalViews: postReport.totalViews,
      totalLikes: postReport.totalLikes,
      totalComments: postReport.totalComments,
      newUsersToday: userReport.newUsersToday,
      newPostsToday: postReport.newPostsToday,
      activeUsersThisWeek: userReport.activeUsersThisWeek,
    };
  }, [userReport, postReport]);
  const isLoadingOverview = isLoadingUsers || isLoadingPosts;

  function resetDateRange() {
    setAllLoading();
    setStartDate(defaultStartDate());
    setEndDate(defaultEndDate());
  }

  return {
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
    setStartDate: (value: string) => {
      setAllLoading();
      setStartDate(value);
    },
    setEndDate: (value: string) => {
      setAllLoading();
      setEndDate(value);
    },
    setTagId: (value: string) => {
      setIsLoadingPosts(true);
      setTagId(value);
    },
    resetDateRange,
  };
}

export type ReportsData = ReturnType<typeof useReportsData>;
