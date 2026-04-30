"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { rfqsApi } from "@/lib/api/rfqs";
import type {
  VendorQuoteHistoryDetail,
  FulfillmentTimelineEntry,
  FulfillmentPayment,
} from "@/types/rfq";
import {
  HeadingStatusBadge,
  OverviewTab,
  TimelineTab,
  TimelineSkeleton,
  StatRow,
  PageSkeleton,
  formatCurrency,
  type StatItem,
} from "./_components/vendor-quote-history-details-table";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DetailTab = "overview" | "timeline";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format ISO date to a short display date, e.g. "2026-02-04" */
function formatDisplayDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-CA"); // YYYY-MM-DD
  } catch {
    return iso;
  }
}

/** Format ISO date to a friendly date, e.g. "Feb 20, 2026" */
function formatFriendlyDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VendorQuoteHistoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  // Detail state (overview tab data)
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<VendorQuoteHistoryDetail | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  // Timeline state (fulfillment tab data)
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timeline, setTimeline] = useState<FulfillmentTimelineEntry[]>([]);
  const [payments, setPayments] = useState<FulfillmentPayment[]>([]);
  const [currentStage, setCurrentStage] = useState("");
  const [updatingStage, setUpdatingStage] = useState(false);

  // ── Fetch detail ──
  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    rfqsApi
      .getVendorQuoteHistoryById(params.id)
      .then(({ data: res }) => setDetail(res.data))
      .catch((error: AxiosError<{ message: string }>) => {
        toast.error(
          error.response?.data?.message ??
            "Could not load quote details. Please try again.",
        );
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  // ── Fetch fulfillment timeline when tab switches ──
  const fetchTimeline = useCallback(async () => {
    if (!params.id) return;
    setTimelineLoading(true);
    try {
      const { data: res } = await rfqsApi.getVendorQuoteFulfillment(params.id);
      setTimeline(res.data.timeline);
      setPayments(res.data.payments);
      setCurrentStage(res.data.order.stage);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ??
          "Could not load fulfillment timeline.",
      );
    } finally {
      setTimelineLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (activeTab === "timeline") {
      fetchTimeline();
    }
  }, [activeTab, fetchTimeline]);

  // ── Update fulfillment stage ──
  const handleUpdateStage = useCallback(
    async (stage: string) => {
      if (!params.id) return;
      setUpdatingStage(true);
      try {
        await rfqsApi.updateVendorQuoteFulfillmentStage(params.id, { stage });
        toast.success("Fulfillment stage updated successfully.");
        // Re-fetch timeline to reflect the update
        await fetchTimeline();
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.response?.data?.message ??
            "Could not update stage. Please try again.",
        );
      } finally {
        setUpdatingStage(false);
      }
    },
    [params.id, fetchTimeline],
  );

  if (loading) return <PageSkeleton />;
  if (!detail) return null;

  const stats: StatItem[] = [
    { label: "Total Items", value: String(detail.summary.totalItems) },
    { label: "Date Submitted", value: formatDisplayDate(detail.summary.dateSubmitted) },
    { label: "Total Quoted", value: formatCurrency(detail.summary.totalQuoted) },
    { label: "Expected Delivery", value: formatFriendlyDate(detail.summary.expectedDelivery) },
  ];

  const tabs: { key: DetailTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "timeline", label: "Order Fulfillment Timeline" },
  ];

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-brand-description transition-colors hover:text-brand-title"
      >
        <span className="text-base leading-none">‹</span>
        Go back
      </button>

      {/* Page heading */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-brand-title">
          Quote for {detail.rfq.rfqNumber}
        </h1>
        <HeadingStatusBadge status={detail.displayStatus} />
      </div>

      {/* Stat row */}
      <StatRow stats={stats} />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-brand-primary text-white"
                : "text-brand-description hover:text-brand-title",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" ? (
        <OverviewTab items={detail.items} />
      ) : timelineLoading ? (
        <TimelineSkeleton />
      ) : (
        <TimelineTab
          timeline={timeline}
          payments={payments}
          currentStage={currentStage}
          updatingStage={updatingStage}
          onUpdateStage={handleUpdateStage}
        />
      )}
    </div>
  );
}
