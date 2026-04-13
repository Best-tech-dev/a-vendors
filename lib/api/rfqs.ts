import { api } from "./axios";
import type { CreateRFQRequest, CreateRFQResponse } from "@/types/rfq";

export const rfqsApi = {
  create: (payload: CreateRFQRequest) =>
    api.post<CreateRFQResponse>("avendor/rfqs", payload),
};
