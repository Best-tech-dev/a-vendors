"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Order } from "@/types/order";

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

interface OrderGRNTabProps {
  order: Order;
}

export function OrderGRNTab({ order }: OrderGRNTabProps) {
  const [notes, setNotes] = useState("");
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-lg font-bold text-brand-title">Timeline overview</h2>

      {/* Notes */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-title">Notes</label>
          <Textarea
            placeholder="Any notes about the received goods..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-30 resize-none"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-base font-bold text-brand-title">
          Creating a GRN will:
        </h3>
        <ul className="mt-3 space-y-1.5 text-sm text-brand-description list-disc pl-5">
          <li>Mark all {order.items.length} item(s) as received</li>
          <li>Update order status to &quot;Delivered&quot;</li>
          <li>Create a pending invoice for {formatCurrency(totalAmount)}</li>
        </ul>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" className="text-brand-description">
          Cancel
        </Button>
        <Button className="bg-brand-primary">Create GRN</Button>
      </div>
    </div>
  );
}
