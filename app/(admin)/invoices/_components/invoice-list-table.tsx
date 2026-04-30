"use client";

import { useState } from "react";
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
import type { Invoice, InvoiceStatus } from "@/types/invoice";

const ITEMS_PER_PAGE = 5;

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
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
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {status}
    </span>
  );
}

interface InvoiceListTableProps {
  invoices: Invoice[];
  onRowClick: (invoice: Invoice) => void;
}

export function InvoiceListTable({
  invoices,
  onRowClick,
}: InvoiceListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = invoices.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 bg-[#FAFBFC]">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Invoice Number
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Vendor
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              PO Reference
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Amount
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Due Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedInvoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="cursor-pointer border-gray-100"
              onClick={() => onRowClick(invoice)}
            >
              <TableCell className="font-medium text-brand-title">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell className="text-brand-description">
                {invoice.vendor}
              </TableCell>
              <TableCell className="text-brand-description">
                {invoice.poReference}
              </TableCell>
              <TableCell>
                <StatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="font-medium text-brand-title">
                {formatCurrency(invoice.amount)}
              </TableCell>
              <TableCell className="text-brand-description">
                {invoice.dueDate}
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
