"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormValues } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function SignInPage() {
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const isValid = form.formState.isValid;

  function onSubmit(data: SignInFormValues) {
    console.log("Sign in:", data);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-title">
          Welcome Back to the Floor
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-description">
          Managing your inventory and procurement should be the easiest part of
          your day. Log in to access your account now.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., name@company.com" {...field} />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••" {...field} />
                </FormControl>
                <div className="flex justify-end pt-3">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold uppercase tracking-wide text-brand-description hover:text-foreground"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormMessage name="password" />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4 w-full" disabled={!isValid}>
            Sign in
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-foreground hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
