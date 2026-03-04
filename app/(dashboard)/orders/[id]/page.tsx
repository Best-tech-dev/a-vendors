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
        className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-primary font-medium"
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
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto bg-brand-primary p-1">
            <TabsList className="flex h-auto! w-max min-w-full gap-1 border-0 bg-transparent p-0">
              <TabsTrigger
                value="details"
                className="h-auto! shrink-0 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors text-brand-border hover:text-brand-border/90 data-[state=active]:border data-[state=active]:border-gray-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Order details
              </TabsTrigger>
              <TabsTrigger
                value="status"
                className="h-auto! shrink-0 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors text-brand-border hover:text-brand-border/90 data-[state=active]:border data-[state=active]:border-gray-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Order status
              </TabsTrigger>
              <TabsTrigger
                value="grn"
                className="h-auto! shrink-0 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors text-brand-border hover:text-brand-border/90 data-[state=active]:border data-[state=active]:border-gray-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Goods received notes (GRN)
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

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
