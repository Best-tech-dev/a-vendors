"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { profileApi } from "@/lib/api/profile";
import { VendorSidebar } from "./_components/vendor-sidebar";
import { VendorHeader } from "./_components/vendor-header";

export default function VendorGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const setProfile = useAuthStore((state) => state.setProfile);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace("/sign-in");
      return;
    }
    if (user && user.role !== "user") {
      router.replace("/vendor-dashboard");
    }
  }, [hasHydrated, token, user, router]);

  useEffect(() => {
    if (!token) return;
    profileApi
      .get()
      .then(({ data: res }) => setProfile(res.data))
      .catch(() => {
        // Profile fetch failure is non-blocking; header will show empty state
      });
  }, [token, setProfile]);

  if (!hasHydrated) return null;
  if (!token) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <VendorSidebar />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <VendorHeader />
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
