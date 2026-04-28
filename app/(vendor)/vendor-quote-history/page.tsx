"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { EmptyState } from "@/app/_components/empty-state";
import Image from "next/image";
import { VendorQuoteHistoryTable } from "./_components/vendor-quote-history-table";
import { rfqsApi } from "@/lib/api/rfqs";
import type { VendorQuoteHistory, QuoteHistoryFilter } from "@/types/rfq";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 20;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VendorQuoteHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<QuoteHistoryFilter>("all");
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<VendorQuoteHistory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCounts, setFilterCounts] = useState({
    all: 0,
    awarded: 0,
    pending: 0,
    rejected: 0,
    withdrawn: 0,
  });

  const fetchHistory = useCallback(
    async (
      pageNum: number,
      searchQuery: string,
      filter: QuoteHistoryFilter,
    ) => {
      setLoading(true);
      try {
        const res = await rfqsApi.getVendorQuoteHistory({
          page: pageNum,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
          view: filter,
        });
        const { data, meta } = res.data;

        setQuotes(
          data.map((quote) => ({
            ...quote,
            // Keep table status behavior unchanged while using backend value.
            status: quote.displayStatus.toLowerCase(),
          })),
        );
        setTotalPages(meta.totalPages || 1);
        setFilterCounts({
          all: meta.tabs.all,
          awarded: meta.tabs.awarded,
          pending: meta.tabs.pending,
          rejected: meta.tabs.rejected,
          withdrawn: meta.tabs.withdrawn,
        });
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (!axiosError.response) {
          toast.error(
            "Network error — please check your connection and retry.",
          );
        } else {
          toast.error(
            axiosError.response.data?.message ??
              "Could not load quote history. Please try again.",
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
    fetchHistory(page, search, activeFilter);
  }, [page, search, activeFilter, fetchHistory]);

  const handleFilterChange = (filter: QuoteHistoryFilter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const isEmpty = !loading && quotes.length === 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-title">Quotes History</h1>
        <p className="text-sm text-brand-description">
          Track all your submitted quotes
        </p>
      </div>

      {isEmpty ? (
        <>
          {/* Keep tabs visible even when empty so the user can switch filters */}
          <div className="inline-flex rounded-lg bg-[#F1F3F5] p-1 overflow-x-auto">
            {(["all", "awarded", "pending"] as QuoteHistoryFilter[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === f
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-brand-description hover:text-brand-title"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)} ({filterCounts[f]})
                </button>
              ),
            )}
            {(["rejected", "withdrawn"] as QuoteHistoryFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === f
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-brand-description hover:text-brand-title"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({filterCounts[f]})
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <EmptyState
              title="No quotes found"
              description="You haven't submitted any quotes yet"
              actionLabel="View quote requests"
              onAction={() => router.push("/vendor-quote-request")}
              image={
                <Image
                  src="/svgs/empty-inbox-with-shadow.svg"
                  alt="No quotes"
                  width={100}
                  height={100}
                />
              }
            />
          </div>
        </>
      ) : (
        <VendorQuoteHistoryTable
          quotes={quotes}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          filterCounts={filterCounts}
          loading={loading}
        />
      )}
    </div>
  );
}
