import { create } from "zustand";
import { getToken, RemoveToken } from "@/utils/Auth";
import { apiClientApp, isHttpError } from "@/utils/fetch";
import { toast } from "sonner";
import type { Holding, HoldingType } from "@/types/holding";
import {
  duplicateHoldingSchema,
  type DuplicateHoldingPayload,
} from "@/lib/validation";

interface HoldingsState {
  holdings: Holding[];
  holdingTypes: HoldingType[];
  isLoading: boolean;
  isSyncing: boolean;
  expandedRows: Set<bigint>;
  selectedMonth: number;
  selectedYear: number;
  orderBy: string;
  orderDir: "asc" | "desc";

  // Actions
  fetchHoldings: (params?: {
    month?: number;
    year?: number;
    orderBy?: string;
    orderDir?: "asc" | "desc";
  }) => Promise<void>;
  fetchHoldingTypes: () => Promise<void>;
  syncHoldings: () => Promise<void>;
  addHolding: (payload: any) => Promise<void>;
  updateHolding: (id: bigint, payload: any) => Promise<void>;
  deleteHolding: (id: bigint) => Promise<void>;
  duplicateHoldings: (payload: DuplicateHoldingPayload) => Promise<void>;
  toggleExpand: (id: bigint) => void;
  clearExpandedRows: () => void;
}

export const useHoldingsStore = create<HoldingsState>((set, get) => ({
  holdings: [],
  holdingTypes: [],
  isLoading: false,
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
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: {
          month,
          year,
          sortBy: orderBy,
          order: orderDir,
        },
      });
      const response = data as {
        data: Holding[];
        success: boolean;
        metadata: { totalItems: number };
      };
      if (response.success) {
        set({ holdings: response.data });
      } else {
        toast.error("Cannot connect to server");
      }
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

  fetchHoldingTypes: async () => {
    try {
      const { data } = await apiClientApp.get("/api/holding-types", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const response = data as {
        data: HoldingType[];
        success: boolean;
      };

      if (response.success) {
        set({ holdingTypes: response.data });
      }
    } catch (error) {
      console.error("Failed to fetch holding types", error);
    }
  },

  syncHoldings: async () => {
    const toastId = toast.loading("Syncing prices...");
    set({ isSyncing: true });
    try {
      const { data: body } = await apiClientApp.post<{
        success: boolean;
        data:
          | { syncedCount: number; month: number; year: number }
          | unknown[];
        message?: string;
      }>(
        "/api/holdings/sync",
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!body.success) {
        toast.error(body.message ?? "Failed to sync prices", { id: toastId });
        return;
      }

      const payload = body.data;
      if (
        payload &&
        typeof payload === "object" &&
        !Array.isArray(payload) &&
        "syncedCount" in payload
      ) {
        const { syncedCount, month, year } = payload as {
          syncedCount: number;
          month: number;
          year: number;
        };
        if (syncedCount === 0) {
          toast.success(
            body.message ??
              "No holdings with symbols to sync for the current month",
            { id: toastId }
          );
        } else {
          toast.success(
            `Synced ${syncedCount} holding price(s) (${year}-${String(month).padStart(2, "0")})`,
            { id: toastId }
          );
        }
      } else {
        toast.success(body.message ?? "Prices synced", { id: toastId });
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
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success("Holding created", { id: toastId });

      // Refetch holdings after successful creation
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
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success("Holding updated", { id: toastId });

      // Refetch holdings after successful update
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
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success("Holding deleted", { id: toastId });

      // Refetch holdings after successful deletion
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
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success("Holdings duplicated", { id: toastId });

      // Refresh holdings to reflect the duplicated data
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

