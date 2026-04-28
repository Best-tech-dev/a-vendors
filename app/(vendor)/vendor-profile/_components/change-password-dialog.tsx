"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Eye, EyeOff, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth-store";
import { profileApi } from "@/lib/api/profile";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[a-z]/, "At least one lower case letter")
      .regex(/[A-Z]/, "At least one upper case letter")
      .regex(/[@!<>|,.*&%$]/, "At least one special symbol (@!<>|,.*&%$)"),
    confirmNewPassword: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Password rule checklist config
// ---------------------------------------------------------------------------

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  {
    label: "At least one lower case letter",
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    label: "At least one upper case letter",
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    label: "At least one special symbol (@!<>|,.*&%$)",
    test: (v: string) => /[@!<>|,.*&%$]/.test(v),
  },
];

// ---------------------------------------------------------------------------
// Sub-component: password input with show/hide toggle
// ---------------------------------------------------------------------------

function PasswordInput({
  id,
  placeholder,
  error,
  registration,
}: {
  id: string;
  placeholder?: string;
  error?: string;
  registration: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="pr-10 placeholder:text-[#94A3B8]"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-title"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPassword = watch("newPassword") ?? "";

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await profileApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
      toast.success("Password changed successfully. Please sign in again.");
      handleOpenChange(false);
      // Sign the user out — they must re-authenticate with the new password
      clearAuth();
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      if (status === 401) {
        toast.error("Current password is incorrect.");
      } else if (status === 422 || status === 400) {
        toast.error(serverMessage ?? "Please check your inputs and try again.");
      } else if (!axiosError.response) {
        toast.error("Network error — please check your connection and retry.");
      } else {
        toast.error(serverMessage ?? "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-brand-title">
            Change password
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Manage your login credentials
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Important notice banner */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-700">
              Important notice
            </p>
            <p className="mt-0.5 text-sm text-amber-600">
              You&apos;ll have to sign in again after changing your password.
            </p>
          </div>

          {/* Current password */}
          <div className="space-y-2">
            <Label
              htmlFor="current_password"
              className="text-sm font-medium text-brand-description"
            >
              Current password
            </Label>
            <PasswordInput
              id="current_password"
              error={errors.currentPassword?.message}
              registration={register("currentPassword")}
            />
          </div>

          {/* New password */}
          <div className="space-y-2">
            <Label
              htmlFor="new_password"
              className="text-sm font-medium text-brand-description"
            >
              New password
            </Label>
            <PasswordInput
              id="new_password"
              error={errors.newPassword?.message}
              registration={register("newPassword")}
            />

            {/* Strength checklist */}
            <ul className="mt-2 space-y-1.5 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(newPassword);
                return (
                  <li key={rule.label} className="flex items-center gap-2">
                    <Check
                      className={`h-3.5 w-3.5 shrink-0 ${
                        passed ? "text-emerald-500" : "text-gray-300"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        passed ? "text-brand-title" : "text-brand-description"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Confirm new password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirm_password"
              className="text-sm font-medium text-brand-description"
            >
              Confirm new password
            </Label>
            <PasswordInput
              id="confirm_password"
              error={errors.confirmNewPassword?.message}
              registration={register("confirmNewPassword")}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
