"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          // Default toast — brand neutral palette
          "--normal-bg": "#ffffff",
          "--normal-border": "var(--brand-border)",
          "--normal-text": "var(--brand-title)",

          // Error toast — warm red that contrasts well on white
          "--error-bg": "#fff5f5",
          "--error-border": "#fecaca",
          "--error-text": "#991b1b",

          // Success toast
          "--success-bg": "#f0fdf4",
          "--success-border": "#bbf7d0",
          "--success-text": "#166534",

          // Warning toast
          "--warning-bg": "#fffbeb",
          "--warning-border": "#fde68a",
          "--warning-text": "#92400e",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast font-sans rounded-lg border shadow-lg text-sm",
          title: "font-semibold",
          description: "opacity-80 text-xs mt-0.5",
          actionButton:
            "bg-brand-primary text-brand-primary-foreground text-xs font-medium rounded px-2.5 py-1",
          cancelButton:
            "bg-transparent border border-brand-border text-brand-description text-xs font-medium rounded px-2.5 py-1",
          closeButton:
            "border border-brand-border bg-white text-brand-description hover:bg-gray-50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
