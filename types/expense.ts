export type ExpenseStatus = "Pending" | "Approved" | "Rejected" | "Amendment";

export interface ExpenseReceipt {
  id: string;
  fileName: string;
  fileSize: string;
  thumbnail?: string;
}

export interface TimelineStep {
  id: string;
  title: string;
  date?: string;
  reviewedBy?: string;
  completed: boolean;
}

export type FooterAction = "edit" | "amend" | "escalate";

export interface Expense {
  id: string;
  expenseId: string;
  title: string;
  submittedBy: string;
  department: string;
  amount: number;
  currency: string;
  status: ExpenseStatus;
  date: string;
  description: string;
  receipt?: ExpenseReceipt;
  hodNote?: string;
  hodReviewer?: string;
  timeline: TimelineStep[];
}
