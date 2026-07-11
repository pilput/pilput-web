export type CorporateActionType = "dividend" | "rups";

export interface CorporateActionItem {
  symbol: string;
  name: string;
  type: CorporateActionType;
  /** Ex-date for dividends, meeting date for RUPS (YYYY-MM-DD) */
  date: string;
  pay_date: string | null;
  amount: number | null;
  currency: string;
  note: string;
  market: string;
}

export interface CorporateActionCalendarResponse {
  from: string;
  to: string;
  actions: CorporateActionItem[];
  total: number;
  cached: boolean;
}
