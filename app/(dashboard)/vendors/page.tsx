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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-sm text-gray-500">
            Manage vendor relationships and compliance
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gray-900 hover:bg-gray-800"
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
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="15"
                  y="25"
                  width="50"
                  height="35"
                  rx="4"
                  stroke="#4338CA"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="25"
                  cy="55"
                  r="5"
                  stroke="#4338CA"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M20 25 L40 10 L60 25"
                  stroke="#4338CA"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <ellipse cx="40" cy="65" rx="25" ry="3" fill="#E0E7FF" />
              </svg>
            }
          />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? "border border-gray-300 bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
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
