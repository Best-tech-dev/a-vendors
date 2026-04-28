import { z } from "zod";

export const createVendorSchema = z.object({
  name: z
    .string()
    .min(1, "Vendor name is required")
    .max(150, "Name must be at most 150 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  user: z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    username: z.string().optional(),
  }),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(11, "Phone number must be at most 11 digits"),
  industry: z.string().min(1, "Please select an industry"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  status: z.string().min(1, "Please select a status"),
});

export type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

// Compliance Document Schema
export const uploadComplianceDocumentSchema = z.object({
  documentType: z
    .string()
    .min(1, "Document type is required")
    .min(
      2,
      "Required document type is any valid government issued ID for businesses, e.g., CAC",
    ),
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be at most 100 characters"),
  expiry_date: z.string().min(1, "Expiry date is required"),
});

export type UploadComplianceDocumentFormValues = z.infer<
  typeof uploadComplianceDocumentSchema
>;
