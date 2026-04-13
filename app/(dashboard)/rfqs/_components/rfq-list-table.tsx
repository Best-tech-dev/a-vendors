"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RFQListItem } from "@/types/rfq";

interface RFQListTableProps {
  rfqs: RFQListItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

type StatusKey =
  | "draft"
  | "sent"
  | "awarded"
  | "awaiting_quotes"
  | "awaiting_selection";

const STATUS_CONFIG: Record<
  StatusKey,
  { bg: string; text: string; label: string }
> = {
  draft: { bg: "bg-gray-100", text: "text-brand-description", label: "Draft" },
  sent: { bg: "bg-blue-50", text: "text-blue-700", label: "Sent" },
  awarded: {
    bg: "bg-badge-green-accent",
    text: "text-badge-green",
    label: "Awarded",
  },
  awaiting_quotes: {
    bg: "bg-badge-yellow-accent",
    text: "text-badge-yellow",
    label: "Awaiting Quotes",
  },
  awaiting_selection: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    label: "Awaiting Selection",
  },
};

function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/\s+/g, "_") as StatusKey;
  const c = STATUS_CONFIG[key] ?? STATUS_CONFIG.draft;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

export function RFQListTable({
  rfqs,
  page,
  totalPages,
  onPageChange,
  loading,
}: RFQListTableProps) {
  const router = useRouter();

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 bg-[#FAFBFC]">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              RFQ ID
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Title
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Deadline
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-gray-100">
                <TableCell colSpan={5}>
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                </TableCell>
              </TableRow>
            ))
          ) : rfqs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-sm text-brand-description"
              >
                No RFQs match your search.
              </TableCell>
            </TableRow>
          ) : (
            rfqs.map((rfq) => (
              <TableRow
                key={rfq.id}
                className="cursor-pointer border-gray-100 hover:bg-gray-50"
                onClick={() => router.push(`/rfqs/${rfq.id}`)}
              >
                <TableCell className="font-medium text-brand-description">
                  {rfq.rfqNumber}
                </TableCell>
                <TableCell className="text-brand-description">
                  {rfq.title}
                </TableCell>
                <TableCell className="text-brand-description">
                  {new Date(rfq.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={rfq.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4 text-brand-muted" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-brand-description">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
