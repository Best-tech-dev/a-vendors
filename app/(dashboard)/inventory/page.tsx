"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import Image from "next/image";
import { InventoryTable } from "./_components/inventory-table";
import { AddCategoryDialog } from "./_components/add-category-dialog";
import { AddMaterialDialog } from "./_components/add-material-dialog";
import { mockMaterials } from "@/lib/mock/inventory";

const ITEMS_PER_PAGE = 5;

export default function InventoryPage() {
  // Toggle to `true` to preview the empty state
  const [isEmpty] = useState(false);

  const [page, setPage] = useState(1);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);

  const materials = isEmpty ? [] : mockMaterials;

  const totalMaterials = materials.length;
  const inventoryValue = materials.reduce(
    (sum, m) => sum + m.stock * m.unitPrice,
    0,
  );
  const lowStock = materials.filter(
    (m) => m.stock > 0 && m.stock <= m.reorderLevel,
  ).length;
  const outOfStock = materials.filter((m) => m.stock === 0).length;

  const totalPages = Math.max(1, Math.ceil(materials.length / ITEMS_PER_PAGE));
  const paginatedMaterials = materials.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

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

      {materials.length === 0 ? (
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
            <StatsCard value={totalMaterials} label="Total Materials" />
            <StatsCard
              value={formatCurrency(inventoryValue)}
              label="Inventory Value"
            />
            <StatsCard value={lowStock} label="Low Stock" />
            <StatsCard value={outOfStock} label="Out of Stock" />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <InventoryTable
              materials={paginatedMaterials}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <AddCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />
      <AddMaterialDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
      />
    </div>
  );
}
