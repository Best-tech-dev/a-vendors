"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { AxiosError } from "axios";
import { vendorsApi } from "@/lib/api/vendors";
import type { VendorCategory } from "@/types/vendor";

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddVendorDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddVendorDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories from backend
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setCategoriesLoading(true);
    vendorsApi
      .getCategories()
      .then((res) => {
        if (!cancelled) setCategories(res.data.data);
      })
      .catch(() => {
        if (!cancelled)
          toast.error("Could not load categories. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const isValid =
    name.trim() &&
    category &&
    email.trim() &&
    phone.trim() &&
    city.trim() &&
    country.trim() &&
    status;

  const resetForm = () => {
    setName("");
    setCategory("");
    setEmail("");
    setPhone("");
    setCity("");
    setCountry("");
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await vendorsApi.create({
        name,
        category,
        email,
        phone,
        city,
        country,
        status,
      });
      toast.success("Vendor created successfully");
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const statusCode = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      if (statusCode === 409) {
        toast.error("A vendor with this name or email already exists.");
      } else if (statusCode === 400 || statusCode === 422) {
        toast.error(serverMessage ?? "Please check your inputs and try again.");
      } else if (statusCode === 403) {
        toast.error("You don't have permission to add vendors.");
      } else if (!axiosError.response) {
        toast.error("Network error — please check your connection and retry.");
      } else {
        toast.error(serverMessage ?? "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-brand-title">
            Add New Vendor
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Fill in the details below to get your supplier into the system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="vendor-name"
              className="text-sm font-medium text-brand-description"
            >
              Vendor Company Name
            </Label>
            <Input
              id="vendor-name"
              placeholder="e.g., Global Pallet Solutions"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    categoriesLoading ? "Loading…" : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="vendor-email"
              className="text-sm font-medium text-brand-description"
            >
              Contact Email
            </Label>
            <Input
              id="vendor-email"
              type="email"
              placeholder="e.g., globalpallet@solutions.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="vendor-phone"
              className="text-sm font-medium text-brand-description"
            >
              Phone Number
            </Label>
            <Input
              id="vendor-phone"
              type="tel"
              placeholder="e.g., +2348161252897"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="vendor-city"
                className="text-sm font-medium text-brand-description"
              >
                City
              </Label>
              <Input
                id="vendor-city"
                placeholder="e.g., Lagos"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="vendor-country"
                className="text-sm font-medium text-brand-description"
              >
                Country
              </Label>
              <Input
                id="vendor-country"
                placeholder="e.g., Nigeria"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Add vendor"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
