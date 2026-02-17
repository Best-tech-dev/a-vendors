import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VendorCard } from "@/components/dashboard/vendor-card";
import { Vendor } from "@/types/vendor";
import {
  stats,
  quickActions,
  getTopVendors,
} from "@/components/dashboard/mock-data/top-vendors";

// ─── Mock Data (moved to components/dashboard/mock-data/top-vendors.ts) ───

const topVendors: Vendor[] = getTopVendors(6);

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-title">Dashboard</h1>
          <p className="mt-1 text-sm text-brand-description">
            Welcome back! You&apos;re logged in as an Executive
          </p>
        </div>
        <Button size="lg" className="w-fit">
          <Plus className="size-4" />
          Add team member
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white">
            <CardContent className="px-5 py-0">
              <p className="text-3xl font-bold text-brand-title">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-brand-description">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-brand-title mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              size="lg"
              className="h-12 w-full"
              asChild
            >
              <Link href={action.href}>
                <Plus className="size-4" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Top vendors */}
      <div className="mt-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Vendor Card 1 */}
          <Card className="flex flex-col pt-0">
            <CardContent className="px-5 pt-5 pb-0 flex-1 flex flex-col">
              {/* Fixed header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-title">
                  Top Vendors
                </h2>
                <Link
                  href="/vendors"
                  className="text-sm font-medium text-brand-description underline underline-offset-4 hover:text-brand-title"
                >
                  See more
                </Link>
              </div>

              {/* Scrollable vendor cards */}
              <div className="flex-1 overflow-y-auto max-h-100 pb-5 space-y-3">
                {topVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Card 2 */}
          <Card className="flex flex-col pt-0">
            <CardContent className="px-5 pt-5 pb-0 flex-1 flex flex-col">
              {/* Fixed header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-title">
                  Top Vendors
                </h2>
                <Link
                  href="/vendors"
                  className="text-sm font-medium text-brand-description underline underline-offset-4 hover:text-brand-title"
                >
                  See more
                </Link>
              </div>

              {/* Scrollable vendor cards */}
              <div className="flex-1 overflow-y-auto max-h-100 pb-5 space-y-3">
                {topVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
