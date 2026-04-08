"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Users, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import { VendorTable } from "./_components/vendor-table";
import { VendorDetailsSheet } from "./_components/vendor-details-sheet";
import { AddVendorDialog } from "./_components/add-vendor-dialog";
import { vendorsApi } from "@/lib/api/vendors";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import type { Vendor, VendorsAnalysis } from "@/types/vendor";
import Image from "next/image";

const ITEMS_PER_PAGE = 20;

type VendorFilter = "all" | "active" | "inactive";

export default function VendorsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<VendorFilter>("all");
  const [loading, setLoading] = useState(true);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [analysis, setAnalysis] = useState<VendorsAnalysis>({
    totalVendors: 0,
    activeVendors: 0,
    inactiveVendors: 0,
    complianceRiskCount: 0,
  });

  const fetchVendors = useCallback(
    async (
      pageNum: number,
      searchQuery: string,
      statusFilter: VendorFilter,
    ) => {
      setLoading(true);
      try {
        const res = await vendorsApi.getAll({
          page: pageNum,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        const { analysis, items, meta } = res.data.data;
        setAnalysis(analysis);
        setVendors(items);
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
              "Could not load vendors. Please try again.",
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
  }, [search, filter]);

  useEffect(() => {
    fetchVendors(page, search, filter);
  }, [page, search, filter, fetchVendors]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleMutationSuccess = () => {
    fetchVendors(page, search, filter);
  };

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

      {!loading && vendors.length === 0 && !search ? (
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
              loading={loading}
              value={analysis.totalVendors}
              label="Total vendors"
              icon={Users}
            />
            <StatsCard
              loading={loading}
              value={analysis.activeVendors}
              label="Active vendors"
              icon={UserCheck}
            />
            <StatsCard
              loading={loading}
              value={analysis.inactiveVendors}
              label="Inactive vendors"
              icon={UserX}
            />
            <StatsCard
              loading={loading}
              value={analysis.complianceRiskCount}
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
              vendors={vendors}
              onSelectVendor={handleSelectVendor}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        </>
      )}

      <VendorDetailsSheet
        vendor={selectedVendor}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
      <AddVendorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleMutationSuccess}
      />
    </div>
  );
}
