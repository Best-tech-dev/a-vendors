"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/types/order";

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

interface OrderDetailsTabProps {
  order: Order;
}

export function OrderDetailsTab({ order }: OrderDetailsTabProps) {
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-brand-title mb-4">
          {order.title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              Total items
            </p>
            <p className="mt-1.5 text-xl font-bold text-brand-title">
              {order.items.length}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              Total Amount
            </p>
            <p className="mt-1.5 text-xl font-bold text-brand-title">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              Expected Delivery
            </p>
            <p className="mt-1.5 text-xl font-bold text-brand-title">
              {order.expectedDelivery}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              Actual Delivery
            </p>
            <p className="mt-1.5 text-xl font-bold text-badge-yellow">
              {order.actualDelivery ?? "Pending"}
            </p>
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="px-6 pt-5">
        <h3 className="text-base font-bold text-brand-title">Ordered item</h3>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 bg-[#FAFBFC]">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Material
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Quantity
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Unit Price
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Total Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id} className="border-gray-100">
                <TableCell className="font-medium text-brand-title">
                  {item.material}
                </TableCell>
                <TableCell className="text-brand-description">
                  {item.quantity.toLocaleString()} {item.unit}
                </TableCell>
                <TableCell className="text-brand-description">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right font-medium text-brand-title">
                  {formatCurrency(item.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
