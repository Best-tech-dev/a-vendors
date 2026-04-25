"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Vendor, ComplianceStatus } from "@/types/vendor";

interface VendorTableProps {
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const complianceLabels: Record<ComplianceStatus, string> = {
  compliant: "Compliant",
  non_compliant: "Non-Compliant",
  warning: "Warning",
};

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const config: Record<
    ComplianceStatus,
    { bg: string; text: string; iconColor: string }
  > = {
    compliant: {
      bg: "bg-badge-green-accent",
      text: "text-badge-green",
      iconColor: "text-badge-green",
    },
    non_compliant: {
      bg: "bg-badge-red-accent",
      text: "text-badge-red",
      iconColor: "text-badge-red",
    },
    warning: {
      bg: "bg-badge-yellow-accent",
      text: "text-badge-yellow",
      iconColor: "text-badge-yellow",
    },
  };

  const c = config[status] ?? config.non_compliant;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      <BadgeCheck className={`h-3.5 w-3.5 ${c.iconColor}`} />
      {complianceLabels[status] ?? status}
    </span>
  );
}

export function VendorTable({
  vendors,
  onSelectVendor,
  page,
  totalPages,
  onPageChange,
  loading,
}: VendorTableProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 bg-[#FAFBFC]">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Vendor Name
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Email
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Phone
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Location
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Compliance
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-gray-100">
                  <TableCell>
                    <span className="block h-4 w-32 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-36 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-28 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-8 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                </TableRow>
              ))
            : vendors.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  className="cursor-pointer border-gray-100"
                  onClick={() => onSelectVendor(vendor)}
                >
                  <TableCell className="font-medium text-brand-title">
                    {vendor.name}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {vendor.email}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {vendor.phone}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {vendor.city}, {vendor.country}
                  </TableCell>
                  <TableCell>
                    <ComplianceBadge status={vendor.complianceStatus} />
                  </TableCell>
                  <TableCell>
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
              ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-brand-description">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-brand-description hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
