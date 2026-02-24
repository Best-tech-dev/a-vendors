export type RFQStatus =
  | "Draft"
  | "Sent"
  | "Awarded"
  | "Awaiting Quotes"
  | "Awaiting Selection";

export interface RFQItem {
  id: string;
  material: string;
  quantity: number;
  unit: string;
  budget: number;
}

export interface RFQ {
  id: string;
  title: string;
  deadline: string;
  status: RFQStatus;
  items: RFQItem[];
  vendorIds: string[];
}

export type VendorTag =
  | "Best price"
  | "Competitive"
  | "Review"
  | "Above budget";

export interface VendorQuote {
  id: string;
  vendorName: string;
  rating: number;
  tag: VendorTag;
  unitPrice: number;
  totalPrice: number;
  quality: number;
  deliveryDays: number;
  /** negative = cheaper than budget, positive = more expensive */
  deviation: number;
}

export interface RFQItemComparison {
  itemName: string;
  quantity: number;
  unit: string;
  budget: number;
  bestPrice: number;
  averagePrice: number;
  quotes: VendorQuote[];
}

export type AnalysisVariant = "success" | "neutral" | "danger";

export interface AnalysisRecommendation {
  variant: AnalysisVariant;
  label: string;
  vendorName: string;
  description: string;
}

export interface RFQDetail {
  id: string;
  title: string;
  rfqId: string;
  totalItems: number;
  items: RFQItemComparison[];
  analysis: AnalysisRecommendation[];
}

export interface SelectableVendor {
  id: string;
  name: string;
  category: string;
  rating: number;
}
