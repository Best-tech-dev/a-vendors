"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import { InvoiceListTable } from "./_components/invoice-list-table";
import { InvoiceDetailsSheet } from "./_components/invoice-details-sheet";
import { ApprovePaymentDialog } from "./_components/approve-payment-dialog";
import { UploadInvoiceDialog } from "./_components/upload-invoice-dialog";
import { mockInvoices } from "@/lib/mock/invoices";
import type { Invoice } from "@/types/invoice";
import Image from "next/image";

export default function InvoicesPage() {
  // Toggle this to see the empty state
  const [isEmpty] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [approveInvoice, setApproveInvoice] = useState<Invoice | null>(null);

  const invoices = isEmpty ? [] : mockInvoices;

  const totalInvoices = invoices.length;
  const pending = invoices.filter((i) => i.status === "Pending");
  const approved = invoices.filter((i) => i.status === "Approved");
  const exception = invoices.filter((i) => i.status === "Exception");

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setSheetOpen(true);
  };

  const handleApproveFromSheet = (invoice: Invoice) => {
    setSheetOpen(false);
    setApproveInvoice(invoice);
    setApproveOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-title">Invoices</h1>
          <p className="text-sm text-brand-description">
            Reconciliation and payment processing
          </p>
        </div>
        <Button
          className="w-fit bg-brand-primary"
          onClick={() => setUploadOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No materials found"
            description="Add materials to your inventory catalog"
            actionLabel="Upload invoice"
            onAction={() => setUploadOpen(true)}
            image={
              <Image
                src="/svgs/empty-inbox-with-shadow.svg"
                alt="No invoices"
                width={100}
                height={100}
              />
            }
          />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard value={totalInvoices} label="Total Invoices" />
            <StatsCard value={pending.length} label="Pending" />
            <StatsCard value={approved.length} label="Approved" />
            <StatsCard value={exception.length} label="Exception" />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <InvoiceListTable
              invoices={invoices}
              onRowClick={handleRowClick}
            />
          </div>
        </>
      )}

      {/* Upload Invoice Dialog */}
      <UploadInvoiceDialog open={uploadOpen} onOpenChange={setUploadOpen} />

      {/* Invoice Details Sheet */}
      <InvoiceDetailsSheet
        invoice={selectedInvoice}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onApprove={handleApproveFromSheet}
      />

      {/* Approve Payment Dialog */}
      <ApprovePaymentDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        invoice={approveInvoice}
      />
    </div>
  );
}
