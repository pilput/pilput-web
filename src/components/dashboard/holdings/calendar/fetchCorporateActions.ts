import { apiClient } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import type {
  CorporateActionCalendarResponse,
  CorporateActionItem,
} from "@/types/corporate-action";

export async function fetchCorporateActionsMonth(
  month: number,
  year: number,
): Promise<CorporateActionItem[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: CorporateActionCalendarResponse;
  }>("/api/holdings/calendar", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { month, year },
  });
  return data?.data?.actions ?? [];
}

/** Normalizes a ticker so "bbca", "BBCA" and "BBCA.JK" all match. */
export function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase().replace(/\.JK$/, "");
}
