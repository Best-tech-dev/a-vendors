"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rfqsApi } from "@/lib/api/rfqs";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { ItemAttachment } from "@/types/rfq";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILES = 10;

interface ItemAttachmentsProps {
  rfqId: string;
  itemId: string;
  attachments: ItemAttachment[];
  editable: boolean;
  onUploaded: (newAttachments: ItemAttachment[]) => void;
}

export function ItemAttachments({
  rfqId,
  itemId,
  attachments,
  editable,
  onUploaded,
}: ItemAttachmentsProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    // Validate count
    if (files.length > MAX_FILES) {
      toast.error(`You can upload up to ${MAX_FILES} images at a time.`);
      return;
    }

    // Validate types
    const invalid = files.filter((f) => !ACCEPTED_TYPES.includes(f.type));
    if (invalid.length > 0) {
      toast.error("Only JPEG, PNG, and PDF files are allowed.");
      return;
    }

    setUploading(true);
    try {
      const res = await rfqsApi.uploadItemAttachments(rfqId, itemId, files);
      toast.success(res.data.message ?? "Attachments uploaded");
      onUploaded(res.data.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ??
        "Failed to upload attachments. Please try again.";
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-title flex items-center gap-1.5">
          <Paperclip className="size-4" />
          Attachments
          <span className="text-brand-muted font-normal">
            ({attachments.length})
          </span>
        </h3>

        {editable && (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : (
                <Upload className="mr-1.5 size-3.5" />
              )}
              {uploading ? "Uploading…" : "Upload"}
            </Button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </>
        )}
      </div>

      {attachments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-brand-description">
            No attachments for this item yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {attachments.map((att) => {
            const isPdf = att.originalFilename?.toLowerCase().endsWith(".pdf");
            return (
              <a
                key={att.id}
                href={att.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
              >
                {isPdf ? (
                  <div className="flex h-20 items-center justify-center bg-gray-50 p-2">
                    <Image
                      src="/imgs/pdf-icon.jpg"
                      alt="PDF"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Image
                    src={att.imageUrl}
                    alt={att.originalFilename ?? "attachment"}
                    width={200}
                    height={80}
                    className="h-20 w-full object-contain"
                  />
                )}
                <div className="px-2 py-1.5">
                  <p
                    className="text-xs text-brand-description truncate"
                    title={att.originalFilename}
                  >
                    {att.originalFilename}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
