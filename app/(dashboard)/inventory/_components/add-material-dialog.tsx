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
import { mockCategories, mockUnits } from "@/lib/mock/inventory";

interface AddMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMaterialDialog({
  open,
  onOpenChange,
}: AddMaterialDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = name.trim() && category && unit;

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
    setName("");
    setCategory("");
    setUnit("");
    setDescription("");
    setStock("");
    setReorderLevel("");
    setPrice("");
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: submit material to backend
    console.log({
      name,
      category,
      unit,
      description,
      stock,
      reorderLevel,
      price,
      file,
    });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-[#0F172A]">
            Add material
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Add a new material to your inventory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="mat-name"
              className="text-sm text-brand-description font-medium"
            >
              Name
            </Label>
            <Input
              id="mat-name"
              placeholder="e.g., A4 paper"
              className="placeholder:text-[#94A3B8]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-brand-description font-medium">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-brand-description font-medium">
                Unit of measure
              </Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {mockUnits.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="mat-desc"
              className="text-sm text-brand-description font-medium"
            >
              Description
            </Label>
            <Textarea
              id="mat-desc"
              placeholder="Brief description of this material..."
              className="placeholder:text-[#94A3B8]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Stock / Reorder / Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="mat-stock"
                className="text-sm text-brand-description font-medium"
              >
                Stock
              </Label>
              <Input
                id="mat-stock"
                type="number"
                min={0}
                placeholder="0"
                className="placeholder:text-[#94A3B8]"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="mat-reorder"
                className="text-sm text-brand-description font-medium"
              >
                Reorder level
              </Label>
              <Input
                id="mat-reorder"
                type="number"
                min={0}
                placeholder="10"
                className="placeholder:text-[#94A3B8]"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="mat-price"
                className="text-sm text-brand-description font-medium"
              >
                Price per unit
              </Label>
              <Input
                id="mat-price"
                placeholder="NGN 0.00"
                className="placeholder:text-[#94A3B8]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div className="space-y-2">
            <Label className="text-sm text-brand-description font-medium">
              Attach image
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
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed sm:px-6 py-8 transition-colors ${
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
                  PNG, JPG, PDF up to 10MB
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
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
