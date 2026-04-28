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
import type { VendorProfileData } from "@/types/profile";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Please select an industry"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(1, "Address is required"),
});

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Static options — extend as needed
// ---------------------------------------------------------------------------

const INDUSTRIES = [
  "Electronics & Component",
  "Raw Materials",
  "Office Supplies",
  "Logistics & Freight",
  "Construction",
  "Food & Beverage",
  "Healthcare",
  "Other",
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EditCompanyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: VendorProfileData | null;
  onSuccess?: (updated: Partial<VendorProfileData>) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EditCompanyDetailsDialog({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: EditCompanyDetailsDialogProps) {
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
      name: "",
      industry: "",
      city: "",
      country: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Populate form when profile loads or dialog opens
  useEffect(() => {
    if (open && profile) {
      reset({
        name: profile.company.name ?? "",
        industry: profile.company.industry ?? "",
        city: profile.company.city ?? "",
        country: profile.company.country ?? "",
        email: profile.company.email ?? "",
        phone: profile.company.phone ?? "",
        address: profile.company.address ?? "",
      });
    }
  }, [open, profile, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await profileApi.updateCompanyDetails(values);
      toast.success(res.data.message || "Company details updated successfully");
      onSuccess?.(res.data.data);
      handleClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      if (status === 422 || status === 400) {
        toast.error(serverMessage ?? "Please check your inputs and try again.");
      } else if (status === 403) {
        toast.error("You don't have permission to update this profile.");
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
            Manage your company details
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Update your workspace info
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Company Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-brand-description"
            >
              Company Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Global Supplies LTD"
              className="placeholder:text-[#94A3B8]"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Industry
            </Label>
            <Select
              value={watch("industry")}
              onValueChange={(val) =>
                setValue("industry", val, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-xs text-red-500">{errors.industry.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-medium text-brand-description"
            >
              Address
            </Label>
            <Input
              id="address"
              placeholder="e.g., 12 Adeola Odeku Street"
              className="placeholder:text-[#94A3B8]"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* City + Country */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-sm font-medium text-brand-description"
              >
                City
              </Label>
              <Input
                id="city"
                placeholder="e.g., Lagos"
                className="placeholder:text-[#94A3B8]"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="text-sm font-medium text-brand-description"
              >
                Country
              </Label>
              <Input
                id="country"
                placeholder="e.g., Nigeria"
                className="placeholder:text-[#94A3B8]"
                {...register("country")}
              />
              {errors.country && (
                <p className="text-xs text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-brand-description"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="globalsupplies@gmail.com"
              className="placeholder:text-[#94A3B8]"
              {...register("email")}
              disabled
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
            <p className="text-xs text-brand-description">
              Email is sourced from login credentials and cannot be edited here.
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-brand-description"
            >
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              className="placeholder:text-[#94A3B8]"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
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
