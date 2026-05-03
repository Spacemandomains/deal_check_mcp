export type DealVerdict =
  | "GOOD DEAL"
  | "BAD DEAL"
  | "FAIR PRICE"
  | "WAIT";

export interface DealCheckInput {
  product_name: string;
  listed_price: number;
  condition?: string;
  marketplace?: string;
  category?: string;
}

export interface DealCheckResult {
  verdict: DealVerdict;
  confidence: number;
  product_name: string;
  listed_price: number;
  estimated_market_price: number;
  savings_estimate: number;
  recommendation: string;
  risk_notes: string[];
}
