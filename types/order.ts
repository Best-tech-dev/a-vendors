export type OrderStatus =
  | "Pending"
  | "In Production"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  id: string;
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
}

export interface TimelineStep {
  label: string;
  description: string;
  timestamp?: string;
  status: "completed" | "active" | "upcoming";
}

export interface Order {
  id: string;
  poNumber: string;
  vendor: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: OrderStatus;
  amount: number;
  createdDate: string;
  title: string;
  items: OrderItem[];
  timeline: TimelineStep[];
}
