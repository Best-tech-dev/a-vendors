import { api } from "./axios";
import type {
  CreateRFQRequest,
  CreateRFQResponse,
  GetRFQByIdResponse,
  UpdateRFQRequest,
  UpdateRFQResponse,
  AddRFQItemRequest,
  AddRFQItemResponse,
  RFQsListResponse,
  RFQsListParams,
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
};
