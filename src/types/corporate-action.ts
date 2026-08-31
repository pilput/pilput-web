export type CorporateActionType = "dividend" | "rups";

export interface CorporateActionItem {
  symbol: string;
  name: string;
  type: CorporateActionType;
  /** Ex-date for dividends, meeting date for RUPS (YYYY-MM-DD) */
  date: string;
  /** Cum-date: last trading date still entitled to the dividend (YYYY-MM-DD) */
  cum_date: string | null;
  /** Recording date used to determine the shareholder register (YYYY-MM-DD) */
  rec_date: string | null;
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
