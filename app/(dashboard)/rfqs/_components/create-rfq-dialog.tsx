"use client";

import { useState, useMemo } from "react";
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
import { CalendarIcon, Search, Star, Trash2 } from "lucide-react";
import { selectableVendors } from "@/lib/mock/rfqs";
import { mockCategories, mockUnits } from "@/lib/mock/inventory";

interface RFQItemDraft {
  id: string;
  material: string;
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

  // Step 1 state
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState("");
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

  const canAddItem =
    currentMaterial && currentQuantity && currentUnit && currentBudget;
  const canContinue =
    title.trim() && dueDate && (items.length > 0 || canAddItem);
  const canSendRequest = selectedVendorIds.size > 0 || sendToAll;

  const filteredVendors = useMemo(() => {
    if (!vendorSearch.trim()) return selectableVendors;
    const q = vendorSearch.toLowerCase();
    return selectableVendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q),
    );
  }, [vendorSearch]);

  const handleAddItem = () => {
    if (!canAddItem) return;
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        material: currentMaterial,
        quantity: currentQuantity,
        unit: currentUnit,
        budget: currentBudget,
      },
    ]);
    setCurrentMaterial("");
    setCurrentQuantity("");
    setCurrentUnit("");
    setCurrentBudget("");
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleVendor = (id: string) => {
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
      setSelectedVendorIds(new Set(selectableVendors.map((v) => v.id)));
    } else {
      setSelectedVendorIds(new Set());
    }
  };

  const handleSendRequest = () => {
    if (!canSendRequest) return;
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setDueDate(undefined);
    setDueDateOpen(false);
    setCurrentMaterial("");
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

  const selectedVendorsList = filteredVendors.filter(
    (v) => sendToAll || selectedVendorIds.has(v.id),
  );
  const unselectedVendorsList = sendToAll
    ? []
    : filteredVendors.filter((v) => !selectedVendorIds.has(v.id));

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
              : "Search and select vendors to send this RFQ to."}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator removed */}

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
                    value={currentMaterial}
                    onValueChange={setCurrentMaterial}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select material" />
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
                          {item.material}
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
                placeholder="Search vendors..."
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
            {selectedVendorsList.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Selected vendors
                </p>
                <div className="space-y-1">
                  {selectedVendorsList.map((vendor) => (
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
                          {vendor.category}
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
            {unselectedVendorsList.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  All vendors
                </p>
                <div className="space-y-1">
                  {unselectedVendorsList.map((vendor) => (
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
                          {vendor.category}
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
            {selectedVendorsList.length === 0 &&
              unselectedVendorsList.length === 0 && (
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

            {selectedVendorsList.length === 0 &&
              !sendToAll &&
              unselectedVendorsList.length > 0 && (
                <div className="flex flex-col items-center py-6 -mt-2">
                  <p className="text-xs text-gray-400">
                    Click on vendors above to select them
                  </p>
                </div>
              )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-1 mt-auto">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSendRequest} disabled={!canSendRequest}>
                Send Request
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
