"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { rfqsApi } from "@/lib/api/rfqs";
import { updateRFQSchema } from "@/lib/validations/rfq";
import type { CreateRFQData } from "@/types/rfq";

interface EditRFQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: CreateRFQData;
  onSuccess?: (updated: CreateRFQData) => void;
}

export function EditRFQDialog({
  open,
  onOpenChange,
  rfq,
  onSuccess,
}: EditRFQDialogProps) {
  const [title, setTitle] = useState(rfq.title);
  const [description, setDescription] = useState(rfq.description ?? "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    new Date(rfq.dueDate),
  );
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when the dialog opens with fresh RFQ data
  useEffect(() => {
    if (open) {
      setTitle(rfq.title);
      setDescription(rfq.description ?? "");
      setDueDate(new Date(rfq.dueDate));
      setErrors({});
    }
  }, [open, rfq]);

  const handleSubmit = async () => {
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? dueDate.toISOString() : "",
    };

    const result = updateRFQSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await rfqsApi.update(rfq.id, result.data);
      toast.success("RFQ updated successfully");
      onSuccess?.(res.data.data);
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (!axiosError.response) {
        toast.error("Network error — please check your connection and retry.");
      } else {
        toast.error(
          axiosError.response.data?.message ??
            "Could not update RFQ. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit RFQ</DialogTitle>
          <DialogDescription>
            Update the title, due date, or description. Only draft or sent RFQs
            can be modified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-brand-description">
              Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="RFQ title"
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-brand-description">
              Due date
            </Label>
            <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal text-gray-600"
                >
                  <CalendarIcon className="mr-2 size-4 text-gray-400" />
                  {dueDate
                    ? dueDate.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dueDate}
                  defaultMonth={dueDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDueDate(date);
                    setDueDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.dueDate && (
              <p className="text-xs text-red-500">{errors.dueDate}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-brand-description">
              Description{" "}
              <span className="font-normal text-brand-muted">(optional)</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description…"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
