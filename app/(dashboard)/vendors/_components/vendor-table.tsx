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
}

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const config: Record<
    ComplianceStatus,
    { bg: string; text: string; iconColor: string }
  > = {
    Compliant: {
      bg: "bg-badge-green-accent",
      text: "text-badge-green",
      iconColor: "text-badge-green",
    },
    "Non-Compliant": {
      bg: "bg-badge-red-accent",
      text: "text-badge-red",
      iconColor: "text-badge-red",
    },
    Warning: {
      bg: "bg-badge-yellow-accent",
      text: "text-badge-yellow",
      iconColor: "text-badge-yellow",
    },
  };

  const c = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      <BadgeCheck className={`h-3.5 w-3.5 ${c.iconColor}`} />
      {status}
    </span>
  );
}

export function VendorTable({ vendors, onSelectVendor }: VendorTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-[#FAFBFC]">
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Vendor Name
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Category
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Email
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
        {vendors.map((vendor) => (
          <TableRow
            key={vendor.id}
            className="cursor-pointer border-gray-100"
            onClick={() => onSelectVendor(vendor)}
          >
            <TableCell className="font-medium text-brand-title">
              {vendor.name}
            </TableCell>
            <TableCell className="text-brand-description">
              {vendor.category}
            </TableCell>
            <TableCell className="text-brand-description">
              {vendor.email}
            </TableCell>
            <TableCell className="text-brand-description">
              {vendor.city}, {vendor.country}
            </TableCell>
            <TableCell>
              <ComplianceBadge status={vendor.compliance} />
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
  );
}
