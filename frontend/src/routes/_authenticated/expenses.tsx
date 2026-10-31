import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Receipt as ReceiptIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDelete } from "@/components/doc/ConfirmDelete";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR, onlyNumeric } from "@/lib/format";
import { fetchExpenses, saveExpense, deleteExpense, fetchCashflow, type Expense } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses & Cashflow · Fatima Traders CRM" },
      { name: "description", content: "Track company expenses and overall cashflow." },
    ],
  }),
  component: ExpensesPage,
});

type DraftExpense = Partial<Expense>;

const EXPENSE_CATEGORIES = [
  "Material",
  "Transport",
  "Food/Chai",
  "Office Supplies",
  "Marketing",
  "Other",
];

function ExpensesPage() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<DraftExpense | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => fetchExpenses(),
    staleTime: 30_000,
  });

  const { data: cashflow } = useQuery({
    queryKey: ["cashflow", currentMonth],
    queryFn: () => fetchCashflow(currentMonth),
    staleTime: 30_000,
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["expenses"] });
    qc.invalidateQueries({ queryKey: ["cashflow"] });
  }

  const saveMutation = useMutation({
    mutationFn: (d: DraftExpense) => saveExpense(d),
    onSuccess: () => {
      toast.success("Expense saved");
      setDraft(null);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast.success("Expense deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message || "Could not delete expense"),
  });

  function submit() {
    if (!draft) return;
    if (!draft.category?.trim()) return toast.error("Category is required");
    if (!draft.date) return toast.error("Date is required");
    saveMutation.mutate({
      ...draft,
      amount: Number(draft.amount || 0),
    });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Expenses & Cashflow"
        description="Track your outflow, manage categories, and monitor net cash."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Lifetime Inflow</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {formatINR(cashflow?.inflow ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Lifetime Outflow</p>
            <p className="mt-2 text-2xl font-bold text-rose-600">
              {formatINR(cashflow?.outflow ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Lifetime Net Cash</p>
            <p className="mt-2 text-2xl font-bold">{formatINR(cashflow?.netCash ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">This Month Outflow</p>
            <p className="mt-2 text-2xl font-bold text-rose-500">
              {formatINR((cashflow?.thisMonthExpenses ?? 0) + (cashflow?.thisMonthSalaries ?? 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ReceiptIcon className="size-5" /> Expense Log
        </h2>
        <Button
          onClick={() =>
            setDraft({
              date: new Date().toISOString().slice(0, 10),
              amount: 0,
              category: "Material",
              mode: "upi",
            })
          }
        >
          <Plus className="size-4" /> Add Expense
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Notes / Reference</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`skeleton-exp-${i}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-7 w-12" />
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No expenses logged.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground font-medium">
                      {e.category}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {e.notes || e.reference || "—"}
                  </TableCell>
                  <TableCell className="capitalize">{e.mode}</TableCell>
                  <TableCell className="text-right font-medium">{formatINR(e.amount)}</TableCell>
                  <TableCell className="text-right">
                    <ConfirmDelete
                      label="Delete Expense"
                      description="Are you sure you want to delete this expense record? This action cannot be undone."
                      onConfirm={() => removeMutation.mutate(e.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {draft && (
        <Dialog open={true} onOpenChange={(v) => !v && setDraft(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Expense</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={draft.date || ""}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={draft.category || ""}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Amount</Label>
                <Input
                  value={draft.amount || ""}
                  onChange={(e) =>
                    setDraft({ ...draft, amount: Number(onlyNumeric(e.target.value)) || 0 })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Mode of Payment</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={draft.mode || "upi"}
                  onChange={(e) => setDraft({ ...draft, mode: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Notes / Reference (Optional)</Label>
                <Input
                  value={draft.notes || ""}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submit} disabled={saveMutation.isPending}>
                Save Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
