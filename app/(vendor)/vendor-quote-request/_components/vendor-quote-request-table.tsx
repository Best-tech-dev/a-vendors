"use client";

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
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";
import type { VendorQuoteRequest } from "@/types/rfq";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VendorQuoteRequestTableProps {
  quotes: VendorQuoteRequest[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewRFQ: (id: string) => void;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers — build a compact page number list with ellipsis
// ---------------------------------------------------------------------------

function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VendorQuoteRequestTable({
  quotes,
  page,
  totalPages,
  onPageChange,
  onViewRFQ,
  loading,
}: VendorQuoteRequestTableProps) {
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 bg-[#FAFBFC]">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Reference
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Title
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Items
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Expected Delivery
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Submission Deadline
            </TableHead>
            {/* Empty head for the action column */}
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <TableRow key={i} className="border-gray-100">
                  <TableCell>
                    <span className="block h-4 w-32 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-40 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-8 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-8 w-20 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                </TableRow>
              ))
            : quotes.map((quote) => (
                <TableRow key={quote.id} className="border-gray-100">
                  <TableCell className="font-medium text-brand-title">
                    {quote.reference}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {quote.title}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {quote.itemCount}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {quote.expectedDelivery}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {quote.submissionDeadline}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => onViewRFQ(quote.id)}
                      className="rounded-md border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-title transition-colors hover:bg-gray-50"
                    >
                      View RFQ
                    </button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-brand-description">
          Page {page} of {totalPages}
        </p>

        <Pagination className="w-auto mx-0 justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && onPageChange(page - 1)}
                className={
                  page === 1
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageNumbers.map((p, idx) =>
              p === "..." ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => onPageChange(p as number)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && onPageChange(page + 1)}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
