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
import type { Vendor, DocStatus } from "@/types/vendor";

interface VendorDetailsSheetProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SheetTab = "contact" | "performance" | "compliance";

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function DocStatusBadge({ status }: { status: DocStatus }) {
  return (
    <span
      className={`text-sm font-medium ${
        status === "Valid" ? "text-green-600" : "text-red-500"
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
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="pb-4">
          <div>
            <div className="flex items-center">
              <SheetTitle className="text-xl font-bold text-gray-900">
                {vendor.name}
              </SheetTitle>
              <StatusBadge status={vendor.status} />
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{vendor.category}</p>
          </div>
        </SheetHeader>

        {/* Tab Switcher */}
        <div className="mb-6 flex rounded-lg bg-gray-900 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-300 hover:text-white"
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
                <span className="text-sm text-gray-500">Joined:</span>
                <span className="text-sm font-medium text-gray-900">
                  {vendor.joinedDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Email:</span>
                <span className="text-sm font-medium text-gray-900">
                  {vendor.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Phone:</span>
                <span className="text-sm font-medium text-gray-900">
                  {vendor.phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">City:</span>
                <span className="text-sm font-medium text-gray-900">
                  {vendor.city}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Country:</span>
                <span className="text-sm font-medium text-gray-900">
                  {vendor.country}
                </span>
              </div>
            </div>

            {/* Bank Details */}
            <div className="rounded-lg bg-gray-50 p-5">
              <h4 className="mb-4 text-sm font-semibold text-gray-900">
                Vendor Bank Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500">Bank</span>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {vendor.bankDetails.bank}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Account Number:</span>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {vendor.bankDetails.accountNumber}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xs text-gray-500">Account Name:</span>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                  {vendor.bankDetails.accountName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="flex flex-col">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {vendor.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Orders:</span>
                <span className="text-sm font-medium text-gray-900">
                  {vendor.totalOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Spend:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(vendor.totalSpend)}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <span className="text-sm text-gray-500">Notes:</span>
              {vendor.notes.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-indigo-50 p-4">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="10"
                        stroke="#4338CA"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M26 26L32 32"
                        stroke="#4338CA"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M14 18h8M18 14v8"
                        stroke="#6366F1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">
                    No notes attached to this vendor yet
                  </p>
                </div>
              ) : (
                <ul className="mt-2 space-y-2">
                  {vendor.notes.map((note, i) => (
                    <li
                      key={i}
                      className="rounded-md bg-gray-50 p-3 text-sm text-gray-700"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8">
              <Button className="w-full bg-gray-900 hover:bg-gray-800">
                Add notes
              </Button>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === "compliance" && (
          <div className="space-y-3">
            {vendor.documents.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-400">
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
                      src={doc.thumbnail || "/placeholder.svg"}
                      alt={doc.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">{doc.type}</p>
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
