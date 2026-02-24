"use client";

import { useState, useMemo } from "react";
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
import { Search, Star, Trash2, Users } from "lucide-react";
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
  const [dueDate, setDueDate] = useState("");
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
  const canContinue = title.trim() && dueDate && items.length > 0;
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
    setDueDate("");
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {step === 1 ? "Request a Quote" : "Select Vendors to Quote"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            {step === 1
              ? "Fill in the details and add items for your RFQ."
              : "Search and select vendors to send this RFQ to."}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 py-1">
          <div
            className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-gray-900" : "bg-gray-200"}`}
          />
          <div
            className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-gray-900" : "bg-gray-200"}`}
          />
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto space-y-5 min-h-0 pr-1">
            {/* RFQ Title */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
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
              <Label className="text-sm font-semibold text-gray-700">
                Due date
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-gray-600"
              />
            </div>

            {/* Items Required */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold text-gray-700">
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

              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                {/* Material */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">
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
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">
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
                    <Label className="text-xs font-semibold text-gray-600">
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
                    <Label className="text-xs font-semibold text-gray-600">
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
                  <Label className="text-sm font-semibold text-gray-700">
                    Items added
                  </Label>
                  <span className="text-xs text-gray-500">
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
                        <p className="text-sm font-semibold text-gray-800">
                          {item.material}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
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
              <Button onClick={() => setStep(2)} disabled={!canContinue}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4 pr-1">
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
                      className="flex items-center gap-3 rounded-lg p-3 bg-gray-50 border border-gray-100"
                    >
                      <Checkbox
                        checked
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
                  <div className="rounded-full bg-gray-100 p-4 mb-3">
                    <Users className="size-8 text-gray-400" />
                  </div>
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
