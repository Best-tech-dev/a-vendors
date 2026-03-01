"use client";

import { useState } from "react";
import { Plus, Users, ClipboardList, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import Image from "next/image";
import { RFQListTable } from "./_components/rfq-list-table";
import { CreateRFQDialog } from "./_components/create-rfq-dialog";
import { mockRFQs, rfqStats } from "@/lib/mock/rfqs";

type RFQFilter = "all" | "awarded" | "awaiting_quotes" | "awaiting_selection";

const ITEMS_PER_PAGE = 5;

export default function RFQsPage() {
  const [isEmpty] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<RFQFilter>("all");

  const rfqs = isEmpty ? [] : mockRFQs;

  const filterTabs: { key: RFQFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: rfqs.length },
    { key: "awarded", label: "Awarded", count: 12 },
    { key: "awaiting_quotes", label: "Awaiting quotes", count: 3 },
    { key: "awaiting_selection", label: "Awaiting selection", count: 3 },
  ];

  const totalPages = Math.max(1, Math.ceil(rfqs.length / ITEMS_PER_PAGE));
  const paginatedRFQs = rfqs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Request for Quotes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Request quotes and compare vendor pricing
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#1B2232] hover:bg-[#0F172A] text-white border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Request a Quote
        </Button>
      </div>

      {rfqs.length === 0 ? (
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
            <StatsCard value={rfqStats.total} label="Total RFQs" icon={Users} />
            <StatsCard
              value={rfqStats.draft}
              label="Draft"
              icon={ClipboardList}
            />
            <StatsCard
              value={rfqStats.sent}
              label="Sent"
              icon={ClipboardList}
            />
            <StatsCard
              value={rfqStats.awarded}
              label="Awarded"
              icon={AlertTriangle}
              iconColor="text-red-500"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-brand-primary p-1 w-fit overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setFilter(tab.key);
                  setPage(1);
                }}
                className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === tab.key
                    ? "border border-gray-300 bg-white text-gray-900 shadow-sm"
                    : "text-brand-border hover:text-brand-border/90"
                }`}
              >
                {tab.label}{" "}
                <span
                  className={`text-xs ${
                    filter === tab.key ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <RFQListTable
              rfqs={paginatedRFQs}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <CreateRFQDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
