import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, IndianRupee, Users, ShieldX } from "lucide-react";
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
import { statusStyle } from "@/lib/status";
import { useRole, useSession } from "@/hooks/use-session";
import {
  fetchStaff,
  saveStaff,
  deleteStaff,
  fetchSalaries,
  saveSalary,
  deleteSalary,
  type StaffMember,
  type SalaryPayment,
} from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/payroll")({
  head: () => ({
    meta: [
      { title: "Staff & Payroll · Famtima Traders CRM" },
      { name: "description", content: "Manage team directory and monthly salary payouts." },
    ],
  }),
  component: PayrollPage,
});

type DraftStaff = Partial<StaffMember>;
type DraftSalary = Partial<SalaryPayment>;

function PayrollPage() {
  const qc = useQueryClient();
  const { user } = useSession();
  const { data: role, isLoading: loadingRole } = useRole(user?.id);
  const isAdmin = role === "admin";

  const [draftStaff, setDraftStaff] = useState<DraftStaff | null>(null);
  const [draftSalary, setDraftSalary] = useState<DraftSalary | null>(null);

  const { data: staff = [], isLoading: isLoadingStaff } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
    enabled: isAdmin,
    staleTime: 30_000,
  });

  const { data: salaries = [], isLoading: isLoadingSalaries } = useQuery({
    queryKey: ["salaries"],
    queryFn: () => fetchSalaries(),
    enabled: isAdmin,
    staleTime: 30_000,
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["staff"] });
    qc.invalidateQueries({ queryKey: ["salaries"] });
  }

  const saveStaffMutation = useMutation({
    mutationFn: (d: DraftStaff) => saveStaff(d),
    onSuccess: () => {
      toast.success("Staff member saved");
      setDraftStaff(null);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeStaff = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      toast.success("Staff member removed");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message || "Could not remove staff"),
  });

  const saveSalaryMutation = useMutation({
    mutationFn: (d: DraftSalary) => saveSalary(d),
    onSuccess: () => {
      toast.success("Salary payment recorded");
      setDraftSalary(null);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeSalary = useMutation({
    mutationFn: deleteSalary,
    onSuccess: () => {
      toast.success("Salary record deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message || "Could not delete salary record"),
  });

  function submitStaff() {
    if (!draftStaff) return;
    if (!draftStaff.name?.trim()) return toast.error("Name is required");
    saveStaffMutation.mutate({
      ...draftStaff,
      monthly_salary: Number(draftStaff.monthly_salary || 0),
    });
  }

  function submitSalary() {
    if (!draftSalary) return;
    if (!draftSalary.staff_id) return toast.error("Select a staff member");
    if (!draftSalary.period?.trim()) return toast.error("Month (Period) is required");
    saveSalaryMutation.mutate({
      ...draftSalary,
      amount: Number(draftSalary.amount || 0),
    });
  }

  const totalPayroll = (staff ?? []).reduce(
    (sum, s) => sum + (s.active ? Number(s.monthly_salary || 0) : 0),
    0,
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Staff & Payroll"
        description="Manage your team and track monthly salary payouts."
      />
      {!loadingRole && !isAdmin ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <ShieldX className="size-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold">Administrator Access Required</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Staff payroll and salary records are restricted to administrators. Contact your
              administrator if you need access.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Active Team Members</p>
                <p className="mt-2 text-3xl font-bold">{staff.filter((s) => s.active).length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Payroll Commitment
                </p>
                <p className="mt-2 text-3xl font-bold">{formatINR(totalPayroll)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="size-5" /> Staff Directory
            </h2>
            <Button onClick={() => setDraftStaff({ name: "", monthly_salary: 0, active: true })}>
              <Plus className="size-4" /> Add Staff
            </Button>
          </div>

          <div className="mb-8 overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Monthly Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingStaff &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={`skeleton-staff-${i}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-7 w-12" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoadingStaff && staff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No staff members added.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoadingStaff &&
                  staff.map((s) => {
                    const st = statusStyle(s.active ? "active" : "cancelled");
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.designation || "—"}</TableCell>
                        <TableCell>{s.phone || "—"}</TableCell>
                        <TableCell className="text-right">{formatINR(s.monthly_salary)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                            {s.active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setDraftStaff(s)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <IndianRupee className="size-5" /> Salary Payouts
            </h2>
            <Button
              onClick={() => {
                const today = new Date().toISOString().slice(0, 10);
                setDraftSalary({
                  paid_on: today,
                  period: today.slice(0, 7),
                  amount: 0,
                  mode: "cash",
                });
              }}
            >
              <Plus className="size-4" /> Record Payment
            </Button>
          </div>

          <div className="overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Date</TableHead>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSalaries &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={`skeleton-sal-${i}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-14" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-4 w-20" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-7 w-12" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoadingSalaries && salaries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No payouts recorded.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoadingSalaries &&
                  salaries.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.paid_on}</TableCell>
                      <TableCell className="font-medium">
                        {s.staff_members?.name || "Unknown"}
                      </TableCell>
                      <TableCell>{s.period}</TableCell>
                      <TableCell className="capitalize">{s.mode}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatINR(s.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <ConfirmDelete
                          label="Delete Salary Payment"
                          description="Are you sure you want to delete this salary payment record? This action cannot be undone."
                          onConfirm={() => removeSalary.mutate(s.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {draftStaff && (
            <Dialog open={true} onOpenChange={(v) => !v && setDraftStaff(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {draftStaff.id ? "Edit Staff Member" : "New Staff Member"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input
                      value={draftStaff.name || ""}
                      onChange={(e) => setDraftStaff({ ...draftStaff, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Designation</Label>
                    <Input
                      value={draftStaff.designation || ""}
                      onChange={(e) =>
                        setDraftStaff({ ...draftStaff, designation: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Monthly Salary (Base)</Label>
                    <Input
                      value={draftStaff.monthly_salary || ""}
                      onChange={(e) =>
                        setDraftStaff({
                          ...draftStaff,
                          monthly_salary: Number(onlyNumeric(e.target.value)) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={draftStaff.active}
                          onChange={() => setDraftStaff({ ...draftStaff, active: true })}
                        />{" "}
                        Active
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={!draftStaff.active}
                          onChange={() => setDraftStaff({ ...draftStaff, active: false })}
                        />{" "}
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={submitStaff} disabled={saveStaffMutation.isPending}>
                    Save Staff
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {draftSalary && (
            <Dialog open={true} onOpenChange={(v) => !v && setDraftSalary(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Salary Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Staff Member</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      value={draftSalary.staff_id || ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        const st = staff.find((x) => x.id === id);
                        setDraftSalary({
                          ...draftSalary,
                          staff_id: id,
                          amount: st?.monthly_salary || 0,
                        });
                      }}
                    >
                      <option value="" disabled>
                        Select staff...
                      </option>
                      {staff
                        .filter((s) => s.active)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Paid On Date</Label>
                    <Input
                      type="date"
                      value={draftSalary.paid_on || ""}
                      onChange={(e) => setDraftSalary({ ...draftSalary, paid_on: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Salary Month (Period)</Label>
                    <Input
                      type="month"
                      value={draftSalary.period || ""}
                      onChange={(e) => setDraftSalary({ ...draftSalary, period: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Amount Paid</Label>
                    <Input
                      value={draftSalary.amount || ""}
                      onChange={(e) =>
                        setDraftSalary({
                          ...draftSalary,
                          amount: Number(onlyNumeric(e.target.value)) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={submitSalary} disabled={saveSalaryMutation.isPending}>
                    Record Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}
