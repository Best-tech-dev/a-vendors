"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";

interface OrderStatusTimelineProps {
  order: Order;
}

export function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <h2 className="text-lg font-bold text-brand-title">Timeline overview</h2>

      {/* Vertical Timeline */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="relative">
          {order.timeline.map((step, index) => {
            const isLast = index === order.timeline.length - 1;

            return (
              <div key={index} className="relative flex gap-6">
                {/* Left column: dot + connector line */}
                <div className="flex flex-col items-center">
                  {/* Dot */}
                  {step.status === "completed" ? (
                    <div className="z-10 h-3.5 w-3.5 shrink-0 rounded-full bg-brand-primary" />
                  ) : step.status === "active" ? (
                    <div className="z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-brand-primary bg-white" />
                  ) : (
                    <div className="z-10 h-3.5 w-3.5 shrink-0 rounded-full bg-gray-300" />
                  )}

                  {/* Connecting line */}
                  {!isLast && (
                    <div
                      className={`w-px flex-1 min-h-12 ${
                        step.status === "completed"
                          ? "bg-brand-primary"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Right column: content */}
                <div className={`flex-1 pb-8 ${isLast ? "pb-0" : ""}`}>
                  <div className="flex items-start justify-between -mt-0.5">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          step.status === "completed"
                            ? "text-brand-title"
                            : step.status === "active"
                              ? "text-badge-green"
                              : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`mt-0.5 text-sm ${
                          step.status === "upcoming"
                            ? "text-gray-400"
                            : "text-brand-description"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Timestamp or Action */}
                    <div className="shrink-0 text-right ml-4">
                      {step.timestamp && (
                        <p className="text-sm text-brand-description">
                          {step.timestamp}
                        </p>
                      )}
                      {step.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 rounded-full border-brand-primary text-brand-title text-xs"
                        >
                          Update status
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Card */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div>
          <h3 className="text-base font-bold text-brand-title">
            Ready to Create GRN
          </h3>
          <p className="mt-1 text-sm text-brand-description">
            Order has been delivered. Create a Goods Received Note to proceed
            with invoicing.
          </p>
        </div>
        <Button className="shrink-0 bg-brand-primary">Create GRN</Button>
      </div>
    </div>
  );
}
