"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-in");
  };
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-brand-border bg-white px-4 md:px-6">
      {/* Mobile menu trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-65 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Search bar */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-muted" />
        <Input
          type="search"
          placeholder="Search for vendors, quotes or invoices"
          className="h-10 border-brand-border bg-gray-50/50 pl-9 text-sm placeholder:text-brand-muted focus-visible:ring-brand-primary/20"
        />
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="size-5 text-brand-description" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100 focus:outline-none">
              <Avatar size="default">
                <AvatarFallback className="bg-brand-primary text-xs font-semibold text-white">
                  AO
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="max-w-30 truncate text-sm font-medium text-brand-title">
                  Akindele Oluw...
                </p>
              </div>
              <ChevronDown className="hidden size-4 text-brand-muted md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
