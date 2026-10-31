import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_LOGO_URL } from "@/lib/branding";
import { fetchCompany } from "@/lib/crm";

export const Route = createFileRoute("/admin-login")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin Portal · Fatima Traders CRM" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

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
        if (data.user) navigate({ to: "/dashboard", replace: true });
      })
      .catch(() => {
        void supabase.auth.signOut({ scope: "local" });
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    await supabase.auth.signOut();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        return toast.error("Email ya password sahi nahi hai.");
      }
      return toast.error(error.message);
    }
    navigate({ to: "/dashboard", replace: true });
  }

  async function signUpAdmin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    await supabase.auth.signOut();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim() },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);

    if (data.session) {
      toast.success("Admin account created successfully!");
      navigate({ to: "/dashboard", replace: true });
    } else {
      toast.success(
        "Account created! Check your email to confirm if email verification is enabled.",
      );
    }
  }

  async function forgotPassword() {
    if (!email) return toast.error("Pehle apna email enter karein.");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset link aapke email par bhej diya gaya hai.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-10">
      <div className="w-full max-w-md">
        <Button variant="ghost" asChild className="mb-4 text-muted-foreground">
          <Link to="/auth">
            <ArrowLeft className="mr-2 size-4" /> Back to Portals
          </Link>
        </Button>

        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logoUrl}
            alt="Fatima Traders logo"
            className="mb-3 size-24 rounded-full bg-white object-contain p-1 border-2 border-emerald-500/20 shadow-md"
          />
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-primary" />
            <h1 className="font-display text-2xl text-sidebar-primary">Admin Portal</h1>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/70">
            Fatima Traders
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Sign in or register the owner/admin account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form className="space-y-4" onSubmit={signIn}>
                  <div>
                    <Label htmlFor="admin-email" className="mb-1.5 block">
                      Email
                    </Label>
                    <Input
                      id="admin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password" className="mb-1.5 block">
                      Password
                    </Label>
                    <Input
                      id="admin-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" disabled={busy}>
                    {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Sign In
                  </Button>
                  <button
                    type="button"
                    onClick={forgotPassword}
                    className="w-full text-center text-xs text-muted-foreground underline"
                  >
                    Forgot password?
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form className="space-y-4" onSubmit={signUpAdmin}>
                  <div>
                    <Label htmlFor="admin-name" className="mb-1.5 block">
                      Full Name
                    </Label>
                    <Input
                      id="admin-name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-signup-email" className="mb-1.5 block">
                      Email
                    </Label>
                    <Input
                      id="admin-signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-signup-password" className="mb-1.5 block">
                      Password
                    </Label>
                    <Input
                      id="admin-signup-password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" disabled={busy}>
                    {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Create Admin Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
