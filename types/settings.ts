export type PermissionLevel = "full" | "view" | "none";

export interface Permission {
  module: string;
  description: string;
  level: PermissionLevel;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
}

export interface SettingsStat {
  label: string;
  value: number;
}

export const PERMISSION_MODULES = [
  {
    key: "vendors",
    label: "Vendors Management",
    description: "Add or remove supplier, and track compliance docs.",
  },
  {
    key: "inventory",
    label: "Inventory",
    description: "Add and monitor material",
  },
  {
    key: "rfqs",
    label: "RFQs",
    description:
      "Request price from vendors and compare quotes to find the best deal.",
  },
  {
    key: "orders",
    label: "Order Management",
    description:
      "Create purchase orders, approve transactions, and track deliveries.",
  },
  {
    key: "invoices",
    label: "Invoice",
    description:
      "Review bills and match them against orders to ensure accuracy.",
  },
  {
    key: "payment",
    label: "Payment",
    description: "Manage and upload payment receipts",
  },
  {
    key: "onboarding",
    label: "Onboarding",
    description: "Invite users, assign roles, and manage permissions.",
  },
] as const;
