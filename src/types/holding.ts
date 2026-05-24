export interface HoldingType {
  id: number;
  code: string;
  name: string;
  notes?: string | null;
}

export interface Holding {
  id: number;
  user_id: string;
  name: string;
  symbol?: string | null;
  platform: string;
  holding_type_id: number;
  holding_type?: HoldingType | null;
  currency: string;
  invested_amount: string;
  current_value: string;
  gain_amount?: string;
  gain_percent?: string;
  units?: string | null;
  avg_buy_price?: string | null;
  current_price?: string | null;
  last_updated?: string | null;
  notes?: string | null;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface HoldingSummaryResponse {
  totalInvested: string;
  totalCurrentValue: string;
  totalProfitLoss: string;
  totalProfitLossPercentage: string;
  holdingsCount: number;
  typeBreakdown: HoldingBreakdownItem[];
  platformBreakdown: HoldingBreakdownItem[];
}

export interface HoldingBreakdownItem {
  name: string;
  invested: string | number;
  current: string | number;
  profitLoss: string | number;
  profitLossPercentage: string | number;
}

export interface HoldingTrendResponse {
  date: string;
  invested: string;
  current: string;
  profitLoss: string;
  profitLossPercentage: string;
}

export interface HoldingMonthlyDataResponse {
  month: number;
  year: number;
  date?: string;
  totalCurrentValue: string | number;
  totalInvested: string | number;
  holdingsCount: number;
}

export interface DuplicateResultItem {
  id: number;
  name: string;
  month: number;
  year: number;
}

export interface CreateHoldingPayload {
  name: string;
  platform: string;
  holding_type_id: number;
  currency: string;
  invested_amount: string;
  current_value: string;
  month: number;
  year: number;
  symbol?: string | null;
  units?: string | null;
  avg_buy_price?: string | null;
  current_price?: string | null;
  last_updated?: string | null;
  notes?: string | null;
}

export type UpdateHoldingPayload = Partial<CreateHoldingPayload>;

export function parseDecimal(value: string | number | undefined | null): number {
  if (value == null || value === "") return 0;
  return typeof value === "number" ? value : parseFloat(value);
}
