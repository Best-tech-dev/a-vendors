export interface MaterialCategory {
  id: string;
  name: string;
  description: string;
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
