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
  category: string;
  unit: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  description?: string;
  thumbnail?: string;
}
