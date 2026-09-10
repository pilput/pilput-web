import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getToken, RemoveToken } from "@/utils/Auth";
import { apiClient, isHttpError } from "@/utils/fetch";
import type { Tags } from "@/types/post";
import type {
  EngagementMetrics,
  OverviewReportResponse,
  OverviewStats,
  PostReport,
  UserReport,
} from "@/types/report";
import { defaultEndDate, defaultStartDate } from "../utils";

const USERS_LIMIT = 10;
const POSTS_LIMIT = 10;

export function useReportsData() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [tagId, setTagId] = useState<string>("all");
  const [tags, setTags] = useState<Tags[]>([]);

  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [postReport, setPostReport] = useState<PostReport | null>(null);

  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
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
    setIsLoadingOverview(true);
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
        const [overviewRes, engagementRes, usersRes] = await Promise.allSettled([
          apiClient.get<{ success: boolean; data: OverviewReportResponse }>("/api/reports/overview", {
            params: { startDate, endDate },
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          apiClient.get<{ success: boolean; data: EngagementMetrics }>("/api/reports/engagement", {
            params: { startDate, endDate },
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          apiClient.get<{ success: boolean; data: UserReport }>("/api/reports/users", {
            params: { startDate, endDate, limit: USERS_LIMIT },
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        if (ignore) return;

        if (overviewRes.status === "fulfilled" && overviewRes.value.data?.data?.overview) {
          setOverview(overviewRes.value.data.data.overview);
        } else if (overviewRes.status === "rejected") {
          if (!handleAuthError(overviewRes.reason)) {
            toast.error("Failed to load overview report");
          }
        }

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
          setIsLoadingOverview(false);
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
        const { data } = await apiClient.get<{ success: boolean; data: PostReport }>(
          "/api/reports/posts",
          {
            params: {
              startDate,
              endDate,
              limit: POSTS_LIMIT,
              tagId: tagId !== "all" ? tagId : undefined,
            },
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        if (!ignore) {
          if (data?.data) {
            setPostReport(data.data);
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
