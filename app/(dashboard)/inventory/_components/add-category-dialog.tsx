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
import { Textarea } from "@/components/ui/textarea";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
}: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isValid = name.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: submit category to backend
    console.log({ name, description });
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold">
            Add Category
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Create a new material category for your inventory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="cat-name" className="text-sm font-medium">
              Category Name
            </Label>
            <Input
              id="cat-name"
              placeholder="e.g., Raw materials"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="cat-desc"
              placeholder="Brief description of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
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
              Create category
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
