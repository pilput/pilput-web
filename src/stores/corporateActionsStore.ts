import { create } from "zustand";
import { getToken, RemoveToken } from "@/utils/Auth";
import { apiClient, isHttpError } from "@/utils/fetch";
import { toast } from "sonner";
import type { CorporateActionItem, CorporateActionCalendarResponse } from "@/types/corporate-action";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

function unwrapEnvelope<T>(body: unknown): T | null {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    const envelope = body as ApiEnvelope<T>;
    return envelope.success ? envelope.data : null;
  }
  return null;
}

interface CorporateActionsState {
  actions: CorporateActionItem[];
  from: string | null;
  to: string | null;
  total: number;
  cached: boolean;
  isLoading: boolean;

  fetchCalendar: (params: { from: string; to: string }) => Promise<void>;
}

export const useCorporateActionsStore = create<CorporateActionsState>((set) => ({
  actions: [],
  from: null,
  to: null,
  total: 0,
  cached: false,
  isLoading: false,

  fetchCalendar: async ({ from, to }) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get("/api/holdings/calendar", {
        headers: authHeaders(),
        params: { from, to },
      });

      const payload = unwrapEnvelope<CorporateActionCalendarResponse>(data);
      if (payload) {
        set({
          actions: payload.actions,
          from: payload.from,
          to: payload.to,
          total: payload.total,
          cached: payload.cached,
        });
      } else {
        toast.error("Cannot connect to server");
      }
    } catch (error) {
      if (isHttpError(error) && error.response?.status === 401) {
        RemoveToken();
        window.location.href = "/login";
      }
      toast.error("Failed to load corporate actions calendar");
    } finally {
      set({ isLoading: false });
    }
  },
}));
