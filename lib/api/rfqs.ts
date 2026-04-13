import { api } from "./axios";
import type {
  CreateRFQRequest,
  CreateRFQResponse,
  RFQsListResponse,
  RFQsListParams,
} from "@/types/rfq";

export const rfqsApi = {
  getAll: (params?: RFQsListParams) =>
    api.get<RFQsListResponse>("avendor/rfqs", { params }),

  create: (payload: CreateRFQRequest) =>
    api.post<CreateRFQResponse>("avendor/rfqs", payload),
};
