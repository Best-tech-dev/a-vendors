"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { UserCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatCard {
  value: string | number;
  label: string;
}

interface QuoteRow {
  reference: string;
  title: string;
  items: number;
  expectedDelivery: string;
  submissionDeadline: string;
}

// ---------------------------------------------------------------------------
// Placeholder data — replace with real API calls
// ---------------------------------------------------------------------------

const stats: StatCard[] = [
  { value: 5, label: "Active Quote Request" },
  { value: 3, label: "Accepted Quotes" },
  { value: 2, label: "Total Inventory" },
  { value: "₦2,260,000", label: "Total Approved Payment" },
];

const quoteRows: QuoteRow[] = [
  {
    reference: "RFRFQ-2026-0042",
    title: "Textbook paper cover",
    items: 3,
    expectedDelivery: "2026-03-01",
    submissionDeadline: "2026-02-15",
  },
  {
    reference: "RFRFQ-2026-0042",
    title: "Textbook paper cover",
    items: 3,
    expectedDelivery: "2026-03-01",
    submissionDeadline: "2026-02-15",
  },
  {
    reference: "RFRFQ-2026-0042",
    title: "Textbook paper cover",
    items: 3,
    expectedDelivery: "2026-03-01",
    submissionDeadline: "2026-02-15",
  },
  {
    reference: "RFRFQ-2026-0042",
    title: "Textbook paper cover",
    items: 3,
    expectedDelivery: "2026-03-01",
    submissionDeadline: "2026-02-15",
  },
  {
    reference: "RFRFQ-2026-0042",
    title: "Textbook paper cover",
    items: 3,
    expectedDelivery: "2026-03-01",
    submissionDeadline: "2026-02-15",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VendorDashboardPage() {
  const profile = useAuthStore((state) => state.profile);

  const companyName = profile?.company_name ?? profile?.first_name ?? "Vendor";

  // Rough profile-completeness check — adjust fields to match your actual
  // profile shape. When all required fields are present, hide the banner.
  const isProfileIncomplete = !profile?.company_name;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-semibold text-brand-title">Dashboard</h1>
        <p className="text-sm text-brand-description">
          Welcome back, {companyName}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-brand-border bg-white p-5"
          >
            <p className="text-2xl font-semibold text-brand-title">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-brand-description">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Profile completion banner */}
      {isProfileIncomplete && (
        <div className="relative flex items-center gap-5 overflow-hidden rounded-xl bg-brand-primary px-6 py-5">
          {/* Decorative blobs — pure CSS, no images needed */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-full w-64 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, #6366f1 0%, transparent 60%), radial-gradient(ellipse at 100% 80%, #8b5cf6 0%, transparent 50%)",
            }}
          />

          {/* Avatar placeholder */}
          <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
            <UserCircle className="size-8 text-white/70" />
          </div>

          {/* Text */}
          <div className="relative z-10 flex-1">
            <p className="font-semibold text-white">
              Your profile is 50% complete, take action now
            </p>
            <p className="mt-0.5 text-sm text-white/70">
              Your profile is missing required documentation. Upload your files
              now to avoid delays in order processing.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/vendor-profile"
            className="relative z-10 flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-primary transition-opacity hover:opacity-90"
          >
            Complete profile setup
            <span aria-hidden>»</span>
          </Link>
        </div>
      )}

      {/* Quotes Request table */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-brand-title">
            Quotes Request
          </h2>
          <Link
            href="/vendor/quotes-request"
            className="text-sm font-medium text-brand-primary underline underline-offset-2 hover:opacity-80"
          >
            See more
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-brand-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-gray-50/60">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-description">
                  Reference
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-description">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-description">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-description">
                  Expected Delivery
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-description">
                  Submission Deadline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {quoteRows.map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3.5 text-brand-title">
                    {row.reference}
                  </td>
                  <td className="px-4 py-3.5 text-brand-title">{row.title}</td>
                  <td className="px-4 py-3.5 text-brand-description">
                    {row.items}
                  </td>
                  <td className="px-4 py-3.5 text-brand-description">
                    {row.expectedDelivery}
                  </td>
                  <td className="px-4 py-3.5 text-brand-description">
                    {row.submissionDeadline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
