"use client";

import { useState } from "react";
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

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Electronics & Components",
  "Raw Materials",
  "Office Supplies",
  "Packaging",
  "Logistics",
];

export function AddVendorDialog({ open, onOpenChange }: AddVendorDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");

  const isValid = name.trim() && category && email.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: submit vendor to backend
    console.log({ name, category, email });
    setName("");
    setCategory("");
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-brand-title">
            Add New Vendor
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Fill in the details below to get your supplier into the system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
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

          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              Add vendor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
