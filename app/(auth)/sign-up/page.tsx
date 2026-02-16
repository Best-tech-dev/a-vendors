"use client";

import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormValues } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function SignUpPage() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = useWatch({ control: form.control, name: "password" });
  const isValid = form.formState.isValid;

  function onSubmit(data: SignUpFormValues) {
    console.log("Sign up:", data);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-title">
          Let&apos;s Get You Set Up
        </h1>
        <p className="mt-2 mb-4 text-sm leading-6 text-brand-description">
          Welcome to the team! Setting up your account takes less than a minute.
          Once you&apos;re in, you&apos;ll be ready to manage your account.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ibukun Joseph" {...field} />
                </FormControl>
                <FormMessage name="name" />
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
                  <PasswordInput
                    placeholder="Create strong password"
                    {...field}
                  />
                </FormControl>
                <PasswordChecklist password={passwordValue} />
                <FormMessage name="password" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Repeat password" {...field} />
                </FormControl>
                <FormMessage name="confirmPassword" />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4 w-full" disabled={!isValid}>
            Create account
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-foreground hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
