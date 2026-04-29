"use client";

import { useState, useEffect, useCallback } from "react";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import Image from "next/image";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { VendorInventoryTable } from "./_components/vendor-inventory-table";
import { inventoryApi } from "@/lib/api/inventory";
import type {
  VendorMaterial,
  VendorInventoryAnalysis,
} from "@/types/inventory";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StockFilter = "in_stock" | "low_stock" | "out_of_stock";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 20;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VendorInventoryPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<StockFilter>("in_stock");
  const [loading, setLoading] = useState(true);

  const [materials, setMaterials] = useState<VendorMaterial[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [analysis, setAnalysis] = useState<VendorInventoryAnalysis>({
    totalMaterials: 0,
    totalCategories: 0,
    totalStock: 0,
    totalUnitPrice: 0,
  });
  const [filterCounts, setFilterCounts] = useState({
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
  });

  const fetchInventory = useCallback(
    async (pageNum: number, searchQuery: string, filter: StockFilter) => {
      setLoading(true);
      try {
        const res = await inventoryApi.getVendorMaterials({
          page: pageNum,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
          stockFilter: filter,
        });
        const { analysis, filterCounts, items, meta } = res.data.data;
        setAnalysis(analysis);
        setFilterCounts(filterCounts);
        setMaterials(items);
        setTotalPages(meta.totalPages || 1);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (!axiosError.response) {
          toast.error(
            "Network error — please check your connection and retry.",
          );
        } else {
          toast.error(
            axiosError.response.data?.message ??
              "Could not load inventory. Please try again.",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, activeFilter]);

  useEffect(() => {
    fetchInventory(page, search, activeFilter);
  }, [page, search, activeFilter, fetchInventory]);

  const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;

  const isEmpty = !loading && materials.length === 0;

  return (
    <div className="space-y-6">
      {/* Page header — read-only, no action buttons */}
      <div>
        <h1 className="text-2xl font-bold text-brand-title">Inventory</h1>
        <p className="text-sm text-brand-description">
          Manage your materials and stock levels
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          loading={loading}
          value={analysis.totalMaterials}
          label="Total Material"
        />
        <StatsCard
          loading={loading}
          value={analysis.totalCategories}
          label="Total Category"
        />
        <StatsCard
          loading={loading}
          value={analysis.totalStock}
          label="Total Stock"
        />
        <StatsCard
          loading={loading}
          value={formatCurrency(analysis.totalUnitPrice)}
          label="Total Unit Price"
        />
      </div>

      {/* Table or empty state */}
      {isEmpty ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No materials found"
            description="No inventory items match your current filter"
            actionLabel="Refresh"
            onAction={() => fetchInventory(1, search, activeFilter)}
            image={
              <Image
                src="/svgs/empty-inbox-with-shadow.svg"
                alt="No materials"
                width={100}
                height={100}
              />
            }
          />
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          <VendorInventoryTable
            materials={materials}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            activeFilter={activeFilter}
            onFilterChange={(f) => {
              setActiveFilter(f);
              setPage(1);
            }}
            filterCounts={filterCounts}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
