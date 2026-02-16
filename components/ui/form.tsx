"use client";

import * as React from "react";
import { useController } from "react-hook-form";

const FormContext = React.createContext<any>(null);

export function Form(props: any) {
  const { children, ...rest } = props;
  return <FormContext.Provider value={rest}>{children}</FormContext.Provider>;
}

export function FormField({ name, render }: { name: string; render: any }) {
  const form = React.useContext(FormContext);
  const control = form?.control;
  const { field } = useController({ name, control });
  return render({ field });
}

export function FormItem({ children, className }: any) {
  return <div className={className}>{children}</div>;
}

export function FormLabel({ children, htmlFor }: any) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-muted-foreground"
    >
      {children}
    </label>
  );
}

export function FormControl({ children }: any) {
  return <div>{children}</div>;
}

export function FormMessage({ children, name }: any) {
  const form = React.useContext(FormContext);
  const error = form?.formState?.errors?.[name];
  if (!error) return null;
  return (
    <p className="mt-1 text-xs text-destructive">{error.message as string}</p>
  );
}
