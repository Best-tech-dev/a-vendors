"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import type { Vendor, VendorStatus, DocStatus } from "@/types/vendor";

interface VendorDetailsSheetProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SheetTab = "contact" | "performance" | "compliance";

function StatusBadge({ status }: { status: VendorStatus }) {
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "active"
          ? "bg-[#F0F8F5] text-[#008753]"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

function DocStatusBadge({ status }: { status: DocStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${
        status === "Valid"
          ? "bg-[#F0F8F5] text-[#008753]"
          : "bg-[#CE030305] text-[#CE0303]"
      }`}
    >
      {status}
    </span>
  );
}

export function VendorDetailsSheet({
  vendor,
  open,
  onOpenChange,
}: VendorDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState<SheetTab>("contact");

  if (!vendor) return null;

  const tabs: { key: SheetTab; label: string }[] = [
    { key: "contact", label: "Contact info" },
    { key: "performance", label: "Performance" },
    { key: "compliance", label: "Compliance doc" },
  ];

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-4 sm:p-8 sm:max-w-lg">
        <SheetHeader className="p-0 pb-4">
          <div>
            <div className="flex items-center">
              <SheetTitle className="text-xl font-bold text-brand-title">
                {vendor.name}
              </SheetTitle>
              <StatusBadge status={vendor.status} />
            </div>
            <p className="mt-0.5 text-sm text-brand-description">
              {vendor.city}, {vendor.country}
            </p>
          </div>
        </SheetHeader>

        {/* Tab Switcher */}
        <div className="mb-6 flex flex-nowrap rounded-lg bg-brand-primary p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 sm:flex-1 ${
                activeTab === tab.key
                  ? "bg-white text-brand-title shadow-sm"
                  : "text-brand-border hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contact Info Tab */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Joined:</span>
                <span className="text-sm font-medium text-brand-title">
                  {new Date(vendor.createdAt).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Email:</span>
                <span className="text-sm font-medium text-brand-title">
                  {vendor.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Phone:</span>
                <span className="text-sm font-medium text-brand-title">
                  {vendor.phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">City:</span>
                <span className="text-sm font-medium text-brand-title">
                  {vendor.city}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Country:</span>
                <span className="text-sm font-medium text-brand-title">
                  {vendor.country}
                </span>
              </div>
            </div>

            {/* Bank Details */}
            {vendor.bankDetail ? (
              <div className="rounded-lg bg-[#F8FAFC] p-5">
                <h4 className="mb-4 text-sm font-semibold text-brand-title">
                  Vendor Bank Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-brand-description">Bank</span>
                    <p className="mt-0.5 text-sm font-semibold text-brand-title">
                      {vendor.bankDetail.bank}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-brand-description">
                      Account Number:
                    </span>
                    <p className="mt-0.5 text-sm font-semibold text-brand-title">
                      {vendor.bankDetail.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-brand-description">
                    Account Name:
                  </span>
                  <p className="mt-0.5 text-sm font-semibold text-brand-title">
                    {vendor.bankDetail.accountName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-[#F8FAFC] p-5 text-center">
                <p className="text-sm text-brand-description">
                  No bank details available
                </p>
              </div>
            )}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="flex flex-col">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-brand-title">
                    {vendor.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">
                  Total Orders:
                </span>
                <span className="text-sm font-medium text-brand-title">
                  {vendor.totalOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">
                  Total Spend:
                </span>
                <span className="text-sm font-medium text-brand-title">
                  {formatCurrency(vendor.totalSpend)}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <span className="text-sm text-brand-description">Notes:</span>
              {!vendor.notes || vendor.notes.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center">
                  <Image
                    src="/svgs/search_empty.svg"
                    alt="No notes"
                    width={100}
                    height={50}
                  />

                  <p className="mt-3 text-sm text-brand-description">
                    No notes attached to this vendor yet
                  </p>
                </div>
              ) : (
                <ul className="mt-2 space-y-2">
                  {vendor.notes.map((note, i) => (
                    <li
                      key={i}
                      className="rounded-md bg-gray-50 p-3 text-sm text-brand-description"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8">
              <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">
                Add notes
              </Button>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === "compliance" && (
          <div className="space-y-3">
            {vendor.documents.length === 0 ? (
              <p className="py-12 text-center text-sm text-brand-description">
                No compliance documents uploaded
              </p>
            ) : (
              vendor.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={doc.thumbnail || "/imgs/tin.jpg"}
                      alt={doc.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-title">
                      {doc.name}
                    </p>
                    <p className="text-xs text-brand-description">{doc.type}</p>
                  </div>
                  <DocStatusBadge status={doc.status} />
                </div>
              ))
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
