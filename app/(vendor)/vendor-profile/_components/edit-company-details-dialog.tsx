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
  company_name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Please select a role / industry"),
  city: z.string().min(1, "Please select a city"),
  country: z.string().min(1, "Please select a country"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
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

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu"];

const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
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
      company_name: "",
      industry: "",
      city: "",
      country: "",
      email: "",
      phone: "",
    },
  });

  // Populate form when profile loads or dialog opens
  useEffect(() => {
    if (open && profile) {
      reset({
        company_name: profile.company.name ?? "",
        industry: profile.company.industry ?? "",
        city: profile.company.city ?? "",
        country: profile.company.country ?? "",
        email: profile.company.email ?? "",
        phone: profile.company.phone ?? "",
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
      toast.success("Company details updated successfully");
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
              htmlFor="company_name"
              className="text-sm font-medium text-brand-description"
            >
              Company Name
            </Label>
            <Input
              id="company_name"
              placeholder="e.g., Global Supplies LTD"
              className="placeholder:text-[#94A3B8]"
              {...register("company_name")}
            />
            {errors.company_name && (
              <p className="text-xs text-red-500">
                {errors.company_name.message}
              </p>
            )}
          </div>

          {/* Role / Industry */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Role
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

          {/* City + Country */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-brand-description">
                City
              </Label>
              <Select
                value={watch("city")}
                onValueChange={(val) =>
                  setValue("city", val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-brand-description">
                Country
              </Label>
              <Select
                value={watch("country")}
                onValueChange={(val) =>
                  setValue("country", val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
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
