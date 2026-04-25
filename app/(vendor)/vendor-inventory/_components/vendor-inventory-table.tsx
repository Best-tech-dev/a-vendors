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
import { cn } from "@/lib/utils";
import type { VendorMaterial } from "@/types/inventory";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StockFilter = "in_stock" | "low_stock" | "out_of_stock";

interface FilterTab {
  key: StockFilter;
  label: string;
  count: number;
}

interface VendorInventoryTableProps {
  materials: VendorMaterial[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activeFilter: StockFilter;
  onFilterChange: (filter: StockFilter) => void;
  filterCounts: { in_stock: number; low_stock: number; out_of_stock: number };
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VendorInventoryTable({
  materials,
  page,
  totalPages,
  onPageChange,
  activeFilter,
  onFilterChange,
  filterCounts,
  loading,
}: VendorInventoryTableProps) {
  const tabs: FilterTab[] = [
    { key: "in_stock", label: "In stock", count: filterCounts.in_stock },
    { key: "low_stock", label: "Low stock", count: filterCounts.low_stock },
    {
      key: "out_of_stock",
      label: "Out of stock",
      count: filterCounts.out_of_stock,
    },
  ];

  return (
    <div>
      {/* Stock filter tabs */}
      <div className="border-b border-gray-200 px-4 pt-4">
        <div className="inline-flex rounded-lg bg-[#F1F3F5] p-1">
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
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 bg-[#FAFBFC]">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              SKU
            </TableHead>
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
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-gray-100">
                  <TableCell>
                    <span className="block h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-32 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-12 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-12 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <span className="block h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                </TableRow>
              ))
            : materials.map((material) => {
                const isLow =
                  material.stock > 0 && material.stock <= material.reorderLevel;
                const isOut = material.stock === 0;

                return (
                  <TableRow key={material.id} className="border-gray-100">
                    <TableCell className="font-mono text-sm text-brand-description">
                      {material.sku}
                    </TableCell>
                    <TableCell className="font-medium text-brand-title">
                      {material.name}
                    </TableCell>
                    <TableCell className="text-brand-description">
                      {material.category.name}
                    </TableCell>
                    <TableCell className="text-brand-description">
                      {material.unit}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          isOut
                            ? "font-medium text-badge-red"
                            : "text-brand-title"
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
                      {formatPrice(material.pricePerUnit)}
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
