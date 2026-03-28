"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "@/lib/validations/auth";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const RESEND_COOLDOWN = 30;

export default function VerifyPage() {
  const router = useRouter();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  // Redirect to sign-in if no pending email after hydration (and not authenticated)
  useEffect(() => {
    if (hasHydrated && !pendingEmail && !token) {
      router.replace("/sign-in");
    }
  }, [hasHydrated, pendingEmail, token, router]);

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const isValid = form.formState.isValid;

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (!pendingEmail || !canResend) return;

    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);

    try {
      await authApi.resendOtp({ email: pendingEmail });
      toast.success("A new OTP has been sent to your email");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to resend OTP. Please try again.",
      );
    }
  }, [pendingEmail, canResend]);

  async function onSubmit(data: VerifyOtpFormValues) {
    if (!pendingEmail) return;

    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp({
        email: pendingEmail,
        otp: data.otp,
      });

      const responseData = res.data.data ?? res.data;
      const accessToken = responseData.access_token ?? responseData.token;
      const user = responseData.user ?? {
        id: "",
        email: pendingEmail,
        name: "",
        role: responseData.role ?? "",
      };
      setAuth(accessToken, user);
      toast.success("Verification successful. Redirecting...");
      router.push("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Invalid OTP. Please check and try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-title">
          Verify Your Identity
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-description">
          Enter the OTP sent to your email to continue
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Read-only email field */}
          <div className="flex flex-col gap-2">
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Mail className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                value={pendingEmail ?? ""}
                readOnly
                className="cursor-default text-muted-foreground"
              />
            </InputGroup>
          </div>

          {/* OTP input field */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input placeholder="Enter OTP" {...field} />
                </FormControl>
                <FormMessage name="otp" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t get the OTP?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-primary hover:underline"
          >
            Resend OTP
          </button>
        ) : (
          <span className="font-semibold text-primary">
            Resend in {countdown}s
          </span>
        )}
      </p>
    </div>
  );
}
