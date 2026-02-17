"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PackagePlus,
  FileText,
  ShoppingCart,
  Banknote,
  CreditCard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Vendors", href: "/vendors", icon: Users },
  { label: "Inventory", href: "/inventory", icon: PackagePlus },
  { label: "RFQs", href: "/rfqs", icon: FileText },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Invoices", href: "/invoices", icon: Banknote },
  { label: "Payments", href: "/payments", icon: CreditCard },
];

const systemNavItems = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-65 flex-col bg-brand-primary text-white">
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
          <span className="text-xs text-white">Executive</span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        <span className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-brand-border">
          Main Menu
        </span>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F5F7F9] text-brand-primary"
                  : "text-border hover:bg-[#F5F7F9] hover:text-brand-primary",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}

        {/* System */}
        <span className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-brand-border">
          System
        </span>
        {systemNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
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
        })}
      </nav>
    </aside>
  );
}
