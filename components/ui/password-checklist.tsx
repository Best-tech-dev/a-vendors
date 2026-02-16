"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordChecklistProps {
  password: string;
}

const rules = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  {
    label: "At least one lower case letter",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    label: "At least one upper case letter",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: "At least one special symbol (@!<>!?*&%$)",
    test: (pw: string) => /[@!<>!?*&%$]/.test(pw),
  },
];

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  return (
    <ul className="space-y-1.5 text-sm">
      {rules.map((rule) => {
        const passed = rule.test(password);
        return (
          <li key={rule.label} className="flex items-center gap-2">
            <Check
              className={cn(
                "size-4 shrink-0",
                passed ? "text-green-600" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                passed ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {rule.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
