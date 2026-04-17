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
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { vendorsApi } from "@/lib/api/vendors";
import { rfqsApi } from "@/lib/api/rfqs";
import type { Vendor } from "@/types/vendor";
import type { CreateRFQResponseVendor } from "@/types/rfq";

interface ManageVendorsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfqId: string;
  currentVendors: CreateRFQResponseVendor[];
  onSuccess: (updatedVendors: CreateRFQResponseVendor[]) => void;
}

export function ManageVendorsDialog({
  open,
  onOpenChange,
  rfqId,
  currentVendors,
  onSuccess,
}: ManageVendorsDialogProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");
  const [selectedVendorIds, setSelectedVendorIds] = useState<Set<string>>(
    new Set(),
  );
  const [sendToAll, setSendToAll] = useState(false);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vendorsApi.getAll({ limit: 100 });
      setVendors(res.data.data.items);
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch vendors and pre-select current ones when dialog opens
  useEffect(() => {
    if (open) {
      fetchVendors();
      setSelectedVendorIds(new Set(currentVendors.map((v) => v.vendorId)));
      setSendToAll(false);
      setVendorSearch("");
    }
  }, [open, fetchVendors, currentVendors]);

  const filteredVendors = useMemo(() => {
    if (!vendorSearch.trim()) return vendors;
    const q = vendorSearch.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q),
    );
  }, [vendorSearch, vendors]);

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
      // Restore to current vendors only
      setSelectedVendorIds(new Set(currentVendors.map((v) => v.vendorId)));
    }
  };

  const canSave = selectedVendorIds.size > 0 || sendToAll;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSubmitting(true);
    try {
      const res = await rfqsApi.assignVendors(rfqId, {
        vendorIds: sendToAll ? [] : Array.from(selectedVendorIds),
        sendToAllVendors: sendToAll,
      });
      toast.success(res.data.message ?? "Vendors updated");
      onSuccess(res.data.data);
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ??
        "Failed to update vendors. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Vendors</DialogTitle>
          <DialogDescription>
            Select which vendors should receive this RFQ.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-brand-muted" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4 px-1 pt-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search vendors by name or email"
                className="pl-9"
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
              />
            </div>

            {/* Send to all */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="manage-send-all"
                checked={sendToAll}
                onCheckedChange={(checked) =>
                  handleSendToAllChange(checked === true)
                }
              />
              <Label
                htmlFor="manage-send-all"
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

            {/* Empty state */}
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

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-1 mt-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!canSave || isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                )}
                Save Vendors
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
