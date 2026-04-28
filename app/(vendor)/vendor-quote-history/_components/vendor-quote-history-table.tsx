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
import { cn } from "@/lib/utils";
import type { VendorQuoteHistory, QuoteHistoryFilter } from "@/types/rfq";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterTab {
  key: QuoteHistoryFilter;
  label: string;
  count: number;
}

interface VendorQuoteHistoryTableProps {
  quotes: VendorQuoteHistory[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activeFilter: QuoteHistoryFilter;
  onFilterChange: (filter: QuoteHistoryFilter) => void;
  filterCounts: {
    all: number;
    awarded: number;
    pending: number;
    rejected: number;
    withdrawn: number;
  };
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Status badge config
// ---------------------------------------------------------------------------

type StatusKey = "awarded" | "pending" | "rejected";

const STATUS_STYLES: Record<StatusKey, string> = {
  awarded: "border border-emerald-400 text-emerald-600 bg-transparent",
  pending: "border border-amber-400 text-amber-600 bg-transparent",
  rejected: "border border-red-400 text-red-500 bg-transparent",
};

function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase() as StatusKey;
  const styles =
    STATUS_STYLES[key] ??
    "border border-gray-300 text-brand-description bg-transparent";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium",
        styles,
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page number builder
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

export function VendorQuoteHistoryTable({
  quotes,
  page,
  totalPages,
  onPageChange,
  activeFilter,
  onFilterChange,
  filterCounts,
  loading,
}: VendorQuoteHistoryTableProps) {
  const tabs: FilterTab[] = [
    { key: "all", label: "All", count: filterCounts.all }, // Ensure 'all' is always present
    { key: "pending", label: "Pending", count: filterCounts.pending },
    { key: "awarded", label: "Awarded", count: filterCounts.awarded },
    { key: "rejected", label: "Rejected", count: filterCounts.rejected },
    { key: "withdrawn", label: "Withdrawn", count: filterCounts.withdrawn },
  ];

  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="inline-flex rounded-lg bg-[#F1F3F5] p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === tab.key
                ? "bg-brand-primary text-white shadow-sm"
                : "text-brand-description hover:text-brand-title",
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 bg-[#FAFBFC]">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Reference
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Total Items
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Accepted Items
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Amount Quoted
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Date Submitted
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading
              ? Array.from({ length: 7 }).map((_, i) => (
                  <TableRow key={i} className="border-gray-100">
                    <TableCell>
                      <span className="block h-4 w-32 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <span className="block h-4 w-8 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <span className="block h-4 w-10 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <span className="block h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                    </TableCell>
                  </TableRow>
                ))
              : quotes.map((quote) => (
                  <TableRow key={quote.id} className="border-gray-100">
                    <TableCell className="font-medium text-brand-title">
                      {quote.reference}
                    </TableCell>
                    <TableCell className="text-brand-description">
                      {quote.totalItems}
                    </TableCell>
                    <TableCell className="text-brand-description">
                      {quote.acceptedItems}/{quote.totalItems}
                    </TableCell>
                    <TableCell className="font-medium text-brand-title">
                      ₦{quote.amountQuoted.toLocaleString("en-NG")}
                    </TableCell>
                    <TableCell className="text-brand-description">
                      {quote.dateSubmitted}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={quote.status} />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {/* Pagination — only shown when there's more than one page */}
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}
