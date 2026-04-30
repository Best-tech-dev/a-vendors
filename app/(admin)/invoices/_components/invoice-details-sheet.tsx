"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

interface InvoiceDetailsSheetProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (invoice: Invoice) => void;
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config: Record<InvoiceStatus, { bg: string; text: string }> = {
    Approved: {
      bg: "bg-badge-green-accent",
      text: "text-badge-green",
    },
    Pending: {
      bg: "bg-badge-yellow-accent",
      text: "text-badge-yellow",
    },
    Exception: {
      bg: "bg-badge-red-accent",
      text: "text-badge-red",
    },
  };
  const c = config[status];

  const labelMap: Record<InvoiceStatus, string> = {
    Approved: "Approved",
    Pending: "Awaiting approval",
    Exception: "Exception",
  };

  return (
    <span
      className={`ml-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {labelMap[status]}
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        className="ml-0.5"
      >
        <path
          d="M2.5 4L5 6.5L7.5 4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export function InvoiceDetailsSheet({
  invoice,
  open,
  onOpenChange,
  onApprove,
}: InvoiceDetailsSheetProps) {
  if (!invoice) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto p-4 sm:max-w-lg sm:p-8">
        <SheetHeader className="p-0 pb-4">
          <div>
            <div className="flex items-center">
              <SheetTitle className="text-xl font-bold text-brand-title">
                {invoice.invoiceNumber}
              </SheetTitle>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="mt-0.5 text-sm text-brand-description">
              Created: {invoice.createdDate}
            </p>
          </div>
        </SheetHeader>

        {/* Details Grid */}
        <div className="rounded-lg border border-gray-200 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <span className="text-xs text-brand-description">Vendor</span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {invoice.vendor}
              </p>
            </div>
            <div>
              <span className="text-xs text-brand-description">
                Total Amount
              </span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {formatCurrency(invoice.amount)}
              </p>
            </div>
            <div>
              <span className="text-xs text-brand-description">
                PO Reference
              </span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {invoice.poReference}
              </p>
            </div>
          </div>
        </div>

        {/* Vendor Bank Details */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-[#FAFBFC] p-5">
          <h3 className="mb-4 text-sm font-semibold text-brand-title">
            Vendor Bank Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs text-brand-description">Bank</span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {invoice.vendorBankDetails.bank}
              </p>
            </div>
            <div>
              <span className="text-xs text-brand-description">
                Account Number:
              </span>
              <p className="mt-0.5 text-sm font-semibold text-brand-title">
                {invoice.vendorBankDetails.accountNumber}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-brand-description">
              Account Name:
            </span>
            <p className="mt-0.5 text-sm font-semibold text-brand-title">
              {invoice.vendorBankDetails.accountName}
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <span className="text-xs text-brand-description">Notes:</span>
          <p className="mt-1 text-sm text-brand-title">{invoice.notes}</p>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Approve Button */}
        {invoice.status === "Pending" && (
          <div className="mt-8">
            <Button
              className="w-full bg-brand-primary py-6 text-base font-medium hover:bg-brand-primary/90"
              onClick={() => onApprove(invoice)}
            >
              Approve invoice
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
