import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters"),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const createMaterialSchema = z.object({
  name: z
    .string()
    .min(1, "Material name is required")
    .max(150, "Name must be at most 150 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  unit: z.string().min(1, "Please select a unit of measure"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters"),
  stock: z.string(),
  reorderLevel: z.string(),
  pricePerUnit: z.string(),
});

export type CreateMaterialFormValues = z.infer<typeof createMaterialSchema>;
