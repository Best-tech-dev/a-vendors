"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!hasHydrated || !token) return;
    if (user?.role === "admin") {
      router.replace("/dashboard");
    } else if (user?.role === "user") {
      router.replace("/vendor-dashboard");
    }
  }, [hasHydrated, token, user, router]);

  if (!hasHydrated) return null;
  if (token) return null;

  return <AuthLayout>{children}</AuthLayout>;
}
