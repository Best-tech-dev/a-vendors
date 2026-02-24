"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  image?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  image,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      {image && <div className="mb-6">{image}</div>}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <Button onClick={onAction} className="mt-6 bg-gray-900 hover:bg-gray-800">
        <Plus className="mr-2 h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
}
