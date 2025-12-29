import { create } from "zustand";
import { getToken, RemoveToken } from "@/utils/Auth";
import { axiosInstence3 } from "@/utils/fetch";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { Holding, HoldingType } from "@/types/holding";
import {
  duplicateHoldingSchema,
  type DuplicateHoldingPayload,
} from "@/lib/validation";

interface HoldingsState {
  holdings: Holding[];
  holdingTypes: HoldingType[];
  isLoading: boolean;
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

      const { data } = await axiosInstence3.get("/v1/holdings", {
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
        console.log(response);
        toast.error("Cannot connect to server");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          RemoveToken();
          window.location.href = "/login";
        }
      }
      toast.error("Cannot connect to server");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHoldingTypes: async () => {
    try {
      const { data } = await axiosInstence3.get("/v1/holdings/types", {
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

  addHolding: async (payload) => {
    const toastId = toast.loading("Creating...");
    try {
      await axiosInstence3.post("/v1/holdings", payload, {
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
      await axiosInstence3.put(`/v1/holdings/${id}`, payload, {
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
      await axiosInstence3.delete(`/v1/holdings/${id}`, {
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
      await axiosInstence3.post("/v1/holdings/duplicate", validatedPayload, {
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
