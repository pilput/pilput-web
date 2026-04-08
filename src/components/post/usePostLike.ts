"use client";

import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import { toast } from "sonner";
import { getToken } from "@/utils/Auth";
import { togglePostLike } from "@/utils/fetch";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";

export function normalizeLikeCount(value: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export function usePostLike(
  postId: string,
  initialLiked: boolean,
  initialCount: number,
) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(() =>
    normalizeLikeCount(initialCount),
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked, postId]);

  useEffect(() => {
    setCount(normalizeLikeCount(initialCount));
  }, [initialCount, postId]);

  const onToggle = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!getToken()) {
        toast.error("Sign in to like posts.");
        return;
      }

      setBusy(true);
      const wasLiked = liked;
      try {
        const { liked: nextLiked } = await togglePostLike(postId);
        setLiked(nextLiked);
        setCount((c) => {
          if (nextLiked && !wasLiked) return c + 1;
          if (!nextLiked && wasLiked) return Math.max(0, c - 1);
          return c;
        });
      } catch (error) {
        ErrorHandlerAPI(error);
      } finally {
        setBusy(false);
      }
    },
    [liked, postId],
  );

  return { liked, count, busy, onToggle };
}
