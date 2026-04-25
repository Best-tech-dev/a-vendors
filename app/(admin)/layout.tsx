"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { profileApi } from "@/lib/api/profile";
import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const setProfile = useAuthStore((state) => state.setProfile);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/sign-in");
    }
  }, [hasHydrated, token, router]);

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
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
