"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { rfqsApi } from "@/lib/api/rfqs";
import type { CreateRFQData } from "@/types/rfq";

interface SendRFQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: CreateRFQData;
  onSuccess: (updated: CreateRFQData) => void;
}

export function SendRFQDialog({
  open,
  onOpenChange,
  rfq,
  onSuccess,
}: SendRFQDialogProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    try {
      const res = await rfqsApi.send(rfq.id);
      toast.success(res.data.message ?? "RFQ sent to vendors");
      onSuccess(res.data.data);
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ??
        "Failed to send RFQ. Please try again.";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send RFQ to Vendors</DialogTitle>
          <DialogDescription>
            This action will send the RFQ to the assigned vendors. Only draft
            RFQs can be sent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">RFQ</span>
              <span className="font-medium text-brand-title">{rfq.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Items</span>
              <span className="font-medium text-brand-title">
                {rfq.items.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Vendors</span>
              <span className="font-medium text-brand-title">
                {rfq.vendors.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Send className="mr-1.5 size-4" />
            )}
            {isSending ? "Sending…" : "Send RFQ"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
