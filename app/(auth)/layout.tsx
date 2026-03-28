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
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    if (hasHydrated && token) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated) return null;
  if (token) return null;

  return <AuthLayout>{children}</AuthLayout>;
}
