import { api } from "./axios";
import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  CategoriesListResponse,
  CreateMaterialRequest,
  CreateMaterialResponse,
} from "@/types/inventory";

export const inventoryApi = {
  createCategory: (payload: CreateCategoryRequest) =>
    api.post<CreateCategoryResponse>("avendor/inventory/categories", payload),

  getCategories: () =>
    api.get<CategoriesListResponse>("avendor/inventory/categories"),

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
};
