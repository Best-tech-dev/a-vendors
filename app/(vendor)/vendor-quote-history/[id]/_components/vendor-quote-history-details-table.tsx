"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, Download, ChevronDown, X } from "lucide-react";
import type {
  VendorQuoteHistoryDetail,
  FulfillmentTimelineEntry,
  FulfillmentPayment,
} from "@/types/rfq";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

/** Format an ISO date string to a human-readable date like "Feb 20, 2026" */
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Format an ISO date string to a timestamp like "Feb 4, 2026 at 2:37 PM" */
function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const datePart = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} at ${timePart}`;
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Status badge — for the overall quote status in the heading
// ---------------------------------------------------------------------------

const HEADING_STATUS_STYLES: Record<string, string> = {
  awarded: "border border-emerald-400 text-emerald-600",
  pending: "border border-amber-400 text-amber-600",
  rejected: "border border-red-400 text-red-500",
  withdrawn: "border border-gray-300 text-brand-description",
};

export function HeadingStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const styles =
    HEADING_STATUS_STYLES[key] ??
    "border border-gray-300 text-brand-description";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium",
        styles,
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Per-row quote status badge (Accepted quote / Rejected quote)
// ---------------------------------------------------------------------------

const ROW_STATUS_STYLES: Record<string, string> = {
  accepted: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-500",
};

function RowStatusBadge({
  label,
  decision,
}: {
  label: string;
  decision: string;
}) {
  const key = decision.toLowerCase();
  const styles = ROW_STATUS_STYLES[key] ?? "bg-gray-100 text-brand-description";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium",
        styles,
      )}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Stat box row
// ---------------------------------------------------------------------------

export interface StatItem {
  label: string;
  value: string;
}

export function StatRow({ stats }: { stats: StatItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="grid grid-cols-2 divide-x divide-gray-200 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 py-5">
            <p className="text-sm text-brand-description">{stat.label}</p>
            <p className="mt-1 text-lg font-bold text-brand-title">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quote row within a material card
// ---------------------------------------------------------------------------

interface QuoteRowProps {
  quantity: string;
  quality: string;
  possibleDelivery: string;
  pricePerUnit: number;
  totalPrice: number;
  decision: string;
  decisionLabel: string;
}

function QuoteRow({
  quantity,
  quality,
  possibleDelivery,
  pricePerUnit,
  totalPrice,
  decision,
  decisionLabel,
}: QuoteRowProps) {
  return (
    <div className="flex items-center gap-4 border-t border-gray-100 py-4">
      {/* Fields grid */}
      <div className="flex flex-1 flex-wrap gap-x-8 gap-y-3">
        <div>
          <p className="text-xs text-brand-description">Quantity</p>
          <p className="mt-0.5 text-sm font-medium text-brand-title">
            {quantity}
          </p>
        </div>
        <div>
          <p className="text-xs text-brand-description">Quality</p>
          <p className="mt-0.5 text-sm font-medium text-brand-title">
            {quality}
          </p>
        </div>
        <div>
          <p className="text-xs text-brand-description">Possible delivery</p>
          <p className="mt-0.5 text-sm font-medium text-brand-title">
            {possibleDelivery}
          </p>
        </div>
        <div>
          <p className="text-xs text-brand-description">Price per unit</p>
          <p className="mt-0.5 text-sm font-medium text-brand-title">
            {formatCurrency(pricePerUnit)}
          </p>
        </div>
        <div>
          <p className="text-xs text-brand-description">Total price</p>
          <p className="mt-0.5 text-sm font-medium text-brand-title">
            {formatCurrency(totalPrice)}
          </p>
        </div>
      </div>

      {/* Status badge — right aligned */}
      <div className="shrink-0">
        <RowStatusBadge label={decisionLabel} decision={decision} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Material card
// ---------------------------------------------------------------------------

function MaterialCard({
  item,
}: {
  item: VendorQuoteHistoryDetail["items"][number];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-6 py-4">
      <p className="font-semibold text-brand-title">{item.materialName}</p>
      {item.priceOptions.map((opt) => (
        <QuoteRow
          key={opt.id}
          quantity={`${item.quantity.toLocaleString("en-NG")} ${item.unit}`}
          quality={opt.quality}
          possibleDelivery={formatDate(opt.possibleDeliveryAt)}
          pricePerUnit={opt.pricePerUnit}
          totalPrice={opt.totalPrice}
          decision={opt.decision}
          decisionLabel={opt.decisionLabel}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview tab content
// ---------------------------------------------------------------------------

export function OverviewTab({
  items,
}: {
  items: VendorQuoteHistoryDetail["items"];
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-brand-title">
        Requested Items
      </h2>
      {items.map((item) => (
        <MaterialCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment Proof Modal
// ---------------------------------------------------------------------------

interface PaymentProofModalProps {
  filename: string;
  fileType: string;
  downloadUrl: string;
  onClose: () => void;
}

function PaymentProofModal({
  filename,
  fileType,
  downloadUrl,
  onClose,
}: PaymentProofModalProps) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-brand-title">
            Payment Proof
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-brand-description transition-colors hover:bg-gray-100 hover:text-brand-title"
          >
            <X size={18} />
          </button>
        </div>

        {/* File row */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
          {/* File thumbnail placeholder */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-amber-100 text-amber-700">
            <span className="text-xs font-bold uppercase">
              {fileType.split(".").pop()?.slice(0, 3) ?? "IMG"}
            </span>
          </div>

          {/* File info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-brand-title">
              {filename}
            </p>
            <p className="text-xs text-brand-description">{fileType}</p>
          </div>

          {/* Download button */}
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={filename}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-brand-title transition-colors hover:bg-gray-50"
          >
            <Download size={13} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Update Status Dropdown — stage transitions
// ---------------------------------------------------------------------------

/**
 * Allowed transitions from the Swagger doc:
 *   created → in_production
 *   in_production → in_transit
 *   in_transit → delivered
 *
 * We show only the valid *next* stage for the current order stage.
 */
const NEXT_STAGE: Record<string, { value: string; label: string } | null> = {
  created: { value: "in_production", label: "Start Production" },
  in_production: { value: "in_transit", label: "Mark as Shipped" },
  in_transit: { value: "delivered", label: "Mark as Delivered" },
  delivered: null,
  cancelled: null,
};

interface UpdateStatusDropdownProps {
  currentStage: string;
  disabled?: boolean;
  loading?: boolean;
  onSelect: (stage: string) => void;
}

function UpdateStatusDropdown({
  currentStage,
  disabled = false,
  loading = false,
  onSelect,
}: UpdateStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const next = NEXT_STAGE[currentStage];

  // Nothing to transition to
  if (!next) return null;

  return (
    <div className="relative">
      <button
        disabled={disabled || loading}
        onClick={() => !disabled && !loading && setOpen((p) => !p)}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
          disabled || loading
            ? "cursor-not-allowed bg-brand-title/80 text-white opacity-60"
            : "cursor-pointer bg-brand-title text-white hover:bg-brand-title/90",
        )}
      >
        {loading ? "Updating…" : "Update status"}
        <ChevronDown size={13} />
      </button>

      {open && (
        <>
          {/* Click-away overlay */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1.5 min-w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <button
              className="w-full px-4 py-2 text-left text-sm text-brand-title transition-colors hover:bg-gray-50"
              onClick={() => {
                onSelect(next.value);
                setOpen(false);
              }}
            >
              {next.label}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single timeline step
// ---------------------------------------------------------------------------

interface TimelineStepRowProps {
  entry: FulfillmentTimelineEntry;
  payment?: FulfillmentPayment;
  isLast: boolean;
  currentStage: string;
  updatingStage: boolean;
  onViewProof: (payment: FulfillmentPayment) => void;
  onUpdateStage: (stage: string) => void;
}

function TimelineStepRow({
  entry,
  payment,
  isLast,
  currentStage,
  updatingStage,
  onViewProof,
  onUpdateStage,
}: TimelineStepRowProps) {
  const isActive = entry.state === "active";
  const isDone = entry.state === "done";
  const isReached = isActive || isDone;
  const isStage = entry.type === "stage";

  return (
    <div className="flex gap-4">
      {/* Bullet + connector line */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "mt-0.5 h-3 w-3 shrink-0 rounded-full",
            isReached ? "bg-brand-title" : "bg-gray-300",
          )}
        />
        {!isLast && <span className="mt-1 w-px flex-1 bg-gray-200" />}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-1 items-start justify-between gap-4 pb-8",
          isLast && "pb-0",
        )}
      >
        {/* Left: label + timestamp */}
        <div>
          <p
            className={cn(
              "text-sm font-semibold",
              isReached ? "text-brand-title" : "text-brand-description",
            )}
          >
            {entry.label}
          </p>
          <p
            className={cn(
              "mt-0.5 text-xs",
              isReached ? "text-brand-description" : "text-gray-400",
            )}
          >
            {formatTimestamp(entry.occurredAt)}
          </p>
        </div>

        {/* Right: optional amount / proof / status badge / update button */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Amount (e.g. 50% payment) */}
          {entry.amount != null && (
            <span className="text-sm font-semibold text-brand-title">
              {formatCurrency(entry.amount)}
            </span>
          )}

          {/* View payment proof */}
          {entry.hasProof && payment?.proof && (
            <button
              onClick={() => onViewProof(payment)}
              className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-brand-description transition-colors hover:text-brand-title"
            >
              <Eye size={14} />
              View payment proof
            </button>
          )}

          {/* Active / Inactive badge — only for stage entries */}
          {isStage && (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                isActive
                  ? "text-emerald-600"
                  : isDone
                    ? "text-brand-description"
                    : "text-brand-description",
              )}
            >
              {isActive ? "Active" : isDone ? "" : "Inactive"}
            </span>
          )}

          {/* Update status dropdown — only for stage entries that can be transitioned */}
          {isStage && (isActive || entry.state === "pending") && (
            <UpdateStatusDropdown
              currentStage={currentStage}
              disabled={!isActive}
              loading={updatingStage}
              onSelect={onUpdateStage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order Fulfillment Timeline tab
// ---------------------------------------------------------------------------

export function TimelineTab({
  timeline,
  payments,
  currentStage,
  updatingStage,
  onUpdateStage,
}: {
  timeline: FulfillmentTimelineEntry[];
  payments: FulfillmentPayment[];
  currentStage: string;
  updatingStage: boolean;
  onUpdateStage: (stage: string) => void;
}) {
  const [proofPayment, setProofPayment] = useState<FulfillmentPayment | null>(
    null,
  );

  // Build a map of payment id → payment for quick lookup
  const paymentMap = new Map(payments.map((p) => [p.id, p]));

  return (
    <>
      <div className="space-y-0 rounded-lg border border-gray-200 bg-white px-6 py-6">
        <h2 className="mb-6 text-base font-semibold text-brand-title">
          Order Fulfillment Timeline
        </h2>
        <div>
          {timeline.map((entry, idx) => (
            <TimelineStepRow
              key={entry.id}
              entry={entry}
              payment={paymentMap.get(entry.id)}
              isLast={idx === timeline.length - 1}
              currentStage={currentStage}
              updatingStage={updatingStage}
              onViewProof={setProofPayment}
              onUpdateStage={onUpdateStage}
            />
          ))}
        </div>
      </div>

      {/* Payment proof modal */}
      {proofPayment?.proof && (
        <PaymentProofModal
          filename={proofPayment.proof.originalFilename}
          fileType={
            proofPayment.proof.originalFilename.split(".").pop() ?? "img"
          }
          downloadUrl={proofPayment.proof.url}
          onClose={() => setProofPayment(null)}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Timeline loading skeleton
// ---------------------------------------------------------------------------

export function TimelineSkeleton() {
  return (
    <div className="space-y-0 rounded-lg border border-gray-200 bg-white px-6 py-6">
      <div className="mb-6 h-5 w-56 animate-pulse rounded bg-gray-200" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="mt-0.5 h-3 w-3 shrink-0 animate-pulse rounded-full bg-gray-200" />
            {i < 3 && <span className="mt-1 w-px flex-1 bg-gray-100" />}
          </div>
          <div className="flex flex-1 items-start justify-between gap-4 pb-8">
            <div className="space-y-1.5">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-44 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton (shared between page states)
// ---------------------------------------------------------------------------

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
      <div className="flex items-center gap-3">
        <div className="h-7 w-56 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-2 divide-x divide-gray-200 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 px-6 py-5">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
      {/* Tab skeletons */}
      <div className="flex gap-2">
        <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-9 w-44 animate-pulse rounded-lg bg-gray-200" />
      </div>
      {/* Card skeletons */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-lg border border-gray-200 bg-white px-6 py-4"
        >
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          {Array.from({ length: 2 }).map((_, j) => (
            <div
              key={j}
              className="flex items-center gap-4 border-t border-gray-100 pt-4"
            >
              <div className="flex flex-1 gap-8">
                {Array.from({ length: 5 }).map((_, k) => (
                  <div key={k} className="space-y-1.5">
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
              <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
