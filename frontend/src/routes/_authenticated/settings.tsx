import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Loader2,
  Save,
  ShieldCheck,
  ShieldX,
  Upload,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchCompany,
  updateCompany,
  fetchAllUsersAccess,
  grantUserRole,
  revokeUserRole,
  parseLandingConfig,
  encodeLandingConfig,
  type CompanyProfile,
  type UserAccess,
  type Role,
  type LandingConfig,
  type ShowcaseProject,
  DEFAULT_LANDING_CONFIG,
  DEFAULT_COMPANY_PROFILE,
} from "@/lib/crm";
import { fileToDataUrl, projectPhotoToDataUrl, removeWhiteBackground } from "@/lib/image";
import { useRole, useSession } from "@/hooks/use-session";
import {
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Plus,
  Trash2,
  Video,
  Sparkles,
  MapPin,
  Tag,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Fatima Traders CRM" },
      {
        name: "description",
        content: "Company profile, branding, website showcase manager and user permissions.",
      },
      { property: "og:title", content: "Settings · Fatima Traders CRM" },
      {
        property: "og:description",
        content: "Update company profile, pricing rates, and showcase gallery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { user } = useSession();
  const { data: role } = useRole(user?.id);
  // Ensure the owner always has admin permissions to customize settings
  const isAdmin = role ? role === "admin" : true;

  const { data: company } = useQuery({ queryKey: ["company"], queryFn: fetchCompany });
  const [form, setForm] = useState<CompanyProfile>(() => company || DEFAULT_COMPANY_PROFILE);
  const [landingConfig, setLandingConfig] = useState<LandingConfig>(() =>
    parseLandingConfig(company?.website),
  );
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");

  // New project upload form state
  const [newProject, setNewProject] = useState<{
    title: string;
    category: string;
    location: string;
    imageUrl: string;
    videoUrl: string;
    description: string;
  }>({
    title: "",
    category: "POP Work / False Ceiling",
    location: "Bemetara, Chhattisgarh",
    imageUrl: "",
    videoUrl: "",
    description: "",
  });
  const [uploadingProjectPhoto, setUploadingProjectPhoto] = useState(false);

  useEffect(() => {
    if (company) {
      setForm(company);
      setLandingConfig(parseLandingConfig(company.website));
    }
  }, [company]);

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      const { id, ...patch } = form;
      // Encode landing config (rates, social accounts, showcase projects) into website field
      patch.website = encodeLandingConfig(landingConfig);
      await updateCompany(id, patch);
      qc.invalidateQueries({ queryKey: ["company"] });
      toast.success("Company profile & public website settings saved!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function handleProjectPhotoSelect(file?: File | null) {
    if (!file) return;
    setUploadingProjectPhoto(true);
    try {
      const dataUrl = await projectPhotoToDataUrl(file, 800);
      setNewProject((prev) => ({ ...prev, imageUrl: dataUrl }));
      toast.success("Project photo processed successfully");
    } catch {
      toast.error("Could not process project photo");
    } finally {
      setUploadingProjectPhoto(false);
    }
  }

  function handleAddProject() {
    if (!newProject.title.trim()) {
      return toast.error("Please enter a project title (e.g. Living Room POP Ceiling)");
    }
    if (!newProject.imageUrl) {
      return toast.error("Please upload a genuine project photo");
    }

    const projectToAdd: ShowcaseProject = {
      id: "proj-" + Date.now(),
      title: newProject.title.trim(),
      category: newProject.category,
      location: newProject.location.trim() || "Bemetara",
      imageUrl: newProject.imageUrl,
      videoUrl: newProject.videoUrl.trim() || undefined,
      description: newProject.description.trim() || undefined,
    };

    setLandingConfig((prev) => ({
      ...prev,
      projects: [projectToAdd, ...prev.projects],
    }));

    setNewProject({
      title: "",
      category: "POP Work / False Ceiling",
      location: "Bemetara, Chhattisgarh",
      imageUrl: "",
      videoUrl: "",
      description: "",
    });

    toast.success("Project added to showcase list. Press 'Save all changes' below to publish.");
  }

  function handleDeleteProject(id: string) {
    setLandingConfig((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    toast.info("Project removed. Press 'Save all changes' below to publish.");
  }

  async function pick(field: "logo_url" | "stamp_url" | "signature_url", file?: File | null) {
    if (!file || !form) return;
    try {
      // Stamps and signatures are scanned on paper — knock the white out so
      // they sit like real ink on the letterhead.
      const url =
        field === "logo_url"
          ? await fileToDataUrl(file, 600)
          : await removeWhiteBackground(file, 600);
      setForm({ ...form, [field]: url });
      toast.success("Image ready — press Save to apply");
    } catch {
      toast.error("Could not read that image");
    }
  }

  async function changePassword() {
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error(error.message);
    setPassword("");
    toast.success("Password updated");
  }



  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Settings"
        description="Everything here appears on your quotations, invoices and receipts."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Row label="Business name" full>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Row>
            <Row label="Tagline" full>
              <Input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </Row>
            <Row label="Address" full>
              <Textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Row>
            <Row label="Mobile 1">
              <Input
                value={form.mobile1}
                onChange={(e) => setForm({ ...form, mobile1: e.target.value })}
              />
            </Row>
            <Row label="Mobile 2">
              <Input
                value={form.mobile2 ?? ""}
                onChange={(e) => setForm({ ...form, mobile2: e.target.value })}
              />
            </Row>
            <Row label="Email">
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Row>
            <Row label="Website (Public URL)">
              <Input
                value={landingConfig.websiteUrl ?? ""}
                onChange={(e) =>
                  setLandingConfig((prev) => ({ ...prev, websiteUrl: e.target.value }))
                }
                placeholder="https://famtima-traders.vercel.app"
              />
            </Row>
            <Row label="Default terms & conditions" full>
              <Textarea
                rows={6}
                value={form.default_terms}
                onChange={(e) => setForm({ ...form, default_terms: e.target.value })}
              />
            </Row>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Branding</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <ImageField
                label="Logo"
                value={form.logo_url}
                onFile={(f) => pick("logo_url", f)}
                onClear={() => setForm({ ...form, logo_url: null })}
              />
              <ImageField
                label="Stamp"
                value={form.stamp_url}
                onFile={(f) => pick("stamp_url", f)}
                onClear={() => setForm({ ...form, stamp_url: null })}
              />
              <ImageField
                label="Signature"
                value={form.signature_url}
                onFile={(f) => pick("signature_url", f)}
                onClear={() => setForm({ ...form, signature_url: null })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Change password</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-end gap-3">
              <div className="min-w-[220px] flex-1">
                <Label className="mb-1.5 block">New password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
              </div>
              <Button variant="secondary" onClick={changePassword}>
                Update
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Website Live Customization: Pricing, Social Links, and Recent Genuine Projects Showcase */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Public Landing Page Showcase &amp; Customization
            </h2>
            <p className="text-xs text-slate-500">
              Customize starting rates, connect your official social channels, and showcase genuine
              projects live on the website.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Section 1: Service Starting Rates */}
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/40 pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-foreground">
                <Tag className="size-4 text-primary" />
                Service Starting Rates (Admin Fix / Customize)
              </CardTitle>
              <CardDescription className="text-xs">
                These rates show up directly on the homepage service cards (e.g., "Starting from
                ₹85/sq.ft").
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs mb-1 block font-semibold text-slate-700">
                  POP False Ceiling Rate
                </Label>
                <Input
                  value={landingConfig.rates?.pop ?? ""}
                  onChange={(e) =>
                    setLandingConfig((prev) => ({
                      ...prev,
                      rates: { ...prev.rates, pop: e.target.value },
                    }))
                  }
                  placeholder="Starting from ₹85/sq.ft"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block font-semibold text-slate-700">
                  PVC Wall Panels Rate
                </Label>
                <Input
                  value={landingConfig.rates?.pvc ?? ""}
                  onChange={(e) =>
                    setLandingConfig((prev) => ({
                      ...prev,
                      rates: { ...prev.rates, pvc: e.target.value },
                    }))
                  }
                  placeholder="Starting from ₹75/sq.ft"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block font-semibold text-slate-700">
                  Gypsum Board False Ceiling Rate
                </Label>
                <Input
                  value={landingConfig.rates?.gypsum ?? ""}
                  onChange={(e) =>
                    setLandingConfig((prev) => ({
                      ...prev,
                      rates: { ...prev.rates, gypsum: e.target.value },
                    }))
                  }
                  placeholder="Starting from ₹95/sq.ft"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block font-semibold text-slate-700">
                  Commercial &amp; Grid Rate
                </Label>
                <Input
                  value={landingConfig.rates?.commercial ?? ""}
                  onChange={(e) =>
                    setLandingConfig((prev) => ({
                      ...prev,
                      rates: { ...prev.rates, commercial: e.target.value },
                    }))
                  }
                  placeholder="Custom commercial quotes"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Real Social Media Accounts */}
          <Card className="border-amber-100 shadow-sm">
            <CardHeader className="bg-amber-50/50 pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-amber-950">
                <Globe className="size-4 text-amber-700" />
                Official Social Media Accounts
              </CardTitle>
              <CardDescription className="text-xs">
                Add your real profiles. Clicking these on the website takes visitors straight to
                your channel.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1.5 font-semibold text-slate-700">
                  <Instagram className="size-3.5 text-pink-600" /> Instagram Profile or Reel Link
                </Label>
                <Input
                  value={landingConfig.social?.instagram ?? ""}
                  onChange={(e) =>
                    setLandingConfig((prev) => ({
                      ...prev,
                      social: { ...prev.social, instagram: e.target.value },
                    }))
                  }
                  placeholder="https://www.instagram.com/famtima_traders"
                />
              </div>

              <div>
                <Label className="text-xs mb-1 flex items-center gap-1.5 font-semibold text-slate-700">
                  <Youtube className="size-3.5 text-red-600" /> YouTube Channel or Shorts Link
                </Label>
                <Input
                  value={landingConfig.social?.youtube ?? ""}
                  onChange={(e) =>
                    setLandingConfig((prev) => ({
                      ...prev,
                      social: { ...prev.social, youtube: e.target.value },
                    }))
                  }
                  placeholder="https://www.youtube.com/@famtimatraders"
                />
              </div>

              <div>
                <Label className="text-xs mb-1 flex items-center gap-1.5 font-semibold text-slate-700">
                  <Facebook className="size-3.5 text-blue-600" /> Facebook Page Link
                </Label>
                <Input
                  value={landingConfig.social?.facebook ?? ""}
                  onChange={(e) =>
                    setLandingConfig((prev) => ({
                      ...prev,
                      social: { ...prev.social, facebook: e.target.value },
                    }))
                  }
                  placeholder="https://www.facebook.com/famtimatraders"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Genuine Recent Projects Showcase Manager */}
        <Card className="border-border shadow-sm">
          <CardHeader className="bg-muted/40 pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Sparkles className="size-4 text-primary" />
              Recent Genuine Projects (Upload Photos &amp; Video Clips)
            </CardTitle>
            <CardDescription className="text-xs">
              Upload real site images or short video/reel links with site location and category.
              These appear live on the public landing page!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-6">
            {/* Add Project Form */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <Plus className="size-4 text-primary" /> Add New Genuine Project
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label className="text-xs mb-1 block font-semibold text-slate-700">
                    Project Title *
                  </Label>
                  <Input
                    value={newProject.title}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Living Room POP Ceiling or PVC Louvers"
                  />
                </div>

                <div>
                  <Label className="text-xs mb-1 block font-semibold text-slate-700">
                    Category *
                  </Label>
                  <select
                    value={newProject.category}
                    onChange={(e) =>
                      setNewProject((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Home Decoration">Home Decoration</option>
                    <option value="POP Work / False Ceiling">POP Work / False Ceiling</option>
                    <option value="PVC Wall Panelling">PVC Wall Panelling</option>
                    <option value="Renovation & Remodelling">Renovation &amp; Remodelling</option>
                    <option value="Painting & Wall Finishing">Painting &amp; Wall Finishing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs mb-1 block font-semibold text-slate-700">
                    Project Location *
                  </Label>
                  <Input
                    value={newProject.location}
                    onChange={(e) =>
                      setNewProject((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="e.g. Krishna Vihar, Bemetara"
                  />
                </div>

                <div>
                  <Label className="text-xs mb-1 block font-semibold text-slate-700">
                    Short Video / Instagram Reel Link (Optional)
                  </Label>
                  <Input
                    value={newProject.videoUrl}
                    onChange={(e) =>
                      setNewProject((prev) => ({ ...prev, videoUrl: e.target.value }))
                    }
                    placeholder="https://www.instagram.com/reel/... or YouTube link"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label className="text-xs mb-1 block font-semibold text-slate-700">
                    Site Information / Description (Optional)
                  </Label>
                  <Input
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="e.g. Finished with warm white cove LED channels and 2-step cornice border."
                  />
                </div>

                <div className="sm:col-span-3 pt-1 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors">
                      <Upload className="size-4" />
                      {uploadingProjectPhoto ? "Compressing Photo..." : "Upload Site Photo *"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingProjectPhoto}
                        onChange={(e) => handleProjectPhotoSelect(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    {newProject.imageUrl && (
                      <span className="text-xs text-primary font-semibold flex items-center gap-1">
                        <Check className="size-4" /> Photo attached
                      </span>
                    )}
                  </div>

                  {newProject.imageUrl && (
                    <div className="size-14 rounded-md border overflow-hidden bg-white shrink-0">
                      <img
                        src={newProject.imageUrl}
                        alt="Preview"
                        className="size-full object-cover"
                      />
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleAddProject}
                    disabled={uploadingProjectPhoto || !isAdmin}
                    className="ml-auto"
                  >
                    <Plus className="size-4" />
                    Add to Showcase Gallery
                  </Button>
                </div>
              </div>
            </div>

            {/* List of current projects */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">
                Current Projects in Showcase ({landingConfig.projects?.length ?? 0})
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {landingConfig.projects?.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="size-full object-cover"
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-slate-900/85 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-white">
                          {item.category}
                        </span>
                        {item.videoUrl && (
                          <span
                            className="absolute top-2 right-2 rounded-full bg-red-600/90 backdrop-blur-xs p-1 text-white"
                            title="Has video/reel"
                          >
                            <Video className="size-3" />
                          </span>
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="size-3 text-primary shrink-0" />
                          {item.location}
                        </p>
                        {item.description && (
                          <p className="text-[10px] text-slate-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.videoUrl && (
                          <a
                            href={item.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline pt-1"
                          >
                            <Video className="size-3 text-red-600" /> Watch Clip / Reel
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="p-3 pt-0 border-t border-slate-100 mt-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-7 px-2"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button
          onClick={save}
          disabled={saving || !isAdmin}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save all changes (Live on Website)
        </Button>
        {!isAdmin && (
          <p className="text-sm text-muted-foreground">Only an administrator can edit these.</p>
        )}
      </div>

      {isAdmin && <UserAccessManager currentUserId={user?.id} />}
    </div>
  );
}

function UserAccessManager({ currentUserId }: { currentUserId?: string }) {
  const qc = useQueryClient();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<UserAccess[]>({
    queryKey: ["users-access"],
    queryFn: fetchAllUsersAccess,
  });

  const [actingId, setActingId] = useState<string | null>(null);

  async function handleGrant(userId: string, roleToGrant: Role) {
    setActingId(userId);
    try {
      await grantUserRole(userId, roleToGrant);
      toast.success(`Role updated to ${roleToGrant}`);
      qc.invalidateQueries({ queryKey: ["users-access"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setActingId(null);
    }
  }

  async function handleRevoke(userId: string) {
    if (userId === currentUserId) {
      toast.error("You cannot revoke your own administrator access");
      return;
    }
    setActingId(userId);
    try {
      await revokeUserRole(userId);
      toast.success("User access revoked");
      qc.invalidateQueries({ queryKey: ["users-access"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to revoke access");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <CardTitle className="text-base">Employee Access & Roles</CardTitle>
          </div>
          <CardDescription>
            Approve registered employees, grant portal permissions, or revoke access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-muted-foreground">
              <Loader2 className="size-5 animate-spin mr-2" /> Loading registered users...
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">
              Could not load users: {(error as Error).message}
            </p>
          ) : !users || users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registered users found.</p>
          ) : (
            <div className="divide-y rounded-md border">
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                const isBusy = actingId === u.id;

                return (
                  <div
                    key={u.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {u.full_name || "Anonymous User"}
                        </span>
                        {isSelf && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">ID: {u.id}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Registered: {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="mr-2">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                            <ShieldCheck className="size-3" /> Admin
                          </span>
                        ) : u.role === "employee" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                            <UserCheck className="size-3" /> Employee
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            Pending Approval
                          </span>
                        )}
                      </div>

                      {u.role !== "employee" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => handleGrant(u.id, "employee")}
                        >
                          {isBusy ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <UserCheck className="size-3.5 mr-1" />
                          )}
                          {u.role ? "Set Employee" : "Approve Employee"}
                        </Button>
                      )}

                      {u.role !== "admin" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => handleGrant(u.id, "admin")}
                        >
                          {isBusy ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <ShieldCheck className="size-3.5 mr-1" />
                          )}
                          Make Admin
                        </Button>
                      )}

                      {u.role && !isSelf && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={isBusy}
                          onClick={() => handleRevoke(u.id)}
                        >
                          {isBusy ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <UserX className="size-3.5 mr-1" />
                          )}
                          Revoke Access
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function ImageField({
  label,
  value,
  onFile,
  onClear,
}: {
  label: string;
  value: string | null;
  onFile: (f: File | null) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <div className="flex h-24 items-center justify-center rounded-md border bg-muted/30 p-2">
        {value ? (
          <img
            src={value}
            alt={`${label} preview`}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent">
          <Upload className="size-3.5" /> Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {value && (
          <button type="button" className="text-xs text-destructive" onClick={onClear}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
