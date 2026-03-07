"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import type { Expense, ExpenseStatus } from "@/types/expense";

const ITEMS_PER_PAGE = 5;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const config: Record<ExpenseStatus, { bg: string; text: string }> = {
    Pending: { bg: "bg-badge-yellow-accent", text: "text-badge-yellow" },
    Approved: { bg: "bg-badge-green-accent", text: "text-badge-green" },
    Rejected: { bg: "bg-badge-red-accent", text: "text-badge-red" },
    Amendment: { bg: "bg-blue-50", text: "text-blue-700" },
  };
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {status}
    </span>
  );
}

interface ExpenseListTableProps {
  expenses: Expense[];
  onViewExpense: (expense: Expense) => void;
}

export function ExpenseListTable({
  expenses,
  onViewExpense,
}: ExpenseListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExpenses = expenses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 bg-[#FAFBFC]">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Title
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Submitted By
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Department
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Amount
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Date
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedExpenses.map((expense) => (
            <TableRow key={expense.id} className="border-gray-100">
              <TableCell className="font-medium text-brand-title">
                {expense.title}
              </TableCell>
              <TableCell className="text-brand-description">
                {expense.submittedBy}
              </TableCell>
              <TableCell className="text-brand-description">
                {expense.department}
              </TableCell>
              <TableCell className="font-medium text-brand-title">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell>
                <StatusBadge status={expense.status} />
              </TableCell>
              <TableCell className="text-brand-description">
                {expense.date}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onViewExpense(expense)}
                  className="text-sm font-medium text-brand-primary hover:underline"
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-brand-description">
            Page {currentPage} of {totalPages}
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer bg-brand-primary text-white hover:bg-brand-primary/90"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
