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
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Name
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Category
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Unit
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Stock
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Reorder Level
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
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
                    <span className="font-medium text-gray-900">
                      {material.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {material.category}
                </TableCell>
                <TableCell className="text-gray-600">{material.unit}</TableCell>
                <TableCell>
                  <span
                    className={
                      isOut ? "font-medium text-red-600" : "text-gray-900"
                    }
                  >
                    {material.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">
                      {material.reorderLevel}
                    </span>
                    {isLow && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Low
                      </span>
                    )}
                    {isOut && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        Out
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {formatPrice(material.unitPrice)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
