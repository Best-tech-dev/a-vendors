import { Star, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const stats = [
  { label: "Total Vendors", value: 5 },
  { label: "Total Materials", value: 3 },
  { label: "Active RFQs", value: 2 },
  { label: "Pending Orders", value: 3 },
  { label: "Pending Invoices", value: 5 },
  { label: "Pending Payments", value: 3 },
  { label: "Total Team Members", value: 2 },
];

const quickActions = [
  { label: "Add Team Member", href: "#" },
  { label: "Create RFQ", href: "#" },
  { label: "New Purchase Order", href: "#" },
  { label: "Add Vendor", href: "#" },
];

const topVendors = [
  {
    id: 1,
    name: "Global Logistics Partners",
    status: "Active" as const,
    industry: "Electronics & Components",
    rating: 4.8,
    location: "Lagos, Nigeria",
  },
  {
    id: 2,
    name: "Global Logistics Partners",
    status: "Active" as const,
    industry: "Electronics & Components",
    rating: 4.8,
    location: "Lagos, Nigeria",
  },
  {
    id: 3,
    name: "Global Logistics Partners",
    status: "Active" as const,
    industry: "Electronics & Components",
    rating: 4.8,
    location: "Lagos, Nigeria",
  },
  {
    id: 4,
    name: "Global Logistics Partners",
    status: "Active" as const,
    industry: "Electronics & Components",
    rating: 4.8,
    location: "Lagos, Nigeria",
  },
];

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
          <Card key={stat.label}>
            <CardContent className="px-5 py-5">
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Button key={action.label} size="lg" className="h-12 w-full" asChild>
            <Link href={action.href}>
              <Plus className="size-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Top vendors */}
      <div>
        <div className="mb-4 flex items-center justify-between">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {topVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Vendor Card ─────────────────────────────────────────────────────────────

interface Vendor {
  id: number;
  name: string;
  status: "Active";
  industry: string;
  rating: number;
  location: string;
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="px-5 py-5">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-brand-title">
              {vendor.name}
            </h3>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {vendor.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-brand-title">
              {vendor.rating}
            </span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-brand-description">{vendor.industry}</p>
          <p className="text-sm text-brand-description">{vendor.location}</p>
        </div>
      </CardContent>
    </Card>
  );
}
