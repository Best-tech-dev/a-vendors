"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QuoteComparisonTable } from "../_components/quote-comparison-table";
import { AnalysisCard } from "../_components/analysis-card";
import { mockRFQDetail } from "@/lib/mock/rfqs";

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export default function RFQDetailsPage() {
  const router = useRouter();
  const detail = mockRFQDetail;
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const currentItem = detail.items[activeItemIndex];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => router.push("/rfqs")}
        className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-900 font-medium"
      >
        <ChevronLeft className="size-4" />
        Back to RFQs
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">{detail.title}</h1>
          <Badge
            variant="outline"
            className="text-xs text-gray-500 border-gray-300"
          >
            {detail.rfqId}
          </Badge>
        </div>
        <span className="text-sm text-gray-500 shrink-0">
          Items: {detail.totalItems}
        </span>
      </div>

      {/* Item Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-brand-primary p-1 w-fit overflow-x-auto max-w-full">
        {detail.items.map((item, index) => (
          <button
            key={item.itemName}
            onClick={() => setActiveItemIndex(index)}
            className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeItemIndex === index
                ? "border border-gray-300 bg-white text-gray-900 shadow-sm"
                : "text-brand-border hover:text-brand-border/90"
            }`}
          >
            {item.itemName}
          </button>
        ))}
      </div>

      {/* Summary Row */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Quantity
            </p>
            <p className="mt-1.5 text-xl font-bold text-gray-900">
              {currentItem.quantity.toLocaleString()} {currentItem.unit}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Budget
            </p>
            <p className="mt-1.5 text-xl font-bold text-gray-900">
              {formatCurrency(currentItem.budget)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Best price
            </p>
            <p className="mt-1.5 text-xl font-bold text-gray-900">
              {formatCurrency(currentItem.bestPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Average price
            </p>
            <p className="mt-1.5 text-xl font-bold text-gray-900">
              {formatCurrency(currentItem.averagePrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto">
        <QuoteComparisonTable quotes={currentItem.quotes} />
      </div>

      {/* Analysis & Recommendations */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Analysis & Recommendations
        </h2>
        <div className="space-y-3">
          {detail.analysis.map((rec, index) => (
            <AnalysisCard
              key={index}
              variant={rec.variant}
              label={rec.label}
              vendorName={rec.vendorName}
              description={rec.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
