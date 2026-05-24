import { create } from "zustand";
import { getToken, RemoveToken } from "@/utils/Auth";
import { apiClientApp, isHttpError } from "@/utils/fetch";
import { toast } from "sonner";
import type {
  Holding,
  HoldingType,
  HoldingSummaryResponse,
  CreateHoldingPayload,
  UpdateHoldingPayload,
} from "@/types/holding";
import {
  duplicateHoldingSchema,
  type DuplicateHoldingPayload,
} from "@/lib/validation";

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

interface HoldingsState {
  holdings: Holding[];
  holdingTypes: HoldingType[];
  summary: HoldingSummaryResponse | null;
  isLoading: boolean;
  isSummaryLoading: boolean;
  isSyncing: boolean;
  expandedRows: Set<number>;
  selectedMonth: number;
  selectedYear: number;
  orderBy: string;
  orderDir: "asc" | "desc";

  fetchHoldings: (params?: {
    month?: number;
    year?: number;
    orderBy?: string;
    orderDir?: "asc" | "desc";
  }) => Promise<void>;
  fetchSummary: (params?: { month?: number; year?: number }) => Promise<void>;
  fetchHoldingTypes: () => Promise<void>;
  fetchHoldingById: (id: number) => Promise<Holding | null>;
  syncHoldings: () => Promise<void>;
  addHolding: (payload: CreateHoldingPayload) => Promise<void>;
  updateHolding: (id: number, payload: UpdateHoldingPayload) => Promise<void>;
  deleteHolding: (id: number) => Promise<void>;
  duplicateHoldings: (payload: DuplicateHoldingPayload) => Promise<void>;
  toggleExpand: (id: number) => void;
  clearExpandedRows: () => void;
}

export const useHoldingsStore = create<HoldingsState>((set, get) => ({
  holdings: [],
  holdingTypes: [],
  summary: null,
  isLoading: false,
  isSummaryLoading: false,
  isSyncing: false,
  expandedRows: new Set(),
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  orderBy: "created_at",
  orderDir: "desc",

  fetchHoldings: async (params) => {
    const now = new Date();
    const month = params?.month ?? get().selectedMonth ?? now.getMonth() + 1;
    const year = params?.year ?? get().selectedYear ?? now.getFullYear();
    const orderBy = params?.orderBy ?? get().orderBy;
    const orderDir = params?.orderDir ?? get().orderDir;

    set({ isLoading: true });
    try {
      set({
        selectedMonth: month,
        selectedYear: year,
        orderBy,
        orderDir,
      });

      const { data } = await apiClientApp.get("/api/holdings", {
        headers: authHeaders(),
        params: {
          month,
          year,
          sortBy: orderBy,
          order: orderDir,
        },
      });

      const holdings = unwrapEnvelope<Holding[]>(data);
      if (holdings) {
        set({ holdings });
      } else {
        toast.error("Cannot connect to server");
      }

      await get().fetchSummary({ month, year });
    } catch (error) {
      if (isHttpError(error) && error.response?.status === 401) {
        RemoveToken();
        window.location.href = "/login";
      }
      toast.error("Cannot connect to server");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSummary: async (params) => {
    const now = new Date();
    const month = params?.month ?? get().selectedMonth ?? now.getMonth() + 1;
    const year = params?.year ?? get().selectedYear ?? now.getFullYear();

    set({ isSummaryLoading: true });
    try {
      const { data } = await apiClientApp.get("/api/holdings/summary", {
        headers: authHeaders(),
        params: { month, year },
      });

      const summary = unwrapEnvelope<HoldingSummaryResponse>(data);
      if (summary) {
        set({ summary });
      }
    } catch (error) {
      if (isHttpError(error) && error.response?.status === 401) {
        RemoveToken();
        window.location.href = "/login";
      }
      console.error("Failed to fetch holdings summary", error);
    } finally {
      set({ isSummaryLoading: false });
    }
  },

  fetchHoldingTypes: async () => {
    try {
      const { data } = await apiClientApp.get("/api/holding-types", {
        headers: authHeaders(),
      });

      const types = unwrapEnvelope<HoldingType[]>(data);
      if (types) {
        set({ holdingTypes: types });
      }
    } catch (error) {
      console.error("Failed to fetch holding types", error);
    }
  },

  fetchHoldingById: async (id) => {
    try {
      const { data } = await apiClientApp.get(`/api/holdings/${id}`, {
        headers: authHeaders(),
      });

      const holdings = unwrapEnvelope<Holding[]>(data);
      return holdings?.[0] ?? null;
    } catch (error) {
      if (isHttpError(error) && error.response?.status === 401) {
        RemoveToken();
        window.location.href = "/login";
      }
      return null;
    }
  },

  syncHoldings: async () => {
    const toastId = toast.loading("Syncing prices...");
    set({ isSyncing: true });
    try {
      const { data: body } = await apiClientApp.post<
        ApiEnvelope<{ syncedCount: number; month: number; year: number }>
      >("/api/holdings/sync", {}, { headers: authHeaders() });

      const payload = unwrapEnvelope<{
        syncedCount: number;
        month: number;
        year: number;
      }>(body);
      if (!payload) {
        toast.error(
          (body as ApiEnvelope<unknown>).message ?? "Failed to sync prices",
          { id: toastId },
        );
        return;
      }

      const { syncedCount, month, year } = payload;
      if (syncedCount === 0) {
        toast.success(
          "No holdings with symbols to sync for the current month",
          { id: toastId },
        );
      } else {
        toast.success(
          `Synced ${syncedCount} holding price(s) (${year}-${String(month).padStart(2, "0")})`,
          { id: toastId },
        );
      }

      await get().fetchHoldings();
    } catch (error) {
      if (isHttpError(error) && error.response?.status === 401) {
        RemoveToken();
        window.location.href = "/login";
      }
      toast.error("Failed to sync prices", { id: toastId });
      throw error;
    } finally {
      set({ isSyncing: false });
    }
  },

  addHolding: async (payload) => {
    const toastId = toast.loading("Creating...");
    try {
      await apiClientApp.post("/api/holdings", payload, {
        headers: authHeaders(),
      });
      toast.success("Holding created", { id: toastId });
      await get().fetchHoldings();
    } catch (error) {
      toast.error("Failed to save holding", { id: toastId });
      throw error;
    }
  },

  updateHolding: async (id, payload) => {
    const toastId = toast.loading("Updating...");
    try {
      await apiClientApp.put(`/api/holdings/${id}`, payload, {
        headers: authHeaders(),
      });
      toast.success("Holding updated", { id: toastId });
      await get().fetchHoldings();
    } catch (error) {
      toast.error("Failed to save holding", { id: toastId });
      throw error;
    }
  },

  deleteHolding: async (id) => {
    const toastId = toast.loading("Deleting...");
    try {
      await apiClientApp.delete(`/api/holdings/${id}`, {
        headers: authHeaders(),
      });
      toast.success("Holding deleted", { id: toastId });
      await get().fetchHoldings();
    } catch (error) {
      toast.error("Failed to delete holding", { id: toastId });
      throw error;
    }
  },

  duplicateHoldings: async (payload) => {
    const toastId = toast.loading("Duplicating...");
    try {
      const validatedPayload = duplicateHoldingSchema.parse(payload);
      await apiClientApp.post("/api/holdings/duplicate", validatedPayload, {
        headers: authHeaders(),
      });
      toast.success("Holdings duplicated", { id: toastId });
      await get().fetchHoldings();
    } catch (error) {
      toast.error("Failed to duplicate holdings", { id: toastId });
      throw error;
    }
  },

  toggleExpand: (id) => {
    set((state) => {
      const newSet = new Set(state.expandedRows);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { expandedRows: newSet };
    });
  },

  clearExpandedRows: () => {
    set({ expandedRows: new Set() });
  },
}));
