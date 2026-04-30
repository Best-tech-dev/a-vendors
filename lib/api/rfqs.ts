import { api } from "./axios";
import type {
  CreateRFQRequest,
  CreateRFQResponse,
  GetRFQByIdResponse,
  UpdateRFQRequest,
  UpdateRFQResponse,
  AddRFQItemRequest,
  AddRFQItemResponse,
  UpdateRFQItemRequest,
  UpdateRFQItemResponse,
  RFQsListResponse,
  RFQsListParams,
  UploadItemAttachmentsResponse,
  AssignVendorsRequest,
  AssignVendorsResponse,
  SendRFQResponse,
  VendorQuoteRequestsParams,
  VendorQuoteRequestsResponse,
  VendorQuoteRequestDetailResponse,
  VendorQuoteHistoryParams,
  VendorQuoteHistoryResponse,
  VendorQuoteHistoryDetailResponse,
  FulfillmentTimelineResponse,
  UpdateFulfillmentStageRequest,
  UpdateFulfillmentStageResponse,
  VendorQuotePaymentPlansResponse,
  SubmitVendorQuoteRequest,
  SubmitVendorQuoteResponse,
  WithdrawVendorQuoteResponse,
  UpdateVendorQuotePaymentPlanRequest,
  UpdateVendorQuotePaymentPlanResponse,
} from "@/types/rfq";

export const rfqsApi = {
  getAll: (params?: RFQsListParams) =>
    api.get<RFQsListResponse>("avendor/rfqs", { params }),

  getById: (id: string) =>
    api.get<GetRFQByIdResponse>(`avendor/rfqs/${encodeURIComponent(id)}`),

  create: (payload: CreateRFQRequest) =>
    api.post<CreateRFQResponse>("avendor/rfqs", payload),

  update: (id: string, payload: UpdateRFQRequest) =>
    api.patch<UpdateRFQResponse>(
      `avendor/rfqs/${encodeURIComponent(id)}`,
      payload,
    ),

  addItem: (rfqId: string, payload: AddRFQItemRequest) =>
    api.post<AddRFQItemResponse>(
      `avendor/rfqs/${encodeURIComponent(rfqId)}/items`,
      payload,
    ),

  updateItem: (rfqId: string, itemId: string, payload: UpdateRFQItemRequest) =>
    api.patch<UpdateRFQItemResponse>(
      `avendor/rfqs/${encodeURIComponent(rfqId)}/items/${encodeURIComponent(itemId)}`,
      payload,
    ),

  uploadItemAttachments: (rfqId: string, itemId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return api.post<UploadItemAttachmentsResponse>(
      `avendor/rfqs/${encodeURIComponent(rfqId)}/items/${encodeURIComponent(itemId)}/attachments`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  assignVendors: (rfqId: string, payload: AssignVendorsRequest) =>
    api.put<AssignVendorsResponse>(
      `avendor/rfqs/${encodeURIComponent(rfqId)}/vendors`,
      payload,
    ),

  send: (rfqId: string) =>
    api.patch<SendRFQResponse>(
      `avendor/rfqs/${encodeURIComponent(rfqId)}/send`,
    ),

  // Vendor-specific endpoint to fetch quote requests assigned to the logged-in vendor
  getVendorQuoteRequests: (params: VendorQuoteRequestsParams) =>
    api.get<VendorQuoteRequestsResponse>("vendor/quote-requests", { params }),

  // Vendor-specific endpoint to fetch details of a specific RFQ assigned to the logged-in vendor
  getVendorRFQById: (id: string) =>
    api.get<VendorQuoteRequestDetailResponse>(
      `vendor/quote-requests/${encodeURIComponent(id)}`,
    ),

  // Vendor-specific endpoint to fetch quote history for the logged-in vendor
  getVendorQuoteHistory: (params: VendorQuoteHistoryParams) =>
    api.get<VendorQuoteHistoryResponse>("vendor/quotes-history", { params }),

  // Vendor-specific endpoint to fetch detail of a single historical quote
  getVendorQuoteHistoryById: (quoteId: string) =>
    api.get<VendorQuoteHistoryDetailResponse>(
      `vendor/quotes-history/${encodeURIComponent(quoteId)}`,
    ),

  // Vendor-specific endpoint to fetch order fulfillment timeline
  getVendorQuoteFulfillment: (quoteId: string) =>
    api.get<FulfillmentTimelineResponse>(
      `vendor/quotes-history/${encodeURIComponent(quoteId)}/fulfillment`,
    ),

  // Vendor-specific endpoint to update fulfillment stage
  updateVendorQuoteFulfillmentStage: (
    quoteId: string,
    payload: UpdateFulfillmentStageRequest,
  ) =>
    api.patch<UpdateFulfillmentStageResponse>(
      `vendor/quotes-history/${encodeURIComponent(quoteId)}/fulfillment/stage`,
      payload,
    ),

  // Vendor quote request payment plans (active list)
  getVendorQuotePaymentPlans: () =>
    api.get<VendorQuotePaymentPlansResponse>("vendor/quote-requests/payment-plans"),

  // Submit or resubmit quote for an RFQ assignment
  submitVendorQuote: (rfqId: string, payload: SubmitVendorQuoteRequest) =>
    api.post<SubmitVendorQuoteResponse>(
      `vendor/quote-requests/${encodeURIComponent(rfqId)}/quote`,
      payload,
    ),

  // Withdraw (soft delete) a submitted quote
  withdrawVendorQuote: (rfqId: string) =>
    api.delete<WithdrawVendorQuoteResponse>(
      `vendor/quote-requests/${encodeURIComponent(rfqId)}/quote`,
    ),

  // Update/clear payment plan on existing quote without resubmitting lines
  updateVendorQuotePaymentPlan: (
    rfqId: string,
    payload: UpdateVendorQuotePaymentPlanRequest,
  ) =>
    api.patch<UpdateVendorQuotePaymentPlanResponse>(
      `vendor/quote-requests/${encodeURIComponent(rfqId)}/quote/payment-plan`,
      payload,
    ),
};
