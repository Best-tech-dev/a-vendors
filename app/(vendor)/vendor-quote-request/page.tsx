"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { EmptyState } from "@/app/_components/empty-state";
import Image from "next/image";
import { VendorQuoteRequestTable } from "./_components/vendor-quote-request-table";
import { rfqsApi } from "@/lib/api/rfqs";
import type { VendorQuoteRequest } from "@/types/rfq";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 20;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VendorQuoteRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<VendorQuoteRequest[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQuotes = useCallback(
    async (pageNum: number, searchQuery: string) => {
      setLoading(true);
      try {
        const res = await rfqsApi.getVendorQuoteRequests({
          page: pageNum,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
        });
        const { items, meta } = res.data.data;
        setQuotes(items);
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
              "Could not load quote requests. Please try again.",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Reset to page 1 on new search
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchQuotes(page, search);
  }, [page, search, fetchQuotes]);

  const handleViewRFQ = (id: string) => {
    router.push(`/vendor/quotes-request/${id}`);
  };

  const isEmpty = !loading && quotes.length === 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-title">Quotes Request</h1>
        <p className="text-sm text-brand-description">
          View and respond to requests for quotation
        </p>
      </div>

      {/* Table or empty state */}
      {isEmpty ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No quote requests"
            description="You have no active quote requests at the moment"
            image={
              <Image
                src="/svgs/empty-inbox-with-shadow.svg"
                alt="No quote requests"
                width={100}
                height={100}
              />
            }
          />
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          <VendorQuoteRequestTable
            quotes={quotes}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onViewRFQ={handleViewRFQ}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
