"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Users, ClipboardList, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import Image from "next/image";
import { RFQListTable } from "./_components/rfq-list-table";
import { CreateRFQDialog } from "./_components/create-rfq-dialog";
import { rfqsApi } from "@/lib/api/rfqs";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import type { RFQListItem, RFQsAnalysis } from "@/types/rfq";

type RFQFilter = "all" | "awarded" | "awaiting_quotes" | "awaiting_selection";

const ITEMS_PER_PAGE = 20;

export default function RFQsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<RFQFilter>("all");
  const [loading, setLoading] = useState(true);

  const [rfqs, setRfqs] = useState<RFQListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [analysis, setAnalysis] = useState<RFQsAnalysis>({
    totalRfqs: 0,
    draftCount: 0,
    sentCount: 0,
    awardedCount: 0,
  });

  const fetchRFQs = useCallback(
    async (pageNum: number, searchQuery: string, statusFilter: RFQFilter) => {
      setLoading(true);
      try {
        const res = await rfqsApi.getAll({
          page: pageNum,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        const { analysis, items, meta } = res.data.data;
        setAnalysis(analysis);
        setRfqs(items);
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
              "Could not load RFQs. Please try again.",
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
    fetchRFQs(page, search, filter);
  }, [page, search, filter, fetchRFQs]);

  const handleMutationSuccess = () => {
    fetchRFQs(page, search, filter);
  };

  const filterTabs: { key: RFQFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "awarded", label: "Awarded" },
    { key: "awaiting_quotes", label: "Awaiting quotes" },
    { key: "awaiting_selection", label: "Awaiting selection" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-title">
            Request for Quotes
          </h1>
          <p className="text-sm text-brand-description mt-0.5">
            Request quotes and compare vendor pricing
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="w-fit bg-brand-primary hover:bg-brand-primary/90 text-white border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Request a Quote
        </Button>
      </div>

      {!loading && rfqs.length === 0 && !search ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No request available yet"
            description="No RFQs found. Create your first one!"
            actionLabel="Request a Quote"
            onAction={() => setDialogOpen(true)}
            image={
              <Image
                src="/svgs/empty-inbox-with-shadow.svg"
                alt="No RFQs"
                width={100}
                height={100}
              />
            }
          />
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard
              loading={loading}
              value={analysis.totalRfqs}
              label="Total RFQs"
              icon={Users}
            />
            <StatsCard
              loading={loading}
              value={analysis.draftCount}
              label="Draft"
              icon={ClipboardList}
            />
            <StatsCard
              loading={loading}
              value={analysis.sentCount}
              label="Sent"
              icon={ClipboardList}
            />
            <StatsCard
              loading={loading}
              value={analysis.awardedCount}
              label="Awarded"
              icon={AlertTriangle}
              iconColor="text-red-500"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-brand-primary p-1 w-fit overflow-x-auto max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
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
            <RFQListTable
              rfqs={rfqs}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              loading={loading}
            />
          </div>
        </>
      )}

      <CreateRFQDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleMutationSuccess}
      />
    </div>
  );
}
