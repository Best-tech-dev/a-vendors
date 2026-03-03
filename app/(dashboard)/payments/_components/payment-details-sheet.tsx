"use client";

import { useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import type { Payment, PaymentStatus } from "@/types/payment";

interface PaymentDetailsSheetProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const config: Record<PaymentStatus, { bg: string; text: string }> = {
    Approved: {
      bg: "bg-badge-green-accent",
      text: "text-badge-green",
    },
    Pending: {
      bg: "bg-badge-yellow-accent",
      text: "text-badge-yellow",
    },
    Completed: {
      bg: "bg-badge-green-accent",
      text: "text-badge-green",
    },
    Rejected: {
      bg: "bg-badge-red-accent",
      text: "text-badge-red",
    },
  };
  const c = config[status];
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {status}
    </span>
  );
}

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export function PaymentDetailsSheet({
  payment,
  open,
  onOpenChange,
}: PaymentDetailsSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!payment) return null;

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
        description: `"${f.name}" exceeds the 10 MB limit.`,
      });
      return;
    }
    // TODO: Upload file to backend
    console.log("Upload payment proof:", f.name);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-4 sm:max-w-lg sm:p-8">
        <SheetHeader className="p-0 pb-4">
          <div>
            <div className="flex items-center">
              <SheetTitle className="text-xl font-bold text-brand-title">
                {payment.purchaseOrderId}
              </SheetTitle>
              <StatusBadge status={payment.status} />
            </div>
            <p className="mt-0.5 text-sm text-brand-description">
              Created: {payment.createdDate}
            </p>
          </div>
        </SheetHeader>

        {/* Details Grid */}
        <div className="rounded-lg border border-gray-200 p-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-brand-description">Vendor</span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {payment.vendor}
              </p>
            </div>
            <div>
              <span className="text-xs text-brand-description">
                Total Amount
              </span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div>
              <span className="text-xs text-brand-description">Date</span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                Feb 20, 2026
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-brand-description">
                Invoice reference
              </span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {payment.invoiceReference}
              </p>
            </div>
            <div>
              <span className="text-xs text-brand-description">
                Purchase order ID
              </span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {payment.purchaseOrderId}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Pattern / Proof Section */}
        <div className="mt-6">
          <h3 className="text-base font-semibold text-brand-title">
            {payment.installments.length > 0
              ? "Payment pattern"
              : "Payment proof"}
          </h3>

          {payment.installments.length > 0 ? (
            <div className="mt-4 space-y-6">
              {payment.installments.map((installment) => (
                <div key={installment.id}>
                  {/* Amount & Label */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-base font-semibold text-brand-title">
                        {formatCurrency(installment.amount)}
                      </p>
                      <p className="text-sm text-brand-description">
                        {installment.label}
                      </p>
                    </div>

                    {/* Attach proof button (when no proof) */}
                    {!installment.proof && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="h-4 w-4" />
                        Attach payment proof
                      </Button>
                    )}
                  </div>

                  {/* Proof Card */}
                  {installment.proof && (
                    <div className="mt-3 flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {installment.proof.thumbnail ? (
                          <Image
                            src={installment.proof.thumbnail}
                            alt={installment.proof.fileName}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-500">
                            PDF
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-title">
                          {installment.proof.fileName}
                        </p>
                        <p className="text-xs text-brand-description">
                          Added {installment.proof.addedDate} •{" "}
                          {installment.proof.fileSize}
                        </p>
                      </div>
                      <button className="rounded-full p-1.5 hover:bg-gray-100">
                        <MoreHorizontal className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* No installments - simple proof view */
            <div className="mt-4">
              <p className="text-sm text-brand-description">
                No payment proof uploaded yet.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Upload Button */}
        <div className="mt-8">
          <Button
            className="w-full bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload payment proof
          </Button>
        </div>

        {/* Hidden file input */}
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
      </SheetContent>
    </Sheet>
  );
}
