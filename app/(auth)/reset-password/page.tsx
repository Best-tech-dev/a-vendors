"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPasswordSchema,
  type CreatePasswordFormValues,
} from "@/lib/validations/auth";
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

export default function ResetPasswordPage() {
  const form = useForm<CreatePasswordFormValues>({
    // @ts-expect-error - Zod v4 compatibility with @hookform/resolvers
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = useWatch({ control: form.control, name: "password" });
  const isValid = form.formState.isValid;

  function onSubmit(data: CreatePasswordFormValues) {
    console.log("Reset password:", data);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-title">
          Create a New Password
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-description">
          You&apos;re just one step away from getting back into your account.
          Choose a password that&apos;s easy for you to remember but tough for
          anyone else to guess.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
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
            Update Password &amp; Log In
          </Button>
        </form>
      </Form>
    </div>
  );
}
