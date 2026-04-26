"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackagePlus,
  FileText,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";

const mainNavItems = [
  { label: "Dashboard", href: "/vendor-dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/vendor-inventory", icon: PackagePlus },
  { label: "Quotes Request", href: "/vendor-quote-request", icon: FileText },
  {
    label: "Quotes History",
    href: "/vendor-quote-history",
    icon: ClipboardList,
  },
  { label: "Profile", href: "/vendor-profile", icon: UserCircle },
];

export function VendorSidebar() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement | null>(null);
  const [inSheet, setInSheet] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    const isInSheet = !!rootRef.current.closest('[data-slot="sheet-content"]');
    setInSheet(isInSheet);
  }, []);

  return (
    <aside
      ref={rootRef}
      className="flex h-full w-65 flex-col bg-brand-primary text-white"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex items-center justify-center">
          <Image
            src="/a-vendors-logo-white.svg"
            alt="Logo"
            width={40}
            height={40}
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium tracking-wide text-white">
            Warehouse
          </span>
          <span className="text-xs text-white/60">Vendor</span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        <span className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-brand-border">
          Main Menu
        </span>
        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const link = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F5F7F9] text-brand-primary"
                  : "text-brand-border hover:bg-[#F5F7F9] hover:text-brand-primary",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );

          return inSheet ? (
            <SheetClose asChild key={item.href}>
              {link}
            </SheetClose>
          ) : (
            <React.Fragment key={item.href}>{link}</React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
