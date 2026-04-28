"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Upload, X, CalendarIcon } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { profileApi } from "@/lib/api/profile";
import {
  uploadComplianceDocumentSchema,
  type UploadComplianceDocumentFormValues,
} from "@/lib/validations/vendor";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormValues = UploadComplianceDocumentFormValues;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface UploadComplianceDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UploadComplianceDocumentDialog({
  open,
  onOpenChange,
  onSuccess,
}: UploadComplianceDocumentDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(uploadComplianceDocumentSchema),
    defaultValues: {
      documentType: "",
      label: "",
      expiry_date: "",
    },
  });

  const handleFile = (f: File) => {
    const maxSize = 10 * 1024 * 1024;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

    if (!allowed.includes(f.type)) {
      toast.error("Unsupported file type", {
        description: "Only PDF, JPG, and PNG files are allowed.",
      });
      return;
    }
    if (f.size > maxSize) {
      toast.error("File too large", {
        description: `"${f.name}" exceeds the 10 MB limit.`,
      });
      return;
    }

    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setSelectedDate(undefined);
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: FormValues) => {
    if (!file) {
      toast.error("Please upload a document before submitting.");
      return;
    }

    try {
      await profileApi.uploadComplianceDocument({
        file,
        documentType: values.documentType,
        label: values.label,
        expiry_date: values.expiry_date,
      });
      toast.success("Compliance document uploaded successfully");
      handleClose();
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      if (status === 413) {
        toast.error(
          "The uploaded file is too large. Please use a smaller file.",
        );
      } else if (status === 422 || status === 400) {
        toast.error(serverMessage ?? "Please check your inputs and try again.");
      } else if (status === 403) {
        toast.error("You don't have permission to upload documents.");
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
            Upload Compliance Document
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Please ensure your documents are clear, valid, and within the size
            limit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Certificate upload zone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Certificate
            </Label>

            {file ? (
              // File selected — show preview row
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-medium text-gray-500">
                    PDF
                  </div>
                )}
                <p className="flex-1 truncate text-sm text-brand-title">
                  {file.name}
                </p>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ) : (
              // Drop zone
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors",
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                )}
              >
                <Upload className="h-5 w-5 text-brand-title" />
                <p className="mt-3 text-sm text-brand-title">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="mt-1 text-xs text-brand-description">
                  PDF, JPG, PNG up to 10MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label
              htmlFor="documentType"
              className="text-sm font-medium text-brand-description"
            >
              Document Type
            </Label>
            <Input
              id="documentType"
              type="text"
              placeholder="e.g., CAC, TIN, NIN, etc."
              {...register("documentType")}
            />
            {errors.documentType && (
              <p className="text-xs text-red-500">
                {errors.documentType.message}
              </p>
            )}
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label
              htmlFor="label"
              className="text-sm font-medium text-brand-description"
            >
              Label
            </Label>
            <Input
              id="label"
              type="text"
              placeholder="e.g., Tax ID Certificate, Business Registration"
              {...register("label")}
            />
            {errors.label && (
              <p className="text-xs text-red-500">{errors.label.message}</p>
            )}
          </div>

          {/* Expiry date with calendar */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Expiry Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "relative flex h-10 w-full rounded-[6px] border border-brand-border bg-transparent px-3 py-2 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <span className="flex-1 text-left">
                    {selectedDate
                      ? format(selectedDate, "MMM dd, yyyy")
                      : "Select a date"}
                  </span>
                  <CalendarIcon className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      const dateStr = format(date, "yyyy-MM-dd");
                      setValue("expiry_date", dateStr);
                    }
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {errors.expiry_date && (
              <p className="text-xs text-red-500">
                {errors.expiry_date.message}
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
              disabled={isSubmitting || !file}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
