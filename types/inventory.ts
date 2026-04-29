export interface MaterialCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    materials: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data: MaterialCategory;
  statusCode: number;
}

export interface CategoriesListResponse {
  success: boolean;
  message: string;
  data: MaterialCategory[];
  length: number;
  statusCode: number;
}

export interface CreateMaterialRequest {
  name: string;
  categoryId: string;
  unit: string;
  description?: string;
  stock?: number;
  reorderLevel?: number;
  pricePerUnit?: number;
  image?: File;
}

export interface CreateMaterialResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown>;
  statusCode: number;
}

export interface Material {
  id: string;
  name: string;
  categoryId: string;
  unit: string;
  description?: string;
  stock: number;
  reorderLevel: number;
  pricePerUnit: number;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MaterialsAnalysis {
  totalMaterials: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface MaterialsListResponse {
  success: boolean;
  message: string;
  data: {
    analysis: MaterialsAnalysis;
    items: Material[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  statusCode: number;
}

export interface MaterialsListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  lowStock?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: MaterialCategory;
  statusCode: number;
}

// Vendor-facing material — has SKU, no imageUrl
export interface VendorMaterial {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: { id: string; name: string };
  unit: string;
  stock: number;
  reorderLevel: number;
  pricePerUnit: number;
  inventoryValue: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorInventoryAnalysis {
  totalMaterials: number;
  totalCategories: number;
  totalStock: number;
  totalInventoryValue: number;
  totalUnitPriceSum: number;
}

export interface VendorInventoryStatusCounts {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface VendorMaterialsListResponse {
  success: boolean;
  message: string;
  data: {
    summary: VendorInventoryAnalysis;
    statusCounts: VendorInventoryStatusCounts;
    items: VendorMaterial[];
  };
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  statusCode: number;
}

export interface VendorMaterialsListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: "in_stock" | "low_stock" | "out_of_stock";
  sortBy?: "createdAt" | "name" | "sku" | "stock" | "pricePerUnit";
  sortOrder?: "asc" | "desc";
}
