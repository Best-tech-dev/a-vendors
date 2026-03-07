"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/app/_components/stats-card";
import { EmptyState } from "@/app/_components/empty-state";
import { ExpenseListTable } from "./_components/expense-list-table";
import { SubmitExpenseDialog } from "./_components/submit-expense-dialog";
import { ExpenseDetailsSheet } from "./_components/expense-details-sheet";
import { mockExpenses } from "@/lib/mock/expenses";
import type { Expense } from "@/types/expense";
import Image from "next/image";

export default function ExpensesPage() {
  const [isEmpty] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const expenses = isEmpty ? [] : mockExpenses;

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-title">
            Expense Management
          </h1>
          <p className="text-sm text-brand-description">
            View and manage all submitted expenses
          </p>
        </div>
        <Button
          className="w-fit bg-brand-primary"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Submit Expense
        </Button>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <EmptyState
            title="No expenses found"
            description="Submit your first expense request"
            actionLabel="Submit Expense"
            onAction={() => setCreateOpen(true)}
            image={
              <Image
                src="/svgs/empty-inbox-with-shadow.svg"
                alt="No expenses"
                width={100}
                height={100}
              />
            }
          />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard value={expenses.length} label="Total Expenses" />
            <StatsCard
              value={expenses.filter((e) => e.status === "Pending").length}
              label="Pending Approval"
            />
            <StatsCard
              value={expenses.filter((e) => e.status === "Approved").length}
              label="Approved"
            />
            <StatsCard
              value={expenses.filter((e) => e.status === "Rejected").length}
              label="Rejected"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <ExpenseListTable
              expenses={expenses}
              onViewExpense={handleViewExpense}
            />
          </div>
        </>
      )}

      {/* Submit Expense Dialog */}
      <SubmitExpenseDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* Expense Details Sheet */}
      <ExpenseDetailsSheet
        expense={selectedExpense}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        footerAction="amend"
      />
    </div>
  );
}
