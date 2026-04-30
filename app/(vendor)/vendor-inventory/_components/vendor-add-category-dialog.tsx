"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "@/lib/validations/inventory";
import { inventoryApi } from "@/lib/api/inventory";

interface VendorAddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function VendorAddCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: VendorAddCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "", description: "" },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: CreateCategoryFormValues) => {
    try {
      await inventoryApi.createVendorCategory(values);
      toast.success("Category created successfully");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      if (status === 409) {
        toast.error("A category with this name already exists.");
      } else if (status === 422 || status === 400) {
        toast.error(serverMessage ?? "Please check your inputs and try again.");
      } else if (status === 403) {
        toast.error("You don't have permission to create categories.");
      } else if (!axiosError.response) {
        toast.error("Network error — please check your connection and retry.");
      } else {
        toast.error(serverMessage ?? "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-[#0F172A]">
            Add Category
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Create a new material category
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label
              htmlFor="vendor-cat-name"
              className="text-sm text-brand-description font-medium"
            >
              Category Name
            </Label>
            <Input
              id="vendor-cat-name"
              placeholder="e.g., Raw materials"
              className="placeholder:text-[#94A3B8]"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="vendor-cat-desc"
              className="text-sm text-brand-description font-medium"
            >
              Description
            </Label>
            <Textarea
              id="vendor-cat-desc"
              placeholder="Brief description of this category..."
              className="placeholder:text-[#94A3B8]"
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

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
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
