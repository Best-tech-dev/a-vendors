"use client";

import { useEffect, useMemo, useState } from "react";
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
import { rfqsApi } from "@/lib/api/rfqs";
import type { VendorQuotePaymentPlan } from "@/types/rfq";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaymentPlanValue {
  paymentPlanId: string;
}

interface PaymentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when the user presses Save. The parent drives the async work and
   *  should call onOpenChange(false) when done. */
  onSave: (value: PaymentPlanValue) => void | Promise<void>;
  /** While the parent is submitting, pass true to disable the Save button */
  isSubmitting?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PaymentPlanDialog({
  open,
  onOpenChange,
  onSave,
  isSubmitting = false,
}: PaymentPlanDialogProps) {
  const [paymentPlanId, setPaymentPlanId] = useState("");
  const [plans, setPlans] = useState<VendorQuotePaymentPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return; // Don't close while submission is in-flight
    setPaymentPlanId("");
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!paymentPlanId) {
      toast.error("Please select a payment plan.");
      return;
    }
    // Delegate the async work to the parent; parent calls onOpenChange(false) on success
    await onSave({ paymentPlanId });
  };

  useEffect(() => {
    if (!open) return;
    // Reset selection whenever dialog reopens
    setPaymentPlanId("");

    // Only fetch if we haven't loaded plans yet
    if (plans.length > 0) return;
    setIsLoadingPlans(true);
    rfqsApi
      .getVendorQuotePaymentPlans()
      .then(({ data }) => {
        setPlans(data.data);
      })
      .catch(() => {
        toast.error("Could not load payment plans. Please try again.");
      })
      .finally(() => {
        setIsLoadingPlans(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === paymentPlanId),
    [paymentPlanId, plans],
  );

  const isBusy = isLoadingPlans || isSubmitting;

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
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Payment plan
            </Label>
            <Select
              value={paymentPlanId}
              onValueChange={setPaymentPlanId}
              disabled={isBusy}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingPlans ? "Loading payment plans…" : "Select plan"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPlan && (
              <span className="inline-block rounded-full border border-gray-200 bg-white px-3 py-0.5 text-sm text-brand-title">
                {selectedPlan.code}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={isBusy || !paymentPlanId}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Submitting…" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
