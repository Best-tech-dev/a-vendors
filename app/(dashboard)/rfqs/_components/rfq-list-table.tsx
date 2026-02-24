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
import type { RFQ, RFQStatus } from "@/types/rfq";

interface RFQListTableProps {
  rfqs: RFQ[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function StatusBadge({ status }: { status: RFQStatus }) {
  const config: Record<RFQStatus, { bg: string; text: string }> = {
    Awarded: {
      bg: "bg-green-50 border border-green-200",
      text: "text-green-700",
    },
    Draft: {
      bg: "bg-gray-100 border border-gray-200",
      text: "text-gray-600",
    },
    Sent: {
      bg: "bg-blue-50 border border-blue-200",
      text: "text-blue-700",
    },
    "Awaiting Quotes": {
      bg: "bg-yellow-50 border border-yellow-200",
      text: "text-yellow-700",
    },
    "Awaiting Selection": {
      bg: "bg-purple-50 border border-purple-200",
      text: "text-purple-700",
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

export function RFQListTable({
  rfqs,
  page,
  totalPages,
  onPageChange,
}: RFQListTableProps) {
  const router = useRouter();

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              RFQ ID
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Title
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Deadline
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rfqs.map((rfq, index) => (
            <TableRow
              key={rfq.id}
              className="cursor-pointer border-gray-100 hover:bg-gray-50"
              onClick={() => router.push(`/rfqs/${rfq.id}`)}
            >
              <TableCell className="font-medium text-gray-600">
                RFQ-2024-00{(page - 1) * 5 + index + 1}Q1
              </TableCell>
              <TableCell className="text-gray-600">{rfq.title}</TableCell>
              <TableCell className="text-gray-600">{rfq.deadline}</TableCell>
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
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-gray-500">
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
