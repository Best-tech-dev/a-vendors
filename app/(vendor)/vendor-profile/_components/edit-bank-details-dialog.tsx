"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
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
import { profileApi } from "@/lib/api/profile";
import type { VendorProfileData } from "@/types/profile";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  accountName: z.string().min(1, "Account name is required"),
});

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EditBankDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: VendorProfileData | null;
  onSuccess?: (updated: Partial<VendorProfileData>) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EditBankDetailsDialog({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: EditBankDetailsDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  });

  useEffect(() => {
    if (open && profile && profile.bank) {
      reset({
        bankName: profile.bank.bankName ?? "",
        accountNumber: profile.bank.accountNumber ?? "",
        accountName: profile.bank.accountName ?? "",
      });
    }
  }, [open, profile, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await profileApi.updateBankDetails(values);
      toast.success(res.data.message || "Bank details updated successfully");
      onSuccess?.(res.data.data);
      handleClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      if (status === 422 || status === 400) {
        toast.error(serverMessage ?? "Please check your inputs and try again.");
      } else if (status === 403) {
        toast.error("You don't have permission to update bank details.");
      } else if (!axiosError.response) {
        toast.error("Network error — please check your connection and retry.");
      } else {
        toast.error(serverMessage ?? "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-brand-title">
            Manage your bank details
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Update your workspace info
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Bank name */}
          <div className="space-y-2">
            <Label
              htmlFor="bankName"
              className="text-sm font-medium text-brand-description"
            >
              Bank name
            </Label>
            <Input
              id="bankName"
              placeholder="e.g., First Bank Nigeria"
              className="placeholder:text-[#94A3B8]"
              {...register("bankName")}
            />
            {errors.bankName && (
              <p className="text-xs text-red-500">{errors.bankName.message}</p>
            )}
          </div>

          {/* Account number */}
          <div className="space-y-2">
            <Label
              htmlFor="accountNumber"
              className="text-sm font-medium text-brand-description"
            >
              Account number
            </Label>
            <Input
              id="accountNumber"
              placeholder="Enter account number"
              inputMode="numeric"
              maxLength={10}
              className="placeholder:text-[#94A3B8]"
              {...register("accountNumber")}
            />
            {errors.accountNumber && (
              <p className="text-xs text-red-500">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          {/* Account name */}
          <div className="space-y-2">
            <Label
              htmlFor="accountName"
              className="text-sm font-medium text-brand-description"
            >
              Account name
            </Label>
            <Input
              id="accountName"
              placeholder="Enter account name"
              className="placeholder:text-[#94A3B8]"
              {...register("accountName")}
            />
            {errors.accountName && (
              <p className="text-xs text-red-500">
                {errors.accountName.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
