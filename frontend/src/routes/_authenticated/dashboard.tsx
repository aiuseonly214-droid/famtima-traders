import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  Receipt as ReceiptIcon,
  ScrollText,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchInquiryStats, fetchRecentDocs, fetchSummary } from "@/lib/crm";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Fatima Traders CRM" },
      {
        name: "description",
        content: "Overview of customers, quotations, invoices and outstanding payments.",
      },
      { property: "og:title", content: "Dashboard · Fatima Traders CRM" },
      { property: "og:description", content: "Quotation, invoice and receipt overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

/** 60 seconds — avoids hammering Supabase on every route focus change */
const STALE = 60_000;

function Dashboard() {
  const { data: s, isLoading: loadingS } = useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
    staleTime: STALE,
  });
  const { data: inq } = useQuery({
    queryKey: ["inquiry-stats"],
    queryFn: fetchInquiryStats,
    staleTime: STALE,
  });
  // Single efficient query for all 3 recent lists — only fetches 5 rows each
  const { data: recent, isLoading: loadingRecent } = useQuery({
    queryKey: ["recent-docs"],
    queryFn: fetchRecentDocs,
    staleTime: STALE,
  });

  const cards = [
    {
      label: "Inquiries",
      value: String(inq?.total ?? "—"),
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Conversion",
      value: inq ? `${inq.conversion}%` : "—",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Customers",
      value: String(s?.customers ?? "—"),
      icon: Users,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Quotations",
      value: String(s?.quotations ?? "—"),
      icon: ScrollText,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Invoiced",
      value: s ? formatINR(s.invoiced) : "—",
      icon: FileText,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Outstanding",
      value: s ? formatINR(s.outstanding) : "—",
      icon: ReceiptIcon,
      color: s?.outstanding ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Dashboard"
        description="Your quotations, invoices and payments at a glance."
      />

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link to="/inquiries">
            <Plus className="size-4" /> New Inquiry
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/quotations/new">
            <Plus className="size-4" /> New Quotation
          </Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link to="/invoices/new">
            <Plus className="size-4" /> New Invoice
          </Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link to="/receipts/new">
            <Plus className="size-4" /> New Receipt
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/customers">
            <Plus className="size-4" /> New Customer
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 pt-6">
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                {loadingS ? (
                  <Skeleton className="mt-1 h-6 w-24" />
                ) : (
                  <p className="truncate font-display text-xl">{value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        <RecentCard title="Recent Quotations" to="/quotations" isLoading={loadingRecent}>
          {(recent?.quotations ?? []).map((q) => (
            <Link
              key={q.id}
              to="/quotations/$id"
              params={{ id: q.id }}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium font-mono text-xs">{q.code}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {q.customers?.name} · {formatDate(q.date)}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-sm font-medium">
                {formatINR(q.grand_total)}
              </span>
            </Link>
          ))}
          {!loadingRecent && (recent?.quotations ?? []).length === 0 && (
            <Empty>No quotations yet</Empty>
          )}
        </RecentCard>

        <RecentCard title="Recent Invoices" to="/invoices" isLoading={loadingRecent}>
          {(recent?.invoices ?? []).map((i) => (
            <Link
              key={i.id}
              to="/invoices/$id"
              params={{ id: i.id }}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium font-mono text-xs">{i.code}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {i.customers?.name} · {formatDate(i.date)}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-sm font-medium">
                {formatINR(i.grand_total)}
              </span>
            </Link>
          ))}
          {!loadingRecent && (recent?.invoices ?? []).length === 0 && (
            <Empty>No invoices yet</Empty>
          )}
        </RecentCard>

        <RecentCard title="Recent Receipts" to="/receipts" isLoading={loadingRecent}>
          {(recent?.receipts ?? []).map((r) => (
            <Link
              key={r.id}
              to="/receipts/$id"
              params={{ id: r.id }}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium font-mono text-xs">{r.code}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {r.customers?.name} · {formatDate(r.date)}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-sm font-medium text-emerald-700">
                {formatINR(r.amount_received)}
              </span>
            </Link>
          ))}
          {!loadingRecent && (recent?.receipts ?? []).length === 0 && (
            <Empty>No receipts yet</Empty>
          )}
        </RecentCard>
      </div>
    </div>
  );
}

function RecentCard({
  title,
  to,
  isLoading,
  children,
}: {
  title: string;
  to: string;
  isLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Link
            to={to as never}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline transition-colors"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))
          : children}
      </CardContent>
    </Card>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-2 py-4 text-sm text-muted-foreground">{children}</p>;
}
