import { api } from "./axios";
import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  CategoriesListResponse,
  CreateMaterialRequest,
  CreateMaterialResponse,
  MaterialsListResponse,
  MaterialsListParams,
  SingleCategoryResponse,
  VendorMaterialsListParams,
  VendorMaterialsListResponse,
} from "@/types/inventory";

export const inventoryApi = {
  // ── Admin-scoped endpoints (avendor prefix) ──────────────────────────
  createCategory: (payload: CreateCategoryRequest) =>
    api.post<CreateCategoryResponse>("avendor/inventory/categories", payload),

  getCategories: () =>
    api.get<CategoriesListResponse>("avendor/inventory/categories"),

  getCategoryById: (id: string) =>
    api.get<SingleCategoryResponse>(`avendor/inventory/categories/${id}`),

  getMaterials: (params?: MaterialsListParams) =>
    api.get<MaterialsListResponse>("avendor/inventory/materials", { params }),

  createMaterial: (payload: CreateMaterialRequest) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("categoryId", payload.categoryId);
    formData.append("unit", payload.unit);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.stock !== undefined)
      formData.append("stock", String(payload.stock));
    if (payload.reorderLevel !== undefined)
      formData.append("reorderLevel", String(payload.reorderLevel));
    if (payload.pricePerUnit !== undefined)
      formData.append("pricePerUnit", String(payload.pricePerUnit));
    if (payload.image) formData.append("image", payload.image);

    return api.post<CreateMaterialResponse>(
      "avendor/inventory/materials",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  // ── Vendor-scoped endpoints (vendor prefix) ──────────────────────────
  getVendorMaterials: (params?: VendorMaterialsListParams) =>
    api.get<VendorMaterialsListResponse>("vendor/inventory/materials", {
      params,
    }),

  createVendorCategory: (payload: CreateCategoryRequest) =>
    api.post<CreateCategoryResponse>("vendor/inventory/categories", payload),

  getVendorCategories: () =>
    api.get<CategoriesListResponse>("vendor/inventory/categories"),

  createVendorMaterial: (payload: CreateMaterialRequest) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("categoryId", payload.categoryId);
    formData.append("unit", payload.unit);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.stock !== undefined)
      formData.append("stock", String(payload.stock));
    if (payload.reorderLevel !== undefined)
      formData.append("reorderLevel", String(payload.reorderLevel));
    if (payload.pricePerUnit !== undefined)
      formData.append("pricePerUnit", String(payload.pricePerUnit));
    if (payload.image) formData.append("image", payload.image);

    return api.post<CreateMaterialResponse>(
      "vendor/inventory/materials",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },
};
