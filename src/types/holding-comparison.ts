export interface MonthInfo {
  month: number;
  year: number;
}

export interface BreakdownItem {
  name: string;
  invested: number;
  current: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface MonthlySummary {
  totalInvested: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  typeBreakdown: BreakdownItem[];
  platformBreakdown: BreakdownItem[];
}

export interface ComparisonItem {
  name: string;
  to: BreakdownItem;
  from: BreakdownItem;
  investedDiff: number;
  currentValueDiff: number;
  investedDiffPercentage: number;
  currentValueDiffPercentage: number;
}

export interface ComparisonSummary {
  fromMonth: MonthInfo;
  toMonth: MonthInfo;
  summary: {
    from: MonthlySummary;
    to: MonthlySummary;
    investedDiff: number;
    currentValueDiff: number;
    profitLossDiff: number;
    investedDiffPercentage: number;
    currentValueDiffPercentage: number;
  };
  typeComparison: ComparisonItem[];
  platformComparison: ComparisonItem[];
}

export interface ComparisonResponse {
  success: boolean;
  data: ComparisonSummary;
  message: string;
  request_id: string;
  timestamp: string;
}

export interface CompareMonthsRequest {
  fromMonth?: number;
  fromYear?: number;
  toMonth?: number;
  toYear?: number;
}
