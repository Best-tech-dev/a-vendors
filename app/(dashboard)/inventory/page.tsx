"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Inventory</h1>
          <p className="text-sm text-brand-description">
            Manage materials and stock levels
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-[#F6F6F8] hover:bg-[#EDEDEE] border-0 text-[#1B2232]"
            variant="outline"
            onClick={() => setCategoryDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add category
          </Button>
          <Button
            onClick={() => setMaterialDialogOpen(true)}
            className="bg-[#1B2232] hover:bg-[#0F172A] text-white border-0"
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
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="15"
                  y="20"
                  width="50"
                  height="40"
                  rx="4"
                  stroke="#4338CA"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M15 30h50" stroke="#4338CA" strokeWidth="2" />
                <circle
                  cx="30"
                  cy="50"
                  r="6"
                  stroke="#4338CA"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M30 47v6M27 50h6"
                  stroke="#4338CA"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <ellipse cx="40" cy="67" rx="25" ry="3" fill="#E0E7FF" />
              </svg>
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
