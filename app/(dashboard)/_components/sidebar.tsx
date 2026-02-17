"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ShoppingCart,
  Receipt,
  CreditCard,
  Settings,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Vendors", href: "/vendors", icon: Users },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "RFQs", href: "/rfqs", icon: FileText },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Invoices", href: "/invoices", icon: Receipt },
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
        <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
          <Warehouse className="size-5 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold tracking-wide text-white">
            Warehouse
          </span>
          <span className="text-xs font-medium text-slate-400">Executive</span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        <span className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </span>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-brand-primary"
                  : "text-slate-400 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}

        {/* System */}
        <span className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          System
        </span>
        {systemNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-brand-primary"
                  : "text-slate-400 hover:bg-white/10 hover:text-white",
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
