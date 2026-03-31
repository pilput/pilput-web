"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/utils/fetch";

const DEFAULT_TAGS = [
  "ai",
  "nextjs",
  "typescript",
  "webdev",
  "react",
  "javascript",
];

export function useTrendingTags() {
  const [trendingTags, setTrendingTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await apiClient.get("/v1/tags");
        setTrendingTags(response.data.data.map((tag: { name: string }) => tag.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTrendingTags(DEFAULT_TAGS);
      }
    }

    fetchTags();
  }, []);

  return trendingTags;
}
