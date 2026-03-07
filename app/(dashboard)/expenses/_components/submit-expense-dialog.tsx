"use client";

import { useState, useCallback, useRef } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { mockDepartments } from "@/lib/mock/expenses";

interface SubmitExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const currencies = [
  { code: "NGN", flag: "🇳🇬" },
  { code: "USD", flag: "🇺🇸" },
  { code: "GBP", flag: "🇬🇧" },
  { code: "EUR", flag: "🇪🇺" },
];

export function SubmitExpenseDialog({
  open,
  onOpenChange,
}: SubmitExpenseDialogProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = title && department && amount;
  const selectedCurrency = currencies.find((c) => c.code === currency)!;

  const handleFile = (f: File) => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(f.type)) {
      toast.error("Unsupported file type", {
        description: "Only PNG, JPG, and PDF files are allowed.",
      });
      return;
    }
    if (f.size > maxSize) {
      toast.error("File too large", {
        description: `"${f.name}" exceeds the 10 MB limit. Please upload a smaller file.`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const resetForm = () => {
    setTitle("");
    setDepartment("");
    setCurrency("NGN");
    setAmount("");
    setDescription("");
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (!isValid) return;
    console.log({ title, department, currency, amount, description, file });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-brand-title">
            Submit New Expense
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Fill in the form below to create a new expense request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Expense Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Expense Title
            </Label>
            <Input
              placeholder="e.g., Transport fare"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Department
            </Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {mockDepartments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount with Currency Prefix */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Amount
            </Label>
            <div className="flex items-center rounded-md border border-gray-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="relative">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="h-10 w-27.5 gap-1 rounded-none rounded-l-md border-0 border-r border-gray-200 bg-transparent shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <span className="flex items-center gap-1.5 text-sm">
                      <span>{selectedCurrency.flag}</span>
                      <span className="font-medium">
                        {selectedCurrency.code}
                      </span>
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                className="flex-1 rounded-none rounded-r-md border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Purpose/Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Purpose/Description
            </Label>
            <Textarea
              placeholder="Brief details about the expense or it's purpose..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Receipt Upload
            </Label>
            {file ? (
              <div className="relative flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-xs font-medium text-gray-500">
                    PDF
                  </div>
                )}
                <div className="flex-1 truncate text-sm text-gray-700">
                  {file.name}
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 transition-colors ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <Upload className="h-5 w-5 text-[#1B2232]" />
                <p className="mt-3 text-sm text-brand-title">
                  <span className="font-semibold text-brand-title">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="mt-1 text-xs text-brand-description">
                  Supports PNG, PDF, JPEG up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              Submit Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
