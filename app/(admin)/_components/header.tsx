"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMemo, useState, useRef, useCallback } from "react";
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

const PLACEHOLDER_MAP: Record<string, string> = {
  "/inventory": "Search inventory...",
  "/vendors": "Search vendors...",
  "/orders": "Search orders...",
  "/rfqs": "Search RFQs...",
  "/payments": "Search payments...",
  "/expenses": "Search expenses...",
  "/settings": "Search users...",
};

function getPlaceholder(pathname: string): string {
  for (const [route, placeholder] of Object.entries(PLACEHOLDER_MAP)) {
    if (pathname.startsWith(route)) return placeholder;
  }
  return "Search...";
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const profile = useAuthStore((state) => state.profile);

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Sync input when navigating to a different page (state-during-render pattern)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    const urlSearch = searchParams.get("search") ?? "";
    if (searchValue !== urlSearch) {
      setSearchValue(urlSearch);
    }
  }

  const pushSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      // Reset to page 1 on new search
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushSearch(value), 400);
  };

  const { displayName, initials } = useMemo(() => {
    if (!profile) return { displayName: "", initials: "" };
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const clipped =
      fullName.length > 12 ? `${fullName.slice(0, 12)}...` : fullName;
    const ini = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    return { displayName: clipped || profile.email || "", initials: ini };
  }, [profile]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/sign-in");
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
          placeholder={getPlaceholder(pathname)}
          value={searchValue}
          onChange={handleSearchChange}
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
                  {initials || "—"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="max-w-30 truncate text-sm font-medium text-brand-title">
                  {displayName}
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
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
