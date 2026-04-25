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
  getVendorQuoteRequests: (params: {
    page?: number;
    limit?: number;
    search?: string;
  }) => api.get("avendor/rfqs", { params }),

  // Vendor-specific endpoint to fetch details of a specific RFQ assigned to the logged-in vendor
  getVendorRFQById: (id: string) => api.get(`avendor/rfqs/${id}`),
};
