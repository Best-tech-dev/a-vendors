"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  createVendorSchema,
  type CreateVendorFormValues,
} from "@/lib/validations/vendor";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateVendorFormValues>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      name: "",
      category: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      status: "",
    },
  });

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

  const handleSubmit = async (values: CreateVendorFormValues) => {
    setIsSubmitting(true);
    try {
      await vendorsApi.create(values);
      toast.success("Vendor created successfully");
      form.reset();
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

        <Form formState={form.formState}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 pt-2"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Global Pallet Solutions"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            categoriesLoading ? "Loading…" : "Select a category"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g., globalpallet@solutions.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="e.g., 08161252897"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nigeria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Add vendor"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
