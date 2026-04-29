"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rfqsApi } from "@/lib/api/rfqs";
import type { VendorRFQDetail } from "@/types/rfq";
import { formatDate } from "@/lib/utils";
import { SubmitQuoteSheet } from "./_components/submit-quote-sheet";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

function formatDisplayDate(value: string) {
  if (!value) return "-";
  return formatDate(value);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VendorRFQDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [rfq, setRfq] = useState<VendorRFQDetail | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [submitSheetOpen, setSubmitSheetOpen] = useState(false);

  const loadRfq = useCallback(async () => {
    if (!params.id) return;
    try {
      const { data: res } = await rfqsApi.getVendorRFQById(params.id);
      const detail: VendorRFQDetail = {
        id: res.data.rfq.id,
        reference: res.data.rfq.rfqNumber,
        title: res.data.rfq.title,
        sentDate: formatDisplayDate(res.data.rfq.sentAt),
        totalItems: res.data.summary.totalItems,
        totalAmount: res.data.summary.totalAmount,
        submissionDeadline: formatDisplayDate(res.data.rfq.submissionDeadline),
        expectedDelivery: formatDisplayDate(res.data.rfq.expectedDelivery),
        attachments: res.data.rfq.attachments,
        items: res.data.items.map((item) => ({
          id: item.id,
          materialId: item.materialId,
          materialName: item.materialName,
          description: item.description,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          unit: item.unit,
          expectedAmount: item.budget,
          attachments: item.attachments,
        })),
      };
      setRfq(detail);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ??
          "Could not load RFQ details. Please try again.",
      );
    } finally {
      setHasLoaded(true);
    }
  }, [params.id]);

  useEffect(() => {
    void loadRfq();
  }, [loadRfq]);

  // ---------------------------------------------------------------------------
  // Loading skeleton
  // ---------------------------------------------------------------------------

  if (!hasLoaded && !rfq) {
    return (
      <div className="space-y-6">
        {/* Back link skeleton */}
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

        {/* Title skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200" />
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Stat boxes skeleton */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white px-6 py-5 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
          <div className="rounded-lg border border-gray-200">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-gray-100 px-4 py-4 last:border-0"
              >
                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200 shrink-0" />
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                <div className="ml-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!rfq) return null;

  const stats = [
    { label: "Total items", value: rfq.totalItems, bold: false },
    {
      label: "Total Amount",
      value: formatCurrency(rfq.totalAmount),
      bold: true,
    },
    { label: "Submission Deadline", value: rfq.submissionDeadline, bold: true },
    { label: "Expected Delivery", value: rfq.expectedDelivery, bold: true },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-brand-title">{rfq.title}</h1>
            <span className="rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-brand-description">
              {rfq.reference}
            </span>
          </div>
          <p className="text-sm text-brand-description">Sent: {rfq.sentDate}</p>
        </div>

        {/* Submit quote button — sheet wired up later */}
        <Button
          onClick={() => setSubmitSheetOpen(true)}
          className="flex shrink-0 items-center gap-2 bg-brand-primary text-white hover:bg-brand-primary/90"
        >
          <Send className="size-4" />
          Submit quote
        </Button>
      </div>

      {/* Stat boxes */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white px-6 py-5">
            <p className="text-sm text-brand-description">{stat.label}</p>
            <p
              className={
                stat.bold
                  ? "mt-1 text-lg font-bold text-brand-title"
                  : "mt-1 text-lg text-brand-description"
              }
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Requested Items */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-brand-title">
          Requested Items
        </h2>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-[#FAFBFC]">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Material
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Quantity
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Unit
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted text-right">
                  Expected Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfq.items.map((item) => (
                <TableRow key={item.id} className="border-gray-100">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={item.imageUrl || "/imgs/tin.jpg"}
                          alt={item.materialName}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-brand-title">
                        {item.materialName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {item.quantity.toLocaleString("en-NG")}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {item.unit}
                  </TableCell>
                  <TableCell className="text-right font-medium text-brand-title">
                    {formatCurrency(item.expectedAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <SubmitQuoteSheet
        open={submitSheetOpen}
        onOpenChange={setSubmitSheetOpen}
        rfqId={rfq.id}
        rfqReference={rfq.reference}
        items={rfq.items}
        onSuccess={() => void loadRfq()}
      />
    </div>
  );
}
