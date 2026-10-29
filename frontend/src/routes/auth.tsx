import { useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_LOGO_URL } from "@/lib/branding";
import { fetchCompany } from "@/lib/crm";
import { ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Select Portal · Famtima Traders CRM" },
      { name: "description", content: "Choose login portal" },
    ],
  }),
  component: AuthChooserPage,
});

function AuthChooserPage() {
  const navigate = useNavigate();
  const { data: company } = useQuery({ queryKey: ["company"], queryFn: fetchCompany });
  const logoUrl =
    company?.logo_url && !company.logo_url.startsWith("data:image")
      ? company.logo_url
      : DEFAULT_LOGO_URL;

  useEffect(() => {
    let active = true;
    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          void supabase.auth.signOut({ scope: "local" });
          return;
        }
        if (data.user) {
          navigate({ to: "/dashboard", replace: true });
        }
      })
      .catch(() => {
        void supabase.auth.signOut({ scope: "local" });
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logoUrl}
            alt="Famtima Traders logo"
            className="mb-3 size-24 rounded-full bg-white object-contain p-1 border-2 border-emerald-500/20 shadow-md"
          />
          <h1 className="font-display text-2xl text-sidebar-primary">Famtima Traders</h1>
          <p className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/70">
            Quotation &amp; Billing CRM
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Select a portal to continue.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild variant="outline" className="h-16 justify-start text-lg">
              <Link to="/admin-login">
                <ShieldCheck className="mr-4 size-6 text-primary" />
                Admin Portal
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 justify-start text-lg">
              <Link to="/employee-login">
                <Users className="mr-4 size-6 text-primary" />
                Employee Portal
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
