"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronsRight, UserRound } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { dashboardApi } from "@/lib/api/dashboard";
import type { DashboardSummaryData } from "@/types/dashboard";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VendorDashboardPage() {
  const [data, setData] = useState<DashboardSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await dashboardApi.getSummary(5);
        setData(response.data.data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const message =
          axiosError.response?.data?.message ||
          "Failed to load dashboard data. Please try again.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const companyName = data?.greeting.companyName ?? "Vendor";
  const kpis = data?.kpis;
  const profileBanner = data?.profileBanner;
  const quoteRows = data?.recentQuoteRequests ?? [];

  // Format currency amount
  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-semibold text-brand-title">Dashboard</h1>
        <p className="text-sm text-brand-description">
          Welcome back, {companyName}
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-primary"></div>
            <p className="mt-3 text-sm text-brand-description">
              Loading dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Content (visible when not loading) */}
      {!isLoading && data && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-lg border border-brand-border bg-white p-5">
              <p className="text-2xl font-semibold text-brand-title">
                {kpis?.activeQuoteRequests ?? 0}
              </p>
              <p className="mt-1 text-sm text-brand-description">
                Active Quote Request
              </p>
            </div>
            <div className="rounded-lg border border-brand-border bg-white p-5">
              <p className="text-2xl font-semibold text-brand-title">
                {kpis?.acceptedQuotes ?? 0}
              </p>
              <p className="mt-1 text-sm text-brand-description">
                Accepted Quotes
              </p>
            </div>
            <div className="rounded-lg border border-brand-border bg-white p-5">
              <p className="text-2xl font-semibold text-brand-title">
                {kpis?.totalInventory ?? 0}
              </p>
              <p className="mt-1 text-sm text-brand-description">
                Total Inventory
              </p>
            </div>
            <div className="rounded-lg border border-brand-border bg-white p-5">
              <p className="text-2xl font-semibold text-brand-title">
                {formatCurrency(
                  kpis?.totalApprovedPayment.amount ?? 0,
                  kpis?.totalApprovedPayment.currency,
                )}
              </p>
              <p className="mt-1 text-sm text-brand-description">
                Total Approved Payment
              </p>
            </div>
          </div>

          {/* Profile completion banner */}
          {profileBanner && profileBanner.completionPercent < 100 && (
            <div className="relative flex items-center gap-5 overflow-hidden rounded-[10px] bg-brand-primary px-6 py-5">
              {/* SVG background image — positioned right, vertically centered */}
              <Image
                aria-hidden
                src="/svgs/background-gradient.svg"
                alt=""
                width={200}
                height={200}
                className="pointer-events-none absolute -right-10 top-1/2 h-[160%] w-auto -translate-y-1/2 object-cover select-none"
              />

              {/* Avatar placeholder */}
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F5F7F9] border-4 border-brand-border">
                <UserRound className="size-8 text-brand-primary" />
              </div>

              {/* Text */}
              <div className="relative z-10 flex-1">
                <p className="font-medium text-white">
                  Your profile is {profileBanner.completionPercent}% complete,
                  take action now
                </p>
                <p className="mt-0.5 text-sm text-white/70">
                  {profileBanner.message}
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/vendor-profile"
                className="relative z-10 flex shrink-0 items-center gap-2 rounded-sm bg-white px-5 py-2.5 text-sm font-semibold text-brand-primary transition-opacity hover:opacity-90"
              >
                {profileBanner.ctaLabel}
                <ChevronsRight className="size-4" />
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

            {quoteRows.length > 0 ? (
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
                    {quoteRows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-3.5 text-brand-title">
                          {row.reference}
                        </td>
                        <td className="px-4 py-3.5 text-brand-title">
                          {row.title}
                        </td>
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
            ) : (
              <div className="rounded-lg border border-brand-border bg-gray-50 py-8 text-center">
                <p className="text-sm text-brand-description">
                  No quote requests yet
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
