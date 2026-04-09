import { api } from "./axios";
import type {
  AddNoteResponse,
  CreateVendorRequest,
  CreateVendorResponse,
  VendorCategoriesResponse,
  VendorDetailResponse,
  VendorsListResponse,
  VendorsListParams,
} from "@/types/vendor";

export const vendorsApi = {
  getAll: (params?: VendorsListParams) =>
    api.get<VendorsListResponse>("avendor/vendors", { params }),

  getById: (id: string) =>
    api.get<VendorDetailResponse>(`avendor/vendors/${id}`),

  create: (payload: CreateVendorRequest) =>
    api.post<CreateVendorResponse>("avendor/vendors", payload),

  getCategories: () =>
    api.get<VendorCategoriesResponse>("avendor/inventory/categories"),

  addNote: (vendorId: string, content: string) =>
    api.post<AddNoteResponse>(`avendor/vendors/${vendorId}/notes`, { content }),
};
