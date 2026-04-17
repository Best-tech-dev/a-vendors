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

// ── Create RFQ Request/Response ──

export interface CreateRFQItemPayload {
  materialId: string;
  quantity: number;
  budget: number;
  description?: string;
}

export interface CreateRFQRequest {
  title: string;
  dueDate: string;
  description?: string;
  unit: string;
  items: CreateRFQItemPayload[];
  vendorIds: string[];
  sendToAllVendors: boolean;
}

export interface ItemAttachment {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  originalFilename: string;
  createdAt: string;
}

export interface UploadItemAttachmentsResponse {
  success: boolean;
  message: string;
  data: ItemAttachment[];
  statusCode: number;
}

export interface CreateRFQResponseItem {
  id: string;
  rfqId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  budget: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  attachments: ItemAttachment[];
  material: {
    id: string;
    name: string;
    unit: string;
    pricePerUnit: number;
  };
}

export interface CreateRFQResponseVendor {
  id: string;
  rfqId: string;
  vendorId: string;
  sentAt: string | null;
  createdAt: string;
  vendor: {
    id: string;
    name: string;
    email: string;
    rating: number;
    status: string;
  };
}

export interface CreateRFQData {
  id: string;
  rfqNumber: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: string;
  totalBudget: number;
  sentAt: string | null;
  createdById: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
  items: CreateRFQResponseItem[];
  vendors: CreateRFQResponseVendor[];
  attachments: unknown[];
}

export interface CreateRFQResponse {
  success: boolean;
  message: string;
  data: CreateRFQData;
}

/** GET /avendor/rfqs/:id returns the same data shape as create */
export interface GetRFQByIdResponse {
  success: boolean;
  message: string;
  data: CreateRFQData;
  statusCode: number;
}

// ── Update RFQ ──

export interface UpdateRFQRequest {
  title?: string;
  dueDate?: string;
  description?: string;
}

export interface UpdateRFQResponse {
  success: boolean;
  message: string;
  data: CreateRFQData;
  statusCode: number;
}

// ── Add RFQ Item ──

export interface AddRFQItemRequest {
  materialId: string;
  quantity: number;
  budget: number;
  description?: string;
}

export interface AddRFQItemResponse {
  success: boolean;
  message: string;
  data: CreateRFQResponseItem;
}

// ── Update RFQ Item ──

export interface UpdateRFQItemRequest {
  materialId?: string;
  quantity?: number;
  budget?: number;
  description?: string;
}

export interface UpdateRFQItemResponse {
  success: boolean;
  message: string;
  data: CreateRFQResponseItem;
  statusCode: number;
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

// ── RFQ List API Types ──

export interface RFQListItem {
  id: string;
  rfqNumber: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: string;
  totalBudget: number;
  sentAt: string | null;
  createdById: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    items: number;
    vendors: number;
  };
}

export interface RFQsAnalysis {
  totalRfqs: number;
  draftCount: number;
  sentCount: number;
  awardedCount: number;
}

export interface RFQsListResponse {
  success: boolean;
  message: string;
  data: {
    analysis: RFQsAnalysis;
    items: RFQListItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  statusCode: number;
}

export interface RFQsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface SelectableVendor {
  id: string;
  name: string;
  category: string;
  rating: number;
}
