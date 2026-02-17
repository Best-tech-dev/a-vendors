import type { SettingsStat, TeamMember, Role } from "@/types/settings";

export const settingsStats: SettingsStat[] = [
  { label: "Total team members", value: 5 },
  { label: "Procurement managers", value: 3 },
  { label: "Finance managers", value: 2 },
  { label: "Production managers", value: 3 },
];

export const teamMembers: TeamMember[] = Array.from({ length: 23 }, (_, i) => ({
  id: `member-${i + 1}`,
  name: "Jane Doe",
  email: "janedoe@gmail",
  role: "Managing Director",
  status: "Active" as const,
}));

export const roles: Role[] = [
  {
    id: "role-1",
    name: "Managing Director (MD)",
    permissions: [
      { module: "Vendors", description: "", level: "full" },
      { module: "Inventory", description: "", level: "full" },
      { module: "RFQs", description: "", level: "full" },
      { module: "Orders", description: "", level: "full" },
      { module: "Invoices", description: "", level: "full" },
      { module: "Payment", description: "", level: "full" },
      { module: "Onboarding", description: "", level: "full" },
    ],
  },
  {
    id: "role-2",
    name: "CFO",
    permissions: [
      { module: "Vendors", description: "", level: "full" },
      { module: "Inventory", description: "", level: "full" },
      { module: "RFQs", description: "", level: "full" },
      { module: "Orders", description: "", level: "full" },
      { module: "Invoices", description: "", level: "full" },
      { module: "Payment", description: "", level: "full" },
      { module: "Onboarding", description: "", level: "full" },
    ],
  },
  {
    id: "role-3",
    name: "Procurement Manager",
    permissions: [
      { module: "Vendors", description: "", level: "full" },
      { module: "Inventory", description: "", level: "full" },
      { module: "RFQs", description: "", level: "full" },
      { module: "Orders", description: "", level: "full" },
      { module: "Invoices", description: "", level: "view" },
      { module: "Payment", description: "", level: "none" },
      { module: "Onboarding", description: "", level: "none" },
    ],
  },
  {
    id: "role-4",
    name: "Finance Manager",
    permissions: [
      { module: "Vendors", description: "", level: "view" },
      { module: "Inventory", description: "", level: "none" },
      { module: "RFQs", description: "", level: "none" },
      { module: "Orders", description: "", level: "view" },
      { module: "Invoices", description: "", level: "full" },
      { module: "Payment", description: "", level: "full" },
      { module: "Onboarding", description: "", level: "none" },
    ],
  },
  {
    id: "role-5",
    name: "Production Manager",
    permissions: [
      { module: "Vendors", description: "", level: "view" },
      { module: "Inventory", description: "", level: "full" },
      { module: "RFQs", description: "", level: "view" },
      { module: "Orders", description: "", level: "view" },
      { module: "Invoices", description: "", level: "none" },
      { module: "Payment", description: "", level: "none" },
      { module: "Onboarding", description: "", level: "none" },
    ],
  },
];

export const currentUser = {
  name: "Jane Doe",
  email: "janedoe@gmail.com",
  phone: "",
  role: "CFO",
};
