"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

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
    label: "At least one special character",
    test: (pw: string) => /[^a-zA-Z0-9]/.test(pw),
  },
];

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  return (
    <Card className="py-4 mt-5">
      <ul className="space-y-1.5 text-sm px-6">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <li key={rule.label} className="flex items-center gap-2">
              <div
                className={cn(
                  "size-5 shrink-0 rounded-full flex items-center justify-center",
                  passed ? "bg-green-600" : "bg-[#F6F8FC]",
                )}
              >
                <Check
                  className={cn(
                    "size-3.5",
                    passed ? "text-white" : "text-brand-muted",
                  )}
                />
              </div>
              <span className="text-brand-description">{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
