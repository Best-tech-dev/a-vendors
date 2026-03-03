"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import type { Order, OrderStatus } from "@/types/order";

const ITEMS_PER_PAGE = 5;

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { bg: string; text: string }> = {
    Pending: {
      bg: "bg-badge-yellow-accent",
      text: "text-badge-yellow",
    },
    "In Production": {
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    "In Transit": {
      bg: "bg-badge-yellow-accent",
      text: "text-badge-yellow",
    },
    Delivered: {
      bg: "bg-badge-green-accent",
      text: "text-badge-green",
    },
    Cancelled: {
      bg: "bg-badge-red-accent",
      text: "text-badge-red",
    },
  };

  const c = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {status}
    </span>
  );
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 bg-[#FAFBFC]">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              PO Number
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Vendor
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Expected Delivery
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Status
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer border-gray-100"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <TableCell className="font-medium text-brand-title">
                {order.poNumber}
              </TableCell>
              <TableCell className="text-brand-description">
                {order.vendor}
              </TableCell>
              <TableCell className="text-brand-description">
                {order.expectedDelivery}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right font-medium text-brand-title">
                {formatCurrency(order.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-brand-description">
            Page {currentPage} of {totalPages}
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer bg-brand-primary text-white hover:bg-brand-primary/90"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
