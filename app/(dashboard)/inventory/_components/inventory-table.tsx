"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import type { Material } from "@/types/inventory";

interface InventoryTableProps {
  materials: Material[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function formatPrice(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export function InventoryTable({
  materials,
  page,
  totalPages,
  onPageChange,
}: InventoryTableProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 bg-[#FAFBFC]">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Name
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Category
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Unit
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Stock
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Reorder Level
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Unit Price
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => {
            const isLow =
              material.stock > 0 && material.stock <= material.reorderLevel;
            const isOut = material.stock === 0;
            return (
              <TableRow key={material.id} className="border-gray-100">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={material.thumbnail || "/imgs/tin.jpg"}
                        alt={material.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-brand-title">
                      {material.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-brand-description">
                  {material.category}
                </TableCell>
                <TableCell className="text-brand-description">
                  {material.unit}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      isOut ? "font-medium text-badge-red" : "text-brand-title"
                    }
                  >
                    {material.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-title">
                      {material.reorderLevel}
                    </span>
                    {isLow && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-badge-red-accent px-2 py-0.5 text-xs font-medium text-badge-red">
                        <AlertTriangle className="h-3 w-3" />
                        Low
                      </span>
                    )}
                    {isOut && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-badge-red-accent px-2 py-0.5 text-xs font-medium text-badge-red">
                        <AlertTriangle className="h-3 w-3" />
                        Out
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-brand-title">
                  {formatPrice(material.unitPrice)}
                </TableCell>
              </TableRow>
            );
          })}
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
