import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[a-z]/, "At least one lower case letter")
      .regex(/[A-Z]/, "At least one upper case letter")
      .regex(/[^a-zA-Z0-9]/, "At least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[a-z]/, "At least one lower case letter")
      .regex(/[A-Z]/, "At least one upper case letter")
      .regex(/[^a-zA-Z0-9]/, "At least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .min(4, "OTP must be at least 4 characters"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
