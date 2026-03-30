import { api } from "./axios";
import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
} from "@/types/inventory";

export const inventoryApi = {
  createCategory: (payload: CreateCategoryRequest) =>
    api.post<CreateCategoryResponse>("avendor/inventory/categories", payload),
};
