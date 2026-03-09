"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Check, X, SquarePen } from "lucide-react";
import Image from "next/image";
import type { Expense, ExpenseStatus, FooterAction, TimelineStep } from "@/types/expense";
import { formatCurrency } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const config: Record<ExpenseStatus, { bg: string; text: string }> = {
    Pending: { bg: "bg-badge-yellow-accent", text: "text-badge-yellow" },
    Approved: { bg: "bg-badge-green-accent", text: "text-badge-green" },
    Rejected: { bg: "bg-badge-red-accent", text: "text-badge-red" },
    Amendment: { bg: "bg-blue-50", text: "text-blue-700" },
  };
  const c = config[status];
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Vertical Timeline
// ---------------------------------------------------------------------------

function VerticalTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <h3 className="mb-4 text-base font-semibold text-brand-title">
        Timeline Summary
      </h3>

      <div className="relative">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-4">
              {/* Vertical line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 ${
                    step.completed
                      ? "border-brand-primary bg-brand-primary"
                      : "border-gray-300 bg-white"
                  }`}
                />
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 ${
                      step.completed ? "bg-brand-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 ${!step.completed ? "opacity-40" : ""}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-brand-title">
                    {step.title}
                  </p>
                  {step.reviewedBy && (
                    <span className="inline-flex items-center rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-brand-description">
                      Reviewed by: {step.reviewedBy}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-brand-description">
                  {step.date ?? "–"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expense Details Sheet
// ---------------------------------------------------------------------------

interface ExpenseDetailsSheetProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footerAction?: FooterAction;
}

export function ExpenseDetailsSheet({
  expense,
  open,
  onOpenChange,
  footerAction = "amend",
}: ExpenseDetailsSheetProps) {
  const [amendmentMode, setAmendmentMode] = useState(false);
  const [amendmentNote, setAmendmentNote] = useState("");

  if (!expense) return null;

  const handleApprove = () => {
    console.log("Approve expense:", expense.expenseId);
    onOpenChange(false);
  };

  const handleReject = () => {
    console.log("Reject expense:", expense.expenseId);
    onOpenChange(false);
  };

  const handleSendAmendment = () => {
    console.log("Send amendment:", expense.expenseId, amendmentNote);
    setAmendmentMode(false);
    setAmendmentNote("");
    onOpenChange(false);
  };

  const footerActionConfig: Record<
    FooterAction,
    { label: string; onClick: () => void }
  > = {
    edit: {
      label: "Edit submission",
      onClick: () => console.log("Edit submission:", expense.expenseId),
    },
    amend: {
      label: "Send back for amendment",
      onClick: () => setAmendmentMode(true),
    },
    escalate: {
      label: "Escalate to MD",
      onClick: () => console.log("Escalate to MD:", expense.expenseId),
    },
  };

  const activeFooterAction = footerActionConfig[footerAction];

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setAmendmentMode(false);
          setAmendmentNote("");
        }
        onOpenChange(v);
      }}
    >
      <SheetContent className="flex w-full flex-col overflow-y-auto p-0 sm:max-w-lg">
        {/* Header */}
        <SheetHeader className="px-4 pt-4 sm:px-8 sm:pt-8">
          <div>
            <div className="flex items-center">
              <SheetTitle className="text-xl font-bold text-brand-title">
                {expense.title}
              </SheetTitle>
              <StatusBadge status={expense.status} />
            </div>
            <p className="mt-0.5 text-sm text-brand-description">
              {expense.expenseId}
            </p>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex-1 px-4 pb-4 sm:px-8 sm:pb-8">
          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="mb-6 flex w-full rounded-lg bg-brand-primary p-1">
              <TabsTrigger
                value="general"
                className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-brand-border transition-colors data-[state=active]:bg-white data-[state=active]:text-brand-title data-[state=active]:shadow-sm"
              >
                General info
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-brand-border transition-colors data-[state=active]:bg-white data-[state=active]:text-brand-title data-[state=active]:shadow-sm"
              >
                Timeline
              </TabsTrigger>
            </TabsList>

            {/* General Info Tab */}
            <TabsContent value="general">
              {amendmentMode ? (
                <AmendmentView
                  note={amendmentNote}
                  onNoteChange={setAmendmentNote}
                  expense={expense}
                />
              ) : (
                <GeneralInfoView expense={expense} />
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <VerticalTimeline steps={expense.timeline} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4 sm:px-8">
          {amendmentMode ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setAmendmentMode(false);
                  setAmendmentNote("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                onClick={handleSendAmendment}
              >
                Send for amendment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleReject}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={activeFooterAction.onClick}
              >
                <SquarePen className="mr-2 h-4 w-4" />
                {activeFooterAction.label}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// General Info sub-view
// ---------------------------------------------------------------------------

function GeneralInfoView({ expense }: { expense: Expense }) {
  return (
    <div className="space-y-6">
      {/* Info Grid */}
      <div className="rounded-lg border border-gray-200 p-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-brand-description">Amount</span>
            <p className="mt-0.5 text-sm font-semibold text-brand-title">
              {formatCurrency(expense.amount)}
            </p>
          </div>
          <div>
            <span className="text-xs text-brand-description">Department</span>
            <p className="mt-0.5 text-sm font-semibold text-brand-title">
              {expense.department}
            </p>
          </div>
        </div>

        <div className="my-4 border-t border-gray-100" />

        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-brand-title">
            Description
          </h4>
          <p className="mt-1 text-sm text-brand-description">
            {expense.description}
          </p>
        </div>

        <div className="my-4 border-t border-gray-100" />

        {/* Attached Receipt */}
        <div>
          <h4 className="text-sm font-semibold text-brand-title">
            Attached Receipt
          </h4>
          {expense.receipt ? (
            <div className="mt-3 flex items-center gap-4 rounded-lg border border-gray-200 p-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {expense.receipt.thumbnail ? (
                  <Image
                    src={expense.receipt.thumbnail}
                    alt={expense.receipt.fileName}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-500">
                    PDF
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-title">
                  {expense.receipt.fileName}
                </p>
                <p className="text-xs text-brand-description">
                  {expense.receipt.fileSize}
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          ) : (
            <p className="mt-2 text-center text-sm text-brand-description">
              No file attached
            </p>
          )}
        </div>

        {/* HOD Note */}
        {expense.hodNote && (
          <>
            <div className="my-4 border-t border-gray-100" />
            <div>
              <h4 className="text-sm font-semibold text-brand-title">
                HOD Note
              </h4>
              <p className="mt-1 text-sm text-brand-description">
                {expense.hodNote}
              </p>
              {expense.hodReviewer && (
                <span className="mt-2 inline-flex items-center rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-brand-description">
                  Reviewed by: {expense.hodReviewer}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Amendment sub-view
// ---------------------------------------------------------------------------

function AmendmentView({
  expense,
  note,
  onNoteChange,
}: {
  expense: Expense;
  note: string;
  onNoteChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Condensed Info */}
      <div className="rounded-lg border border-gray-200 p-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-brand-description">Amount</span>
            <p className="mt-0.5 text-sm font-semibold text-brand-title">
              {formatCurrency(expense.amount)}
            </p>
          </div>
          <div>
            <span className="text-xs text-brand-description">Department</span>
            <p className="mt-0.5 text-sm font-semibold text-brand-title">
              {expense.department}
            </p>
          </div>
        </div>

        <div className="my-4 border-t border-gray-100" />

        <div>
          <h4 className="text-sm font-semibold text-brand-title">
            Description
          </h4>
          <p className="mt-1 text-sm text-brand-description">
            {expense.description}
          </p>
        </div>
      </div>

      {/* Amendment Notes */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-brand-title">
          Amendment Notes
        </h4>
        <Textarea
          placeholder="Describe the reason for amendment"
          rows={5}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </div>
    </div>
  );
}
