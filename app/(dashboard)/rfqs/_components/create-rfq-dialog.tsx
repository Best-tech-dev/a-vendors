"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, Star, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { inventoryApi } from "@/lib/api/inventory";
import { vendorsApi } from "@/lib/api/vendors";
import { rfqsApi } from "@/lib/api/rfqs";
import type { Material } from "@/types/inventory";
import type { Vendor } from "@/types/vendor";
import { mockUnits } from "@/lib/mock/inventory";

interface RFQItemDraft {
  id: string;
  materialId: string;
  materialName: string;
  quantity: string;
  unit: string;
  budget: string;
}

interface CreateRFQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRFQDialog({ open, onOpenChange }: CreateRFQDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data from backend
  const [materials, setMaterials] = useState<Material[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Step 1 state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [currentMaterialId, setCurrentMaterialId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [currentUnit, setCurrentUnit] = useState("");
  const [currentBudget, setCurrentBudget] = useState("");
  const [items, setItems] = useState<RFQItemDraft[]>([]);

  // Step 2 state
  const [vendorSearch, setVendorSearch] = useState("");
  const [selectedVendorIds, setSelectedVendorIds] = useState<Set<string>>(
    new Set(),
  );
  const [sendToAll, setSendToAll] = useState(false);

  // Fetch materials and vendors when dialog opens
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

  const fetchVendors = useCallback(async () => {
    try {
      const res = await vendorsApi.getAll({ limit: 100 });
      setVendors(res.data.data.items);
    } catch {
      toast.error("Failed to load vendors");
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchMaterials();
      fetchVendors();
    }
  }, [open, fetchMaterials, fetchVendors]);

  const filteredVendors = useMemo(() => {
    if (!vendorSearch.trim()) return vendors;
    const q = vendorSearch.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q),
    );
  }, [vendorSearch, vendors]);

  const canAddItem =
    currentMaterialId && currentQuantity && currentUnit && currentBudget;
  const canContinue =
    title.trim() && dueDate && (items.length > 0 || canAddItem);
  const canSendRequest = selectedVendorIds.size > 0 || sendToAll;

  const selectedMaterial = materials.find((m) => m.id === currentMaterialId);

  const handleAddItem = () => {
    if (!canAddItem || !selectedMaterial) return;
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        materialId: selectedMaterial.id,
        materialName: selectedMaterial.name,
        quantity: currentQuantity,
        unit: currentUnit,
        budget: currentBudget,
      },
    ]);
    setCurrentMaterialId("");
    setCurrentQuantity("");
    setCurrentUnit("");
    setCurrentBudget("");
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleVendor = (id: string) => {
    if (sendToAll) return;
    setSelectedVendorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSendToAllChange = (checked: boolean) => {
    setSendToAll(checked);
    if (checked) {
      setSelectedVendorIds(new Set(vendors.map((v) => v.id)));
    } else {
      setSelectedVendorIds(new Set());
    }
  };

  const handleSendRequest = async () => {
    if (!canSendRequest || !dueDate) return;

    // Auto-add current item if fields are filled
    let finalItems = [...items];
    if (canAddItem && selectedMaterial) {
      finalItems = [
        ...finalItems,
        {
          id: `item-${Date.now()}`,
          materialId: selectedMaterial.id,
          materialName: selectedMaterial.name,
          quantity: currentQuantity,
          unit: currentUnit,
          budget: currentBudget,
        },
      ];
    }

    if (finalItems.length === 0) {
      toast.error("At least one item is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await rfqsApi.create({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate.toISOString(),
        unit: finalItems[0].unit,
        items: finalItems.map((item) => ({
          materialId: item.materialId,
          quantity: Number(item.quantity),
          budget: Number(item.budget),
        })),
        vendorIds: sendToAll ? [] : Array.from(selectedVendorIds),
        sendToAllVendors: sendToAll,
      });
      toast.success("RFQ created successfully");
      resetForm();
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setDueDateOpen(false);
    setCurrentMaterialId("");
    setCurrentQuantity("");
    setCurrentUnit("");
    setCurrentBudget("");
    setItems([]);
    setVendorSearch("");
    setSelectedVendorIds(new Set());
    setSendToAll(false);
  };

  const formatCurrency = (val: string) => {
    const num = Number(val);
    if (isNaN(num) || num === 0) return "";
    return `₦${num.toLocaleString("en-NG")}`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) resetForm();
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col overflow-visible">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-brand-title">
            {step === 1 ? "Request a Quote" : "Select Vendors to Quote"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-brand-description">
            {step === 1
              ? "Fill in the details and add items for your RFQ."
              : "Update your workspace info"}
          </DialogDescription>
        </DialogHeader>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto space-y-5 min-h-0 px-1">
            {/* RFQ Title */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-brand-description">
                RFQ Title
              </Label>
              <Input
                placeholder="e.g., Textbook production"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-brand-description">
                Description
              </Label>
              <Textarea
                placeholder="e.g., Need materials for Q2 textbook run"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Due date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-brand-description">
                Due date
              </Label>
              <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal text-gray-600"
                  >
                    <CalendarIcon className="mr-2 size-4 text-gray-400" />
                    {dueDate
                      ? dueDate.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    defaultMonth={dueDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDueDate(date);
                      setDueDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Items Required */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold text-brand-description">
                  Items Required
                </Label>
                <Button
                  size="sm"
                  onClick={handleAddItem}
                  disabled={!canAddItem}
                >
                  + Add another item
                </Button>
              </div>

              <div className="space-y-3">
                {/* Material */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-brand-description">
                    Material
                  </Label>
                  <Select
                    value={currentMaterialId}
                    onValueChange={(value) => {
                      setCurrentMaterialId(value);
                      const mat = materials.find((m) => m.id === value);
                      if (mat?.unit) setCurrentUnit(mat.unit);
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
                </div>

                {/* Quantity / Unit / Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-brand-description">
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="100"
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-brand-description">
                      Unit
                    </Label>
                    <Select value={currentUnit} onValueChange={setCurrentUnit}>
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
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-brand-description">
                      Budget
                    </Label>
                    <Input
                      placeholder="NGN 0.00"
                      value={currentBudget}
                      onChange={(e) => setCurrentBudget(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Added items list */}
            {items.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold text-brand-description">
                    Items added
                  </Label>
                  <span className="text-xs text-brand-description">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-brand-description">
                          {item.materialName}
                        </p>
                        <p className="text-xs text-brand-description mt-0.5">
                          Qty: {item.quantity} &nbsp;·&nbsp; Unit: {item.unit}{" "}
                          &nbsp;·&nbsp; Budget: {formatCurrency(item.budget)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-1">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (canAddItem) handleAddItem();
                  setStep(2);
                }}
                disabled={!canContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4 px-1 pt-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search vendors and click to add"
                className="pl-9"
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
              />
            </div>

            {/* Send to all */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="send-all"
                checked={sendToAll}
                onCheckedChange={(checked) =>
                  handleSendToAllChange(checked === true)
                }
              />
              <Label
                htmlFor="send-all"
                className="text-sm cursor-pointer select-none"
              >
                Send to all vendors
              </Label>
            </div>

            {/* Selected vendors */}
            {filteredVendors.filter(
              (v) => sendToAll || selectedVendorIds.has(v.id),
            ).length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Selected vendors
                </p>
                <div className="space-y-1">
                  {filteredVendors
                    .filter((v) => sendToAll || selectedVendorIds.has(v.id))
                    .map((vendor) => (
                      <div
                        key={vendor.id}
                        className="flex items-center gap-3 rounded-lg p-3 bg-gray-50 border border-gray-100 cursor-pointer"
                        onClick={() => {
                          if (!sendToAll) toggleVendor(vendor.id);
                        }}
                      >
                        <Checkbox
                          checked
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={() => {
                            if (!sendToAll) toggleVendor(vendor.id);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {vendor.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {vendor.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {vendor.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Unselected vendors */}
            {!sendToAll &&
              filteredVendors.filter((v) => !selectedVendorIds.has(v.id))
                .length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    All vendors
                  </p>
                  <div className="space-y-1">
                    {filteredVendors
                      .filter((v) => !selectedVendorIds.has(v.id))
                      .map((vendor) => (
                        <div
                          key={vendor.id}
                          className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleVendor(vendor.id)}
                        >
                          <Checkbox
                            checked={false}
                            onClick={(e) => e.stopPropagation()}
                            onCheckedChange={() => toggleVendor(vendor.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {vendor.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {vendor.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium text-gray-700">
                              {vendor.rating}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Empty state for step 2 */}
            {filteredVendors.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Image
                  src="/svgs/search_empty.svg"
                  alt="No results"
                  width={60}
                  height={60}
                  className="mb-3"
                />
                <p className="text-sm text-gray-500">
                  No vendors match your search
                </p>
              </div>
            )}

            {selectedVendorIds.size === 0 &&
              !sendToAll &&
              filteredVendors.length > 0 && (
                <div className="flex flex-col items-center py-6 -mt-2">
                  <p className="text-xs text-gray-400">
                    Click on vendors above to select them
                  </p>
                </div>
              )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-1 mt-auto">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                onClick={handleSendRequest}
                disabled={!canSendRequest || isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sending Request
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
