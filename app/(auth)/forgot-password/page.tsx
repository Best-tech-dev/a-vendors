"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const isValid = form.formState.isValid;

  function onSubmit(data: ForgotPasswordFormValues) {
    console.log("Forgot password:", data);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-title">
          Locked Out? No Stress.
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-description">
          It happens to everyone. Let&apos;s get you back into your dashboard so
          you can get back to business.
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
                  <Input placeholder="Enter your work email" {...field} />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4 w-full" disabled={!isValid}>
            Send reset email
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm font-semibold text-foreground">
        <Link href="/sign-in" className="hover:underline">
          Cancel
        </Link>
      </p>

      <div className="rounded-[6px] border border-brand-border bg-amber-50/50 p-5">
        <p className="text-sm font-semibold text-amber-700">
          What to Expect Next
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-amber-700">
          <li>
            <strong>Check your inbox:</strong> You should receive an email
            within a couple of minutes.
          </li>
          <li>
            <strong>Click the link:</strong> It will take you to a secure page
            to choose a new password.
          </li>
          <li>
            <strong>Get back to work:</strong> Once updated, you can log in
            immediately and pick up right where you left off.
          </li>
        </ol>
        <p className="mt-3 text-sm text-amber-700">
          Didn&apos;t get the email? Check your spam folder or wait 60 seconds
          and try again.
        </p>
      </div>
    </div>
  );
}
