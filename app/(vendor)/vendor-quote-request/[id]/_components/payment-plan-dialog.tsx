"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaymentPlanValue {
  plan: string;
  proofFile: File | null;
}

interface PaymentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: PaymentPlanValue) => void;
}

// ---------------------------------------------------------------------------
// Static options
// ---------------------------------------------------------------------------

const PAYMENT_PLANS = [
  { value: "100", label: "100% upfront" },
  { value: "50_50", label: "50% upfront, 50% on delivery" },
  { value: "30_70", label: "30% upfront, 70% on delivery" },
  { value: "on_delivery", label: "100% on delivery" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PaymentPlanDialog({
  open,
  onOpenChange,
  onSave,
}: PaymentPlanDialogProps) {
  const [plan, setPlan] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const maxSize = 10 * 1024 * 1024;
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(f.type)) {
      toast.error("Only PNG, PDF, JPEG files are allowed.");
      return;
    }
    if (f.size > maxSize) {
      toast.error(`"${f.name}" exceeds the 10 MB limit.`);
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

  const handleClose = () => {
    setPlan("");
    setFile(null);
    setPreview(null);
    onOpenChange(false);
  };

  const handleSave = () => {
    if (!plan) {
      toast.error("Please select a payment plan.");
      return;
    }
    onSave({ plan, proofFile: file });
    handleClose();
  };

  // Derive the percentage chip from the selected plan
  const chipLabel = PAYMENT_PLANS.find((p) => p.value === plan)?.value.split(
    "_",
  )[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-brand-title">
            Payment plan
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Select preferred payment plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Payment plan select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Payment plan
            </Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_PLANS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Percentage chip */}
            {chipLabel && (
              <span className="inline-block rounded-full border border-gray-200 bg-white px-3 py-0.5 text-sm text-brand-title">
                {chipLabel}
              </span>
            )}
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Attach payment proof
            </Label>

            {file ? (
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
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                )}
              >
                <Upload className="h-5 w-5 text-brand-title" />
                <p className="mt-3 text-sm text-brand-title">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="mt-1 text-xs text-brand-description">
                  Supports PNG, PDF, JPEG up to 10MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.pdf,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
