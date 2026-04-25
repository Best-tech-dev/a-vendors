"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import { PaymentListTable } from "./_components/payment-list-table";
import { CreatePaymentDialog } from "./_components/create-payment-dialog";
import { PaymentDetailsSheet } from "./_components/payment-details-sheet";
import { mockPayments } from "@/lib/mock/payments";
import type { Payment } from "@/types/payment";
import Image from "next/image";

export default function PaymentsPage() {
  // Toggle this to see the empty state
  const [isEmpty] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const payments = isEmpty ? [] : mockPayments;

  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const awaitingApproval = payments.filter((p) => p.status === "Approved");
  const awaitingTotal = awaitingApproval.reduce((sum, p) => sum + p.amount, 0);
  const pending = payments.filter((p) => p.status === "Pending");
  const pendingTotal = pending.reduce((sum, p) => sum + p.amount, 0);
  const completed = payments.filter((p) => p.status === "Completed");
  const completedTotal = completed.reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;

  const handleRowClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-title">Payments</h1>
          <p className="text-sm text-brand-description">
            Payment queue and history
          </p>
        </div>
        <Button
          className="w-fit bg-brand-primary"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create payment
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No payment found"
            description="Add payment proof for orders"
            actionLabel="Create payment"
            onAction={() => setCreateOpen(true)}
            image={
              <Image
                src="/svgs/empty-inbox-with-shadow.svg"
                alt="No payments"
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
            <StatsCard
              value={totalPayments}
              label={`Total payment (${formatCurrency(totalAmount)} total)`}
            />
            <StatsCard
              value={awaitingApproval.length}
              label={`Awaiting approval (${formatCurrency(awaitingTotal)} total)`}
            />
            <StatsCard
              value={pending.length}
              label={`Pending (${formatCurrency(pendingTotal)} total)`}
            />
            <StatsCard
              value={completed.length}
              label={`Completed (${formatCurrency(completedTotal)} paid)`}
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <PaymentListTable payments={payments} onRowClick={handleRowClick} />
          </div>
        </>
      )}

      {/* Create Payment Dialog */}
      <CreatePaymentDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* Payment Details Sheet */}
      <PaymentDetailsSheet
        payment={selectedPayment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
