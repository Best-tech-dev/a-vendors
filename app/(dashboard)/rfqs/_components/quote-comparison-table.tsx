"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, TrendingDown, TrendingUp, Check } from "lucide-react";
import type { VendorQuote, VendorTag } from "@/types/rfq";

interface QuoteComparisonTableProps {
  quotes: VendorQuote[];
}

function TagBadge({ tag }: { tag: VendorTag }) {
  const config: Record<
    VendorTag,
    { bg: string; text: string; icon?: React.ReactNode }
  > = {
    "Best price": {
      bg: "bg-badge-green-accent",
      text: "text-badge-green",
      icon: <Check className="size-3" />,
    },
    Competitive: {
      bg: "bg-gray-100",
      text: "text-brand-description",
    },
    Review: {
      bg: "bg-badge-yellow-accent",
      text: "text-badge-yellow",
    },
    "Above budget": {
      bg: "bg-badge-red-accent",
      text: "text-badge-red",
    },
  };

  const c = config[tag];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {c.icon}
      {tag}
    </span>
  );
}

function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export function QuoteComparisonTable({ quotes }: QuoteComparisonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-[#FAFBFC]">
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Vendor
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Unit Price
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Total Price
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Quality
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Delivery
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Deviation
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted text-right">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.map((quote) => {
          const isNegativeDeviation = quote.deviation < 0;
          const deviationAbs = Math.abs(quote.deviation);
          const deviationFormatted = `${deviationAbs.toFixed(1)}%`;
          const priceColor =
            quote.tag === "Above budget"
              ? "text-badge-red"
              : "text-badge-green";

          return (
            <TableRow key={quote.id} className="border-gray-100">
              <TableCell>
                <div>
                  <p className="text-sm font-medium text-brand-title">
                    {quote.vendorName}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-brand-title">
                        {quote.rating}
                      </span>
                    </div>
                    <TagBadge tag={quote.tag} />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-brand-description">
                {formatCurrency(quote.unitPrice)}
              </TableCell>
              <TableCell className={`font-semibold ${priceColor}`}>
                {formatCurrency(quote.totalPrice)}
              </TableCell>
              <TableCell className="text-brand-description">
                {quote.quality}%
              </TableCell>
              <TableCell className="text-brand-description">
                {quote.deliveryDays} days
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-brand-description">
                    ₦{(quote.unitPrice + 30).toLocaleString("en-NG")}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                      isNegativeDeviation
                        ? "bg-badge-green-accent text-badge-green"
                        : "bg-badge-red-accent text-badge-red"
                    }`}
                  >
                    {isNegativeDeviation ? (
                      <TrendingDown className="size-3" />
                    ) : (
                      <TrendingUp className="size-3" />
                    )}
                    {deviationFormatted}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm font-medium"
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
