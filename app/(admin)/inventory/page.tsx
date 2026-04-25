"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import Image from "next/image";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { InventoryTable } from "./_components/inventory-table";
import { AddCategoryDialog } from "./_components/add-category-dialog";
import { AddMaterialDialog } from "./_components/add-material-dialog";
import { inventoryApi } from "@/lib/api/inventory";
import type { Material, MaterialsAnalysis } from "@/types/inventory";

const ITEMS_PER_PAGE = 20;

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [analysis, setAnalysis] = useState<MaterialsAnalysis>({
    totalMaterials: 0,
    inventoryValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });

  const fetchMaterials = useCallback(
    async (pageNum: number, searchQuery: string) => {
      setLoading(true);
      try {
        const res = await inventoryApi.getMaterials({
          page: pageNum,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
        });
        const { analysis, items, meta } = res.data.data;
        setAnalysis(analysis);
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

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchMaterials(page, search);
  }, [page, search, fetchMaterials]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleMutationSuccess = () => {
    fetchMaterials(page, search);
  };

  const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-title">Inventory</h1>
          <p className="text-sm text-brand-description">
            Manage materials and stock levels
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-[#F6F6F8] hover:bg-[#EDEDEE] border-0 text-brand-title"
            variant="outline"
            onClick={() => setCategoryDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add category
          </Button>
          <Button
            onClick={() => setMaterialDialogOpen(true)}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white border-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add material
          </Button>
        </div>
      </div>

      {!loading && materials.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No materials found"
            description="Add materials to your inventory catalog"
            actionLabel="Add material"
            onAction={() => setMaterialDialogOpen(true)}
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
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              loading={loading}
              value={analysis.totalMaterials}
              label="Total Materials"
            />
            <StatsCard
              loading={loading}
              value={formatCurrency(analysis.inventoryValue)}
              label="Inventory Value"
            />
            <StatsCard
              loading={loading}
              value={analysis.lowStockCount}
              label="Low Stock"
            />
            <StatsCard
              loading={loading}
              value={analysis.outOfStockCount}
              label="Out of Stock"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <InventoryTable
              materials={materials}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        </>
      )}

      <AddCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSuccess={handleMutationSuccess}
      />
      <AddMaterialDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        onSuccess={handleMutationSuccess}
      />
    </div>
  );
}
