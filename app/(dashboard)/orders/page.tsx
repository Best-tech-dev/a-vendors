"use client";

import { useState } from "react";
import { Plus, ShoppingCart, Clock, Truck, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import { OrdersTable } from "./_components/orders-table";
import { mockOrders } from "@/lib/mock/orders";
import Image from "next/image";

type OrderFilter = "all" | "in-progress" | "delivered";

export default function OrdersPage() {
  const [isEmpty] = useState(false);
  const [filter, setFilter] = useState<OrderFilter>("all");

  const orders = isEmpty ? [] : mockOrders;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const inTransitOrders = orders.filter(
    (o) => o.status === "In Transit",
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  const filteredOrders = orders.filter((o) => {
    if (filter === "in-progress")
      return (
        o.status === "Pending" ||
        o.status === "In Production" ||
        o.status === "In Transit"
      );
    if (filter === "delivered") return o.status === "Delivered";
    return true;
  });

  const filterTabs: { key: OrderFilter; label: string }[] = [
    { key: "all", label: "All orders" },
    { key: "in-progress", label: "In progress" },
    { key: "delivered", label: "Delivered" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-title">Orders</h1>
          <p className="text-sm text-brand-description">
            Track and manage purchase orders
          </p>
        </div>
        <Button className="w-fit bg-brand-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create order
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No orders found"
            description="Get started by creating your first purchase order."
            actionLabel="Create order"
            onAction={() => {}}
            image={
              <Image
                src="/svgs/empty-inbox-with-shadow.svg"
                alt="No orders"
                width={100}
                height={100}
              />
            }
          />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              value={totalOrders}
              label="Total orders"
              icon={ShoppingCart}
            />
            <StatsCard value={pendingOrders} label="Pending" icon={Clock} />
            <StatsCard
              value={inTransitOrders}
              label="In transit"
              icon={Truck}
            />
            <StatsCard
              value={deliveredOrders}
              label="Delivered"
              icon={PackageCheck}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-brand-primary p-1 w-full overflow-x-auto max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  filter === tab.key
                    ? "border border-gray-300 bg-white text-gray-900 shadow-sm"
                    : "text-brand-border hover:text-brand-border/90"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <OrdersTable orders={filteredOrders} />
          </div>
        </>
      )}
    </div>
  );
}
