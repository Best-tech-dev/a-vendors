"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { rfqsApi } from "@/lib/api/rfqs";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { CreateRFQData } from "@/types/rfq";

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export default function RFQDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const rfqId = params.id as string;

  const [detail, setDetail] = useState<CreateRFQData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const fetchRFQ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rfqsApi.getById(rfqId);
      setDetail(res.data.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (!axiosError.response) {
        toast.error("Network error — please check your connection and retry.");
      } else {
        toast.error(
          axiosError.response.data?.message ??
            "Could not load RFQ details. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [rfqId]);

  useEffect(() => {
    fetchRFQ();
  }, [fetchRFQ]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Back link */}
        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-56 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-28 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
        </div>

        {/* Item tabs */}
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-brand-primary p-1 w-fit">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 animate-pulse rounded-md bg-gray-200"
            />
          ))}
        </div>

        {/* Summary row */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="grid grid-cols-2 gap-4 p-4 sm:gap-6 sm:p-6 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-7 w-32 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Vendors section */}
        <div className="space-y-4">
          <div className="h-5 w-36 animate-pulse rounded bg-gray-100" />
          <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-52 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-5 w-14 animate-pulse rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push("/rfqs")}
          className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-primary font-medium"
        >
          <ChevronLeft className="size-4" />
          Back to RFQs
        </button>
        <p className="text-sm text-brand-description">
          RFQ not found or could not be loaded.
        </p>
      </div>
    );
  }

  const currentItem = detail.items[activeItemIndex];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => router.push("/rfqs")}
        className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-primary font-medium"
      >
        <ChevronLeft className="size-4" />
        Back to RFQs
      </button>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-brand-title">
            {detail.title}
          </h1>
          <Badge
            variant="outline"
            className="text-xs text-brand-description border-0"
          >
            {detail.rfqNumber}
          </Badge>
        </div>
        <span className="text-sm text-brand-description shrink-0">
          Items: {detail.items.length}
        </span>
      </div>

      {/* Item Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-brand-primary p-1 w-fit overflow-x-auto max-w-full">
        {detail.items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveItemIndex(index)}
            className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeItemIndex === index
                ? "border border-gray-300 bg-white text-gray-900 shadow-sm"
                : "text-brand-border hover:text-brand-border/90"
            }`}
          >
            {item.materialName}
          </button>
        ))}
      </div>

      {/* Summary Row */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-2 gap-4 p-4 sm:gap-6 sm:p-6 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              Quantity
            </p>
            <p className="mt-1.5 text-xl font-bold text-brand-title">
              {currentItem.quantity.toLocaleString()} {currentItem.unit}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              Budget
            </p>
            <p className="mt-1.5 text-xl font-bold text-brand-title">
              {formatCurrency(currentItem.budget)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              Vendors invited
            </p>
            <p className="mt-1.5 text-xl font-bold text-brand-title">
              {detail.vendors.length}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              Status
            </p>
            <p className="mt-1.5 text-xl font-bold text-brand-title capitalize">
              {detail.status}
            </p>
          </div>
        </div>
      </div>

      {/* Vendors Invited (shown when no quotes are available yet) */}
      <div>
        <h2 className="text-lg font-bold text-brand-title mb-4">
          Vendors Invited
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
          {detail.vendors.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-brand-title">
                  {v.vendor.name}
                </p>
                <p className="text-xs text-brand-description">
                  {v.vendor.email}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs border-0 ${
                  v.vendor.status === "active"
                    ? "bg-badge-green-accent text-badge-green"
                    : "bg-gray-100 text-brand-description"
                }`}
              >
                {v.vendor.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for quotes & analysis — shown when the RFQ has no quotes yet */}
      {detail.status === "draft" && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-brand-description">
            This RFQ is still in <strong>draft</strong> status. Vendor quotes
            and analysis will appear here once the RFQ is sent and vendors
            respond.
          </p>
        </div>
      )}
    </div>
  );
}
