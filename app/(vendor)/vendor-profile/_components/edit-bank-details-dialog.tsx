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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { profileApi } from "@/lib/api/profile";
import type { VendorProfile } from "@/types/profile";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z.object({
  bank_name: z.string().min(1, "Please select a bank"),
  account_number: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  account_name: z.string().min(1, "Account name is required"),
});

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Static options — extend as needed
// ---------------------------------------------------------------------------

const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank Nigeria",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Union Bank",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EditBankDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: VendorProfile | null;
  onSuccess?: (updated: VendorProfile) => void;
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bank_name: "",
      account_number: "",
      account_name: "",
    },
  });

  useEffect(() => {
    if (open && profile) {
      reset({
        bank_name: profile.bank_name ?? "",
        account_number: profile.account_number ?? "",
        account_name: profile.account_name ?? "",
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
      toast.success("Bank details updated successfully");
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
            <Label className="text-sm font-medium text-brand-description">
              Bank name
            </Label>
            <Select
              value={watch("bank_name")}
              onValueChange={(val) =>
                setValue("bank_name", val, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_BANKS.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bank_name && (
              <p className="text-xs text-red-500">{errors.bank_name.message}</p>
            )}
          </div>

          {/* Account number */}
          <div className="space-y-2">
            <Label
              htmlFor="account_number"
              className="text-sm font-medium text-brand-description"
            >
              Account number
            </Label>
            <Input
              id="account_number"
              placeholder="Enter account number"
              inputMode="numeric"
              maxLength={10}
              className="placeholder:text-[#94A3B8]"
              {...register("account_number")}
            />
            {errors.account_number && (
              <p className="text-xs text-red-500">
                {errors.account_number.message}
              </p>
            )}
          </div>

          {/* Account name */}
          <div className="space-y-2">
            <Label
              htmlFor="account_name"
              className="text-sm font-medium text-brand-description"
            >
              Account name
            </Label>
            <Input
              id="account_name"
              placeholder="Enter account name"
              className="placeholder:text-[#94A3B8]"
              {...register("account_name")}
            />
            {errors.account_name && (
              <p className="text-xs text-red-500">
                {errors.account_name.message}
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
