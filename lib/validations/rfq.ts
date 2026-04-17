import { z } from "zod";

const rfqItemSchema = z.object({
  materialId: z.string().min(1, "Please select a material"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  budget: z.number().min(1, "Budget must be greater than 0"),
  description: z.string().optional(),
});

export const createRFQSchema = z
  .object({
    title: z
      .string()
      .min(1, "RFQ title is required")
      .max(200, "Title must be at most 200 characters"),
    description: z.string().optional(),
    dueDate: z.string().min(1, "Due date is required"),
    unit: z.string().min(1, "Unit is required"),
    items: z.array(rfqItemSchema).min(1, "At least one item is required"),
    vendorIds: z.array(z.string()),
    sendToAllVendors: z.boolean(),
  })
  .refine((data) => data.sendToAllVendors || data.vendorIds.length > 0, {
    message: "Select at least one vendor or send to all",
    path: ["vendorIds"],
  });

export type CreateRFQFormValues = z.infer<typeof createRFQSchema>;

export const updateRFQSchema = z.object({
  title: z
    .string()
    .min(1, "RFQ title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
});

export type UpdateRFQFormValues = z.infer<typeof updateRFQSchema>;

export const addRFQItemSchema = z.object({
  materialId: z.string().min(1, "Please select a material"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  budget: z.number().min(1, "Budget must be greater than 0"),
  description: z.string().optional(),
});

export type AddRFQItemFormValues = z.infer<typeof addRFQItemSchema>;
