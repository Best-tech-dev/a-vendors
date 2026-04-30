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
import type { Invoice } from "@/types/invoice";

interface ApprovePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

const currencies = [
  { code: "NGN", flag: "🇳🇬" },
  { code: "USD", flag: "🇺🇸" },
  { code: "GBP", flag: "🇬🇧" },
  { code: "EUR", flag: "🇪🇺" },
];

export function ApprovePaymentDialog({
  open,
  onOpenChange,
  invoice,
}: ApprovePaymentDialogProps) {
  const [paymentPlan, setPaymentPlan] = useState("full");
  const [currency, setCurrency] = useState("NGN");
  const [amount, setAmount] = useState("");
  const [installmentCount, setInstallmentCount] = useState("");

  const selectedCurrency = currencies.find((c) => c.code === currency)!;

  // Pre-fill amount when invoice changes
  const displayAmount = amount || (invoice ? invoice.amount.toLocaleString("en-NG") : "");

  const resetForm = () => {
    setPaymentPlan("full");
    setCurrency("NGN");
    setAmount("");
    setInstallmentCount("");
  };

  const handleSubmit = () => {
    // TODO: submit approval to backend
    console.log({
      invoiceId: invoice?.id,
      paymentPlan,
      currency,
      amount: displayAmount,
      installmentCount: paymentPlan === "partial" ? installmentCount : undefined,
    });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-brand-title">
            Approve payment
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description">
            Complete payment details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Payment plan */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Payment plan
            </Label>
            <Select value={paymentPlan} onValueChange={setPaymentPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full payment</SelectItem>
                <SelectItem value="partial">Partial payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Installment count - only for partial payment */}
          {paymentPlan === "partial" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-brand-description">
                How many time would you like to make payment
              </Label>
              <Input
                type="number"
                min={2}
                placeholder="Minimum of 2 times"
                value={installmentCount}
                onChange={(e) => setInstallmentCount(e.target.value)}
              />
            </div>
          )}

          {/* Amount with Currency Prefix */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-description">
              Amount
            </Label>
            <div className="flex items-center rounded-md border border-gray-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              {/* Currency Selector */}
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

              {/* Amount Input */}
              <Input
                type="text"
                placeholder="0.00"
                className="flex-1 rounded-none rounded-r-md border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={displayAmount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
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
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              Approve payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
