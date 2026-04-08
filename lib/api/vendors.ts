import { api } from "./axios";
import type {
  CreateVendorRequest,
  CreateVendorResponse,
  VendorCategoriesResponse,
  VendorsListResponse,
  VendorsListParams,
} from "@/types/vendor";

export const vendorsApi = {
  getAll: (params?: VendorsListParams) =>
    api.get<VendorsListResponse>("avendor/vendors", { params }),

  create: (payload: CreateVendorRequest) =>
    api.post<CreateVendorResponse>("avendor/vendors", payload),

  getCategories: () =>
    api.get<VendorCategoriesResponse>("avendor/inventory/categories"),
};
