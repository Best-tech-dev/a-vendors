"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderDetailsTab } from "./_components/order-details-tab";
import { OrderStatusTimeline } from "./_components/order-status-timeline";
import { OrderGRNTab } from "./_components/order-grn-tab";
import { mockOrders } from "@/lib/mock/orders";

function getStatusBadgeStyles(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-badge-green-accent text-badge-green border-0";
    case "In Transit":
      return "bg-badge-yellow-accent text-badge-yellow border-0";
    case "Pending":
      return "bg-badge-yellow-accent text-badge-yellow border-0";
    case "In Production":
      return "bg-blue-50 text-blue-700 border-0";
    case "Cancelled":
      return "bg-badge-red-accent text-badge-red border-0";
    default:
      return "border-0";
  }
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const order = mockOrders.find((o) => o.id === params.id) ?? mockOrders[0];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => router.push("/orders")}
        className="inline-flex items-center gap-1 text-sm text-badge-green hover:text-badge-green/80 font-medium"
      >
        <ChevronLeft className="size-4" />
        Go back
      </button>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-brand-title">
            {order.poNumber}
          </h1>
          <Badge
            variant="outline"
            className={`text-xs ${getStatusBadgeStyles(order.status)}`}
          >
            {order.status}
          </Badge>
        </div>
        <p className="text-sm text-brand-description">
          Created: {order.createdDate}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger
            value="details"
            className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-brand-description data-[state=active]:border-brand-primary data-[state=active]:text-brand-title data-[state=active]:shadow-none"
          >
            Order details
          </TabsTrigger>
          <TabsTrigger
            value="status"
            className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-brand-description data-[state=active]:border-brand-primary data-[state=active]:text-brand-title data-[state=active]:shadow-none"
          >
            Order status
          </TabsTrigger>
          <TabsTrigger
            value="grn"
            className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-brand-description data-[state=active]:border-brand-primary data-[state=active]:text-brand-title data-[state=active]:shadow-none"
          >
            Goods received notes (GRN)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <OrderDetailsTab order={order} />
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <OrderStatusTimeline order={order} />
        </TabsContent>

        <TabsContent value="grn" className="mt-6">
          <OrderGRNTab order={order} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
