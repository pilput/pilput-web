export interface HoldingType {
  id: number;
  code: string;
  name: string;
  notes?: string;
  holdings: Holding[];
}

export interface Holding {
  id: bigint;
  user_id: string;
  name: string;
  platform: string;
  holding_type_id: number;
  currency: string;
  invested_amount: string; // Decimal as string
  current_value: string;
  units?: string;
  avg_buy_price?: string;
  current_price?: string;
  month: number;
  year: number;
  last_updated?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  holding_types: HoldingType;
  users: any; // Assuming User type, but for now any
}