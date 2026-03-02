"use client";

import { useState } from "react";
import { Plus, Users, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import { VendorTable } from "./_components/vendor-table";
import { VendorDetailsSheet } from "./_components/vendor-details-sheet";
import { AddVendorDialog } from "./_components/add-vendor-dialog";
import { mockVendors } from "@/lib/mock/vendors";
import type { Vendor } from "@/types/vendor";
import Image from "next/image";

type VendorFilter = "all" | "active" | "inactive";

export default function VendorsPage() {
  // Toggle to `true` to preview the empty state
  const [isEmpty] = useState(false);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<VendorFilter>("all");

  const vendors = isEmpty ? [] : mockVendors;

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "Active").length;
  const inactiveVendors = vendors.filter((v) => v.status === "Inactive").length;
  const complianceRisk = vendors.filter(
    (v) => v.compliance !== "Compliant",
  ).length;

  const filteredVendors = vendors.filter((v) => {
    if (filter === "active") return v.status === "Active";
    if (filter === "inactive") return v.status === "Inactive";
    return true;
  });

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setSheetOpen(true);
  };

  const filterTabs: { key: VendorFilter; label: string }[] = [
    { key: "all", label: "All vendors" },
    { key: "active", label: "Active vendors" },
    { key: "inactive", label: "Inactive vendors" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-title">Vendors</h1>
          <p className="text-sm text-brand-description">
            Manage vendor relationships and compliance
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="w-fit bg-brand-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add vendor
        </Button>
      </div>

      {vendors.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No vendors found"
            description="Get started by adding your first vendor"
            actionLabel="Add vendor"
            onAction={() => setDialogOpen(true)}
            image={
              <Image
                src="/svgs/empty-inbox-with-shadow.svg"
                alt="No vendors"
                width={100}
                height={100}
              />
            }
          />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              value={totalVendors}
              label="Total vendors"
              icon={Users}
            />
            <StatsCard
              value={activeVendors}
              label="Active vendors"
              icon={UserCheck}
            />
            <StatsCard
              value={inactiveVendors}
              label="Inactive vendors"
              icon={UserX}
            />
            <StatsCard
              value={complianceRisk}
              label="Compliance risk"
              icon={AlertTriangle}
              iconColor="text-red-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-brand-primary p-1 w-full overflow-x-auto max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  filter === tab.key
                    ? "border border-gray-300 bg-white text-gray-900 shadow-sm"
                    : "text-brand-border hover:text-brand-border/90"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <VendorTable
              vendors={filteredVendors}
              onSelectVendor={handleSelectVendor}
            />
          </div>
        </>
      )}

      <VendorDetailsSheet
        vendor={selectedVendor}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
      <AddVendorDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
