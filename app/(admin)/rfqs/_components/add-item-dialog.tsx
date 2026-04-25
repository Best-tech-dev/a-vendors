"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { rfqsApi } from "@/lib/api/rfqs";
import { inventoryApi } from "@/lib/api/inventory";
import { addRFQItemSchema } from "@/lib/validations/rfq";
import { mockUnits } from "@/lib/mock/inventory";
import type { Material } from "@/types/inventory";
import type { CreateRFQResponseItem } from "@/types/rfq";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfqId: string;
  onSuccess?: (newItem: CreateRFQResponseItem) => void;
}

export function AddItemDialog({
  open,
  onOpenChange,
  rfqId,
  onSuccess,
}: AddItemDialogProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchMaterials = useCallback(async () => {
    setLoadingMaterials(true);
    try {
      const res = await inventoryApi.getMaterials({ limit: 100 });
      setMaterials(res.data.data.items);
    } catch {
      toast.error("Failed to load materials");
    } finally {
      setLoadingMaterials(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchMaterials();
      // Reset form on open
      setMaterialId("");
      setQuantity("");
      setUnit("");
      setBudget("");
      setDescription("");
      setErrors({});
    }
  }, [open, fetchMaterials]);

  const handleSubmit = async () => {
    const payload = {
      materialId,
      quantity: Number(quantity),
      budget: Number(budget),
      description: description.trim() || undefined,
    };

    const result = addRFQItemSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await rfqsApi.addItem(rfqId, result.data);
      toast.success("Item added successfully");
      onSuccess?.(res.data.data);
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (!axiosError.response) {
        toast.error("Network error — please check your connection and retry.");
      } else {
        toast.error(
          axiosError.response.data?.message ??
            "Could not add item. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Add a new material item to this RFQ. Only draft or sent RFQs can be
            modified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Material */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-brand-description">
              Material
            </Label>
            <Select
              value={materialId}
              onValueChange={(value) => {
                setMaterialId(value);
                const mat = materials.find((m) => m.id === value);
                if (mat?.unit) setUnit(mat.unit);
              }}
              disabled={loadingMaterials}
            >
              <SelectTrigger className="bg-white">
                <SelectValue
                  placeholder={
                    loadingMaterials
                      ? "Loading materials..."
                      : "Select material"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {materials.map((mat) => (
                  <SelectItem key={mat.id} value={mat.id}>
                    {mat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.materialId && (
              <p className="text-xs text-red-500">{errors.materialId}</p>
            )}
          </div>

          {/* Quantity / Unit / Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-brand-description">
                Quantity
              </Label>
              <Input
                type="number"
                min={1}
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-white"
              />
              {errors.quantity && (
                <p className="text-xs text-red-500">{errors.quantity}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-brand-description">
                Unit
              </Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Unit" />
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
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-brand-description">
                Budget
              </Label>
              <Input
                type="number"
                min={1}
                placeholder="750000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-white"
              />
              {errors.budget && (
                <p className="text-xs text-red-500">{errors.budget}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-brand-description">
              Description{" "}
              <span className="font-normal text-brand-muted">(optional)</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Must be 80gsm white, A4 size"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isSubmitting ? "Adding Item" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
