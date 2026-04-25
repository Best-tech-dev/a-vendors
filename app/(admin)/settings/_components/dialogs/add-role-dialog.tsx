"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { PermissionLevel } from "@/types/settings";

// Build the Zod schema dynamically from the PERMISSION_MODULES array
const addRoleSchema = z.object({
  title: z.string().min(1, "Role title is required"),
  permissions: z.object({
    vendors: z.enum(["full", "view", "none", ""]),
    inventory: z.enum(["full", "view", "none", ""]),
    rfqs: z.enum(["full", "view", "none", ""]),
    orders: z.enum(["full", "view", "none", ""]),
    invoices: z.enum(["full", "view", "none", ""]),
    payment: z.enum(["full", "view", "none", ""]),
    onboarding: z.enum(["full", "view", "none", ""]),
  }),
});

type AddRoleValues = z.infer<typeof addRoleSchema>;

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PERMISSION_LEVELS: { value: PermissionLevel; label: string }[] = [
  { value: "full", label: "Full Access" },
  { value: "view", label: "View Only" },
  { value: "none", label: "No Access" },
];

export function AddRoleDialog({ open, onOpenChange }: AddRoleDialogProps) {
  const form = useForm<AddRoleValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      title: "",
      permissions: {
        vendors: "",
        inventory: "",
        rfqs: "",
        orders: "",
        invoices: "",
        payment: "",
        onboarding: "",
      },
    },
  });

  function onSubmit(values: AddRoleValues) {
    console.log("New role created:", values);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140 max-h-[85vh] flex flex-col overflow-hidden text-brand-description">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold text-center">
            Add new role
          </DialogTitle>
          <DialogDescription className="text-sm text-brand-description text-center">
            Fill out necessary details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="overflow-y-auto flex-1 min-h-0 space-y-6 px-1">
              {/* Role title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role&apos;s title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sales" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Permissions section */}
              <div>
                <h3 className="text-sm font-semibold mb-4">
                  Select Permissions
                </h3>

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="permissions.vendors"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-1.5">
                          <span className="text-sm font-semibold">
                            Vendors Management:
                          </span>{" "}
                          <span className="text-sm text-brand-description">
                            Add or remove supplier, and track compliance docs.
                          </span>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-6">
                            {PERMISSION_LEVELS.map((level) => (
                              <div
                                key={level.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`vendors-${level.value}`}
                                  checked={field.value === level.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) field.onChange(level.value);
                                  }}
                                />
                                <Label
                                  htmlFor={`vendors-${level.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {level.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.inventory"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-1.5">
                          <span className="text-sm font-semibold">
                            Inventory:
                          </span>{" "}
                          <span className="text-sm text-brand-description">
                            Add and monitor material
                          </span>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-6">
                            {PERMISSION_LEVELS.map((level) => (
                              <div
                                key={level.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`inventory-${level.value}`}
                                  checked={field.value === level.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) field.onChange(level.value);
                                  }}
                                />
                                <Label
                                  htmlFor={`inventory-${level.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {level.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.rfqs"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-1.5">
                          <span className="text-sm font-semibold">RFQs:</span>{" "}
                          <span className="text-sm text-brand-description">
                            Request price from vendors and compare quotes to
                            find the best deal.
                          </span>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-6">
                            {PERMISSION_LEVELS.map((level) => (
                              <div
                                key={level.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`rfqs-${level.value}`}
                                  checked={field.value === level.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) field.onChange(level.value);
                                  }}
                                />
                                <Label
                                  htmlFor={`rfqs-${level.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {level.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.orders"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-1.5">
                          <span className="text-sm font-semibold">
                            Order Management:
                          </span>{" "}
                          <span className="text-sm text-brand-description">
                            Create purchase orders, approve transactions, and
                            track deliveries.
                          </span>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-6">
                            {PERMISSION_LEVELS.map((level) => (
                              <div
                                key={level.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`orders-${level.value}`}
                                  checked={field.value === level.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) field.onChange(level.value);
                                  }}
                                />
                                <Label
                                  htmlFor={`orders-${level.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {level.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.invoices"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-1.5">
                          <span className="text-sm font-semibold">
                            Invoice:
                          </span>{" "}
                          <span className="text-sm text-brand-description">
                            Review bills and match them against orders to ensure
                            accuracy.
                          </span>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-6">
                            {PERMISSION_LEVELS.map((level) => (
                              <div
                                key={level.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`invoices-${level.value}`}
                                  checked={field.value === level.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) field.onChange(level.value);
                                  }}
                                />
                                <Label
                                  htmlFor={`invoices-${level.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {level.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.payment"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-1.5">
                          <span className="text-sm font-semibold">
                            Payment:
                          </span>{" "}
                          <span className="text-sm text-brand-description">
                            Manage and upload payment receipts
                          </span>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-6">
                            {PERMISSION_LEVELS.map((level) => (
                              <div
                                key={level.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`payment-${level.value}`}
                                  checked={field.value === level.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) field.onChange(level.value);
                                  }}
                                />
                                <Label
                                  htmlFor={`payment-${level.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {level.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.onboarding"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-1.5">
                          <span className="text-sm font-semibold">
                            Onboarding:
                          </span>{" "}
                          <span className="text-sm text-brand-description">
                            Invite users, assign roles, and manage permissions.
                          </span>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-6">
                            {PERMISSION_LEVELS.map((level) => (
                              <div
                                key={level.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`onboarding-${level.value}`}
                                  checked={field.value === level.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) field.onChange(level.value);
                                  }}
                                />
                                <Label
                                  htmlFor={`onboarding-${level.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {level.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-row items-center justify-center gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="px-10">
                Save role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
