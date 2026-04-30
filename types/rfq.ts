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

// ── Assign Vendors to RFQ ──

export interface AssignVendorsRequest {
  vendorIds: string[];
  sendToAllVendors: boolean;
}

export interface AssignVendorsResponse {
  success: boolean;
  message: string;
  data: CreateRFQResponseVendor[];
  statusCode: number;
}

// ── Send RFQ to Vendors ──

export interface SendRFQResponse {
  success: boolean;
  message: string;
  data: CreateRFQData;
  statusCode: number;
}

// ── Vendor Quote Requests List ──
export interface VendorQuoteRequest {
  assignmentId: string;
  rfqId: string;
  reference: string;
  title: string;
  description: string;
  itemsCount: number;
  rfqStatus: string;
  totalBudget: number;
  sentAt: string;
  expectedDelivery: string;
  submissionDeadline: string;
  myQuote: {
    id: string;
    quoteNumber: string;
    status: string;
    totalAmount: number;
    currency: string;
    submittedAt: string;
    updatedAt: string;
    paymentPlan: {
      id: string;
      name: string;
      code: string;
    } | null;
  } | null;
}

export interface VendorRFQItem {
  id: string;
  materialName: string;
  materialId: string;
  description: string;
  imageUrl?: string;
  quantity: number;
  unit: string;
  expectedAmount: number;
  attachments: {
    id: string;
    imageUrl: string;
    originalFilename: string;
  }[];
}

// ── Vendor RFQ Detail ──
export interface VendorRFQDetail {
  id: string;
  reference: string;
  title: string;
  sentDate: string;
  totalItems: number;
  totalAmount: number;
  submissionDeadline: string;
  expectedDelivery: string;
  items: VendorRFQItem[];
  attachments: {
    id: string;
    imageUrl: string;
    originalFilename: string;
  }[];
}

export interface VendorQuoteRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  view?: "open" | "submitted" | "active";
}

export interface VendorQuoteRequestsResponse {
  success: boolean;
  message: string;
  data: VendorQuoteRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  statusCode: number;
}

export interface VendorQuoteRequestDetailResponse {
  success: boolean;
  message: string;
  data: {
    rfq: {
      id: string;
      rfqNumber: string;
      title: string;
      description: string;
      status: string;
      totalBudget: number;
      expectedDelivery: string;
      submissionDeadline: string;
      sentAt: string;
      createdAt: string;
      attachments: {
        id: string;
        imageUrl: string;
        originalFilename: string;
      }[];
    };
    items: {
      id: string;
      materialId: string;
      materialName: string;
      quantity: number;
      unit: string;
      budget: number;
      description: string;
      imageUrl: string;
      attachments: {
        id: string;
        imageUrl: string;
        originalFilename: string;
      }[];
    }[];
    summary: {
      totalItems: number;
      totalAmount: number;
      currency: string;
    };
    quote: {
      id: string;
      quoteNumber: string;
      status: string;
      currency: string;
      totalAmount: number;
      note: string;
      submittedAt: string;
      withdrawnAt: string;
      createdAt: string;
      updatedAt: string;
      paymentPlan: {
        id: string;
        name: string;
        code: string;
        description: string;
        netDays: number;
      } | null;
      paymentPlanSetBy: string;
      paymentPlanSetAt: string;
      itemQuotes: {
        rfqItemId: string;
        prices: {
          id: string;
          position: number;
          quality: string;
          possibleDeliveryAt: string;
          pricePerUnit: number;
          totalPrice: number;
          note: string;
        }[];
      }[];
    } | null;
  };
  statusCode: number;
}

export interface VendorQuotePaymentPlan {
  id: string;
  name: string;
  code: string;
  description: string;
  netDays: number;
  sortOrder?: number;
}

export interface VendorQuotePaymentPlansResponse {
  success: boolean;
  message: string;
  data: VendorQuotePaymentPlan[];
  statusCode: number;
}

export interface VendorQuoteLineInput {
  rfqItemId: string;
  quality: string;
  possibleDeliveryAt?: string;
  pricePerUnit: number;
  totalPrice: number;
  note?: string;
}

export interface SubmitVendorQuoteRequest {
  currency: string;
  note?: string;
  lines: VendorQuoteLineInput[];
  paymentPlanId?: string | null;
}

export interface VendorQuotePrice {
  id: string;
  position: number;
  quality: string;
  possibleDeliveryAt: string;
  pricePerUnit: number;
  totalPrice: number;
  note: string;
}

export interface VendorQuoteItemQuote {
  rfqItemId: string;
  prices: VendorQuotePrice[];
}

export interface VendorQuoteRecord {
  id: string;
  quoteNumber: string;
  status: string;
  currency: string;
  totalAmount: number;
  note: string;
  submittedAt: string;
  withdrawnAt: string;
  createdAt: string;
  updatedAt: string;
  paymentPlan: VendorQuotePaymentPlan | null;
  paymentPlanSetBy: string;
  paymentPlanSetAt: string;
  itemQuotes: VendorQuoteItemQuote[];
}

export interface SubmitVendorQuoteResponse {
  success: boolean;
  message: string;
  data: VendorQuoteRecord;
  statusCode: number;
}

export interface WithdrawVendorQuoteResponse {
  success: boolean;
  message: string;
  data: VendorQuoteRecord;
  statusCode: number;
}

export interface UpdateVendorQuotePaymentPlanRequest {
  paymentPlanId: string | null;
}

export interface UpdateVendorQuotePaymentPlanResponse {
  success: boolean;
  message: string;
  data: VendorQuoteRecord;
  statusCode: number;
}

// ── Vendor Quote History ──
export type QuoteHistoryFilter =
  | "all"
  | "awarded"
  | "pending"
  | "rejected"
  | "withdrawn";
export interface VendorQuoteHistory {
  id: string;
  quoteNumber: string;
  reference: string;
  title: string;
  totalItems: number;
  acceptedItems: number;
  totalPriceOptions: number;
  amountQuoted: number;
  currency: string;
  dateSubmitted: string;
  expectedDelivery: string;
  rfqId: string;
  rfqStatus: string;
  status: string;
  displayStatus: string;
  fulfillment: {
    stage: string;
    stageLabel: string;
    shippedAt: string | null;
    deliveredAt: string | null;
  };
}

export interface VendorQuoteHistoryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  tabs: {
    all: number;
    awarded: number;
    pending: number;
    rejected: number;
    withdrawn: number;
  };
}

export interface VendorQuoteHistoryResponse {
  success: boolean;
  message: string;
  data: VendorQuoteHistory[];
  meta: VendorQuoteHistoryMeta;
  statusCode: number;
}

export interface VendorQuoteHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
  view?: QuoteHistoryFilter;
}

// ── Vendor Quote History Detail (GET /vendor/quotes-history/:quoteId) ──

export interface VendorQuoteHistoryDetailPriceOption {
  id: string;
  position: number;
  quality: string;
  possibleDeliveryAt: string;
  pricePerUnit: number;
  totalPrice: number;
  note: string;
  /** "pending" | "accepted" | "rejected" */
  decision: string;
  decisionLabel: string;
  decisionNote: string;
  decisionAt: string;
}

export interface VendorQuoteHistoryDetailItemAttachment {
  id: string;
  imageUrl: string;
  originalFilename: string;
}

export interface VendorQuoteHistoryDetailItem {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  description: string;
  imageUrl: string;
  attachments: VendorQuoteHistoryDetailItemAttachment[];
  priceOptions: VendorQuoteHistoryDetailPriceOption[];
}

export interface VendorQuoteHistoryDetailSummary {
  totalItems: number;
  totalPriceOptions: number;
  acceptedItems: number;
  acceptedLines: number;
  totalQuoted: number;
  expectedDelivery: string;
  dateSubmitted: string;
}

export interface VendorQuoteHistoryDetailOrder {
  id: string;
  stage: string;
  stageLabel: string;
  expectedDeliveryAt: string;
}

export interface VendorQuoteHistoryDetail {
  id: string;
  quoteNumber: string;
  /** Internal status, e.g. "submitted" */
  status: string;
  /** Display-friendly status, e.g. "Awarded" */
  displayStatus: string;
  currency: string;
  totalAmount: number;
  note: string;
  submittedAt: string;
  withdrawnAt: string;
  createdAt: string;
  updatedAt: string;
  rfq: {
    id: string;
    rfqNumber: string;
    title: string;
    status: string;
    expectedDelivery: string;
  };
  summary: VendorQuoteHistoryDetailSummary;
  paymentPlan: {
    id: string;
    name: string;
    code: string;
    description: string;
    netDays: number;
  } | null;
  paymentPlanSetBy: string;
  paymentPlanSetAt: string;
  items: VendorQuoteHistoryDetailItem[];
  order: VendorQuoteHistoryDetailOrder | null;
}

export interface VendorQuoteHistoryDetailResponse {
  success: boolean;
  message: string;
  data: VendorQuoteHistoryDetail;
  statusCode: number;
}

// ── Vendor Order Fulfillment Timeline (GET /vendor/quotes-history/:quoteId/fulfillment) ──

export interface FulfillmentTimelineEntry {
  type: string;            // "stage" | "payment"
  stage: string;           // "created" | "in_production" | "in_transit" | "delivered"
  label: string;           // e.g. "In Production", "50% Payment Approved"
  occurredAt: string;
  /** "done" | "active" | "pending" */
  state: string;
  id: string;
  /** Payment-specific fields */
  percentage?: number;
  amount?: number;
  currency?: string;
  approvedAt?: string;
  hasProof?: boolean;
}

export interface FulfillmentPayment {
  id: string;
  label: string;
  percentage: number;
  amount: number;
  currency: string;
  status: string;          // "pending" | "approved"
  approvedAt: string;
  reference: string;
  proof: {
    url: string;
    publicId: string;
    originalFilename: string;
  } | null;
}

export interface FulfillmentOrder {
  id: string;
  quoteId: string;
  stage: string;
  stageLabel: string;
  expectedDeliveryAt: string;
  productionStartedAt: string;
  shippedAt: string;
  deliveredAt: string;
  cancelledAt: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface FulfillmentTotals {
  totalQuoted: number;
  totalApproved: number;
  outstanding: number;
  currency: string;
}

export interface FulfillmentTimelineResponse {
  success: boolean;
  message: string;
  data: {
    order: FulfillmentOrder;
    timeline: FulfillmentTimelineEntry[];
    payments: FulfillmentPayment[];
    totals: FulfillmentTotals;
  };
  statusCode: number;
}

// ── Update Fulfillment Stage (PATCH /vendor/quotes-history/:quoteId/fulfillment/stage) ──

export interface UpdateFulfillmentStageRequest {
  stage: string;   // "in_production" | "in_transit" | "delivered"
  note?: string;
}

export interface UpdateFulfillmentStageResponse {
  success: boolean;
  message: string;
  data: {
    order: {
      id: string;
      quoteId: string;
      stage: string;
      stageLabel: string;
      expectedDeliveryAt: string;
      productionStartedAt: string;
      shippedAt: string;
      deliveredAt: string;
      cancelledAt: string;
      note: string;
      updatedAt: string;
    };
  };
  statusCode: number;
}

