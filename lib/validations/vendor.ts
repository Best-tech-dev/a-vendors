import { z } from "zod";

export const createVendorSchema = z.object({
  name: z
    .string()
    .min(1, "Vendor name is required")
    .max(150, "Name must be at most 150 characters"),
  category: z.string().min(1, "Please select a category"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(11, "Phone number must be at most 11 digits"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  status: z.string().min(1, "Please select a status"),
});

export type CreateVendorFormValues = z.infer<typeof createVendorSchema>;
