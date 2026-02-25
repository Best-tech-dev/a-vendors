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
      bg: "bg-green-50 border border-green-200",
      text: "text-green-700",
      iconColor: "text-green-500",
    },
    "Non-Compliant": {
      bg: "bg-red-50 border border-red-200",
      text: "text-red-700",
      iconColor: "text-red-500",
    },
    Warning: {
      bg: "bg-yellow-50 border border-yellow-200",
      text: "text-yellow-700",
      iconColor: "text-yellow-500",
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
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Vendor Name
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Category
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Email
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Location
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Compliance
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
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
            <TableCell className="font-medium text-gray-900">
              {vendor.name}
            </TableCell>
            <TableCell className="text-gray-600">{vendor.category}</TableCell>
            <TableCell className="text-gray-600">{vendor.email}</TableCell>
            <TableCell className="text-gray-600">
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
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
