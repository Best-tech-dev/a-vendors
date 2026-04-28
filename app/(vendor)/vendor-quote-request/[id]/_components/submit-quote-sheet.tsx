"use client";

import { useState } from "react";
import { Plus, X, Pencil, Trash2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaymentPlanDialog } from "./payment-plan-dialog";
import { rfqsApi } from "@/lib/api/rfqs";
import type { VendorRFQItem } from "@/types/rfq";

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface PriceEntry {
  id: string; // local uuid for list key
  quality: string;
  possibleDelivery: string;
  pricePerUnit: string;
  totalPrice: string;
  note: string;
}

interface ItemFormState {
  // The current in-progress form values for this item
  quality: string;
  possibleDelivery: string;
  pricePerUnit: string;
  totalPrice: string;
  noteOpen: boolean;
  note: string;
  // Saved (submitted) entries for this item
  entries: PriceEntry[];
  // Which entry id is being edited, if any
  editingId: string | null;
}

function makeEmptyForm(): ItemFormState {
  return {
    quality: "",
    possibleDelivery: "",
    pricePerUnit: "",
    totalPrice: "",
    noteOpen: false,
    note: "",
    entries: [],
    editingId: null,
  };
}

// ---------------------------------------------------------------------------
// Currency prefix sub-component
// ---------------------------------------------------------------------------

function CurrencyInput({
  value,
  onChange,
  placeholder = "0.00",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-brand-primary/20">
      <div className="flex shrink-0 items-center gap-1.5 border-r border-gray-200 px-3 py-2.5">
        {/* Nigerian flag icon — simple inline SVG */}
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <rect width="6" height="14" fill="#008751" />
          <rect x="6" width="6" height="14" fill="white" />
          <rect x="12" width="6" height="14" fill="#008751" />
        </svg>
        <span className="text-sm font-medium text-brand-title">NGN</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path
            d="M1 1L5 5L9 1"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <input
        type="number"
        min={0}
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent px-3 py-2.5 text-sm text-brand-title placeholder:text-gray-300 focus:outline-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Saved entry card
// ---------------------------------------------------------------------------

function SavedEntryCard({
  entry,
  hasDescription,
  onEdit,
  onDelete,
}: {
  entry: PriceEntry;
  hasDescription: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
      {hasDescription && (
        <>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-brand-title">
              Description
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onEdit}
                className="text-brand-description hover:text-brand-title"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {entry.note && (
            <p className="text-sm text-brand-description">{entry.note}</p>
          )}
        </>
      )}

      {!hasDescription && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="text-brand-description hover:text-brand-title"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span>
          <span className="font-semibold text-brand-title">Quality: </span>
          <span className="text-brand-description">{entry.quality}%</span>
        </span>
        <span>
          <span className="font-semibold text-brand-title">
            Possible delivery:{" "}
          </span>
          <span className="text-brand-description">
            {entry.possibleDelivery}
          </span>
        </span>
        <span>
          <span className="font-semibold text-brand-title">
            Price per unit:{" "}
          </span>
          <span className="text-brand-description">
            ₦{Number(entry.pricePerUnit).toLocaleString("en-NG")}
          </span>
        </span>
      </div>
      <p className="text-sm">
        <span className="font-semibold text-brand-title">Total price: </span>
        <span className="text-brand-description">
          ₦{Number(entry.totalPrice).toLocaleString("en-NG")}
        </span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-item section
// ---------------------------------------------------------------------------

function ItemSection({
  item,
  form,
  onChange,
}: {
  item: VendorRFQItem;
  form: ItemFormState;
  onChange: (updated: Partial<ItemFormState>) => void;
}) {
  const handleSaveEntry = () => {
    if (!form.quality || !form.pricePerUnit) {
      toast.error("Quality and price per unit are required.");
      return;
    }

    const newEntry: PriceEntry = {
      id: crypto.randomUUID(),
      quality: form.quality,
      possibleDelivery: form.possibleDelivery,
      pricePerUnit: form.pricePerUnit,
      totalPrice: form.totalPrice,
      note: form.note,
    };

    if (form.editingId) {
      // Replace the entry being edited
      onChange({
        entries: form.entries.map((e) =>
          e.id === form.editingId ? { ...newEntry, id: e.id } : e,
        ),
        quality: "",
        possibleDelivery: "",
        pricePerUnit: "",
        totalPrice: "",
        note: "",
        noteOpen: false,
        editingId: null,
      });
    } else {
      onChange({
        entries: [...form.entries, newEntry],
        quality: "",
        possibleDelivery: "",
        pricePerUnit: "",
        totalPrice: "",
        note: "",
        noteOpen: false,
      });
    }
  };

  const handleEdit = (entry: PriceEntry) => {
    onChange({
      quality: entry.quality,
      possibleDelivery: entry.possibleDelivery,
      pricePerUnit: entry.pricePerUnit,
      totalPrice: entry.totalPrice,
      note: entry.note,
      noteOpen: !!entry.note,
      editingId: entry.id,
    });
  };

  const handleDelete = (id: string) => {
    onChange({ entries: form.entries.filter((e) => e.id !== id) });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      {/* Item header */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-brand-title">{item.materialName}</p>
        <button
          type="button"
          onClick={handleSaveEntry}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another price
        </button>
      </div>

      {/* Saved entries */}
      {form.entries.map((entry, idx) => (
        <SavedEntryCard
          key={entry.id}
          entry={entry}
          hasDescription={idx === 0}
          onEdit={() => handleEdit(entry)}
          onDelete={() => handleDelete(entry.id)}
        />
      ))}

      {/* In-progress form */}
      <div className="grid grid-cols-2 gap-4">
        {/* Quality */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-brand-description">
            Quality
          </Label>
          <Input
            placeholder="e.g., 100%, 90%, 80%"
            className="placeholder:text-gray-300"
            value={form.quality}
            onChange={(e) => onChange({ quality: e.target.value })}
          />
        </div>

        {/* Possible delivery */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-brand-description">
            Possible delivery
          </Label>
          <div className="relative">
            <Input
              type="date"
              placeholder="DD/MM/YYYY"
              className="placeholder:text-gray-300 pr-9"
              value={form.possibleDelivery}
              onChange={(e) => onChange({ possibleDelivery: e.target.value })}
            />
            <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Price per unit */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-brand-description">
            Price per unit
          </Label>
          <CurrencyInput
            value={form.pricePerUnit}
            onChange={(v) => onChange({ pricePerUnit: v })}
          />
        </div>

        {/* Total price */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-brand-description">
            Total price
          </Label>
          <CurrencyInput
            value={form.totalPrice}
            onChange={(v) => onChange({ totalPrice: v })}
          />
        </div>
      </div>

      {/* Attach note toggle */}
      {!form.noteOpen ? (
        <button
          type="button"
          onClick={() => onChange({ noteOpen: true })}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-description hover:text-brand-title"
        >
          <Plus className="h-4 w-4" />
          Attach note
        </button>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-brand-description">
              Note
            </Label>
            <button
              type="button"
              onClick={() => onChange({ noteOpen: false, note: "" })}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Textarea
            placeholder="Describe product"
            rows={3}
            className="placeholder:text-gray-300 resize-none"
            value={form.note}
            onChange={(e) => onChange({ note: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main sheet
// ---------------------------------------------------------------------------

interface SubmitQuoteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfqId: string;
  rfqReference: string;
  items: VendorRFQItem[];
  onSuccess?: () => void;
}

export function SubmitQuoteSheet({
  open,
  onOpenChange,
  rfqId,
  rfqReference,
  items,
  onSuccess,
}: SubmitQuoteSheetProps) {
  const [forms, setForms] = useState<Record<string, ItemFormState>>({});
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getForm = (id: string): ItemFormState => forms[id] ?? makeEmptyForm();

  const updateForm = (id: string, patch: Partial<ItemFormState>) =>
    setForms((prev) => ({
      ...prev,
      [id]: { ...getForm(id), ...patch },
    }));

  const handleSubmit = async () => {
    // Validate — each item must have at least one saved entry
    const missing = items.filter((item) => {
      const form = getForm(item.id);
      return form.entries.length === 0;
    });

    if (missing.length > 0) {
      toast.error(
        `Please add at least one price for: ${missing.map((m) => m.materialName).join(", ")}`,
      );
      return;
    }

    // Open payment plan dialog before final submission
    setPaymentDialogOpen(true);
  };

  const handlePaymentSave = async ({
    plan,
    proofFile,
  }: {
    plan: string;
    proofFile: File | null;
  }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        rfqId,
        paymentPlan: plan,
        items: items.map((item) => ({
          itemId: item.id,
          entries: getForm(item.id).entries,
        })),
        proofFile: proofFile ?? undefined,
      };
      await rfqsApi.submitVendorQuote(payload);
      toast.success("Quote submitted successfully");
      setForms({});
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ??
          "Could not submit quote. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-lg"
          showCloseButton={false}
        >
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-6 py-5">
            <SheetTitle className="text-base font-semibold text-brand-title">
              Submit Quote — {rfqReference}
            </SheetTitle>
            <SheetClose asChild>
              <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-title">
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto space-y-4 px-6 py-5">
            {items.map((item) => (
              <ItemSection
                key={item.id}
                item={item}
                form={getForm(item.id)}
                onChange={(patch) => updateForm(item.id, patch)}
              />
            ))}
          </div>

          {/* Sticky footer */}
          <div className="border-t border-gray-100 px-6 py-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-brand-primary py-3 text-sm font-semibold text-white hover:bg-brand-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Quote"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <PaymentPlanDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSave={handlePaymentSave}
      />
    </>
  );
}
