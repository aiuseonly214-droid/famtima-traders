import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDelete } from "@/components/doc/ConfirmDelete";
import { formatDate, formatINR } from "@/lib/format";
import { statusStyle } from "@/lib/status";

export type DocListRow = {
  id: string;
  code: string;
  date: string;
  customerName: string | undefined;
  amount: number;
  status: string;
};

export function DocListPage({
  title,
  description,
  newTo,
  rows,
  isLoading,
  search,
  onSearch,
  hrefFor,
  amountLabel = "Amount",
  onDelete,
}: {
  title: string;
  description: string;
  newTo: "/quotations/new" | "/invoices/new" | "/receipts/new";
  rows: DocListRow[];
  isLoading: boolean;
  search: string;
  onSearch: (v: string) => void;
  hrefFor: (id: string) => React.ReactNode;
  amountLabel?: string;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={title}
        description={description}
        action={
          <Button asChild>
            <Link to={newTo}>
              <Plus className="size-4" /> New
            </Link>
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9 transition-shadow focus:shadow-sm"
          placeholder="Search by document number or customer"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[130px]">Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">{amountLabel}</TableHead>
                  <TableHead className="w-[130px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-4 w-20" />
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  ))}
                {!isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      Nothing here yet
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((r) => {
                  const s = statusStyle(r.status);
                  return (
                    <TableRow key={r.id} className="transition-colors hover:bg-muted/40">
                      <TableCell className="font-mono text-xs font-medium">{r.code}</TableCell>
                      <TableCell className="text-sm">{formatDate(r.date)}</TableCell>
                      <TableCell className="font-medium">{r.customerName || "—"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.badge}`}
                        >
                          <span className={`size-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatINR(r.amount)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right">
                        {hrefFor(r.id)}
                        {onDelete && (
                          <ConfirmDelete
                            label={`Delete ${r.code}`}
                            description="This permanently removes the document and everything linked to it."
                            onConfirm={() => onDelete(r.id)}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function useSearchState(initial = "") {
  return useState(initial);
}
