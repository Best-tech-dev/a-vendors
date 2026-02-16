"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

interface FormContextValue {
  formState: {
    errors?: Record<string, { message?: string }>;
    isValid?: boolean;
  };
}

const FormContext = React.createContext<FormContextValue>(
  {} as FormContextValue,
);

export function Form(props: FormContextValue & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return <FormContext.Provider value={rest}>{children}</FormContext.Provider>;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  control,
  name,
  render,
}: {
  control: Control<TFieldValues>;
  name: TName;
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
  }) => React.ReactElement;
}) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => render({ field })}
      />
    </FormFieldContext.Provider>
  );
}

export function FormItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function FormLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-brand-description"
    >
      {children}
    </label>
  );
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormMessage({ name }: { name?: string }) {
  const form = React.useContext(FormContext);
  const fieldContext = React.useContext(FormFieldContext);
  const fieldName = name || fieldContext.name;
  const error = form?.formState?.errors?.[fieldName];
  if (!error) return null;
  return (
    <p className="mt-1 text-xs text-destructive">{error.message as string}</p>
  );
}
