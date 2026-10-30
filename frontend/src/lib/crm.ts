import { supabase } from "@/integrations/supabase/client";
import { todayISO } from "@/lib/format";

export type Role = "admin" | "employee";

export type CompanyProfile = {
  id: string;
  name: string;
  tagline: string;
  address: string;
  mobile1: string;
  mobile2: string | null;
  email: string;
  website: string | null;
  logo_url: string | null;
  stamp_url: string | null;
  signature_url: string | null;
  currency: string;
  default_terms: string;
};

export type ShowcaseProject = {
  id: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  videoUrl?: string;
  description?: string;
};

export type ServiceRates = {
  pop: string;
  pvc: string;
  gypsum: string;
  commercial: string;
};

export type SocialLinks = {
  instagram?: string;
  youtube?: string;
  facebook?: string;
};

export type LandingConfig = {
  websiteUrl?: string;
  rates: ServiceRates;
  social: SocialLinks;
  projects: ShowcaseProject[];
};

export const DEFAULT_SHOWCASE_PROJECTS: ShowcaseProject[] = [];

export const DEFAULT_SERVICE_RATES: ServiceRates = {
  pop: "Contact for Pricing",
  pvc: "Contact for Pricing",
  gypsum: "Contact for Pricing",
  commercial: "Contact for Pricing",
};

export const DEFAULT_LANDING_CONFIG: LandingConfig = {
  websiteUrl: "",
  rates: DEFAULT_SERVICE_RATES,
  social: {
    instagram: "",
    youtube: "",
    facebook: "",
  },
  projects: DEFAULT_SHOWCASE_PROJECTS,
};

export function parseLandingConfig(rawWebsite?: string | null): LandingConfig {
  if (!rawWebsite || !rawWebsite.trim()) {
    return DEFAULT_LANDING_CONFIG;
  }
  const trimmed = rawWebsite.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        websiteUrl: parsed.websiteUrl || parsed.url || "",
        rates: {
          pop: parsed.rates?.pop || DEFAULT_SERVICE_RATES.pop,
          pvc: parsed.rates?.pvc || DEFAULT_SERVICE_RATES.pvc,
          gypsum: parsed.rates?.gypsum || DEFAULT_SERVICE_RATES.gypsum,
          commercial: parsed.rates?.commercial || DEFAULT_SERVICE_RATES.commercial,
        },
        social: {
          instagram: parsed.social?.instagram || "",
          youtube: parsed.social?.youtube || "",
          facebook: parsed.social?.facebook || "",
        },
        projects:
          Array.isArray(parsed.projects) && parsed.projects.length > 0
            ? parsed.projects
            : DEFAULT_SHOWCASE_PROJECTS,
      };
    } catch {
      // Fallback
    }
  }
  return {
    ...DEFAULT_LANDING_CONFIG,
    websiteUrl: trimmed,
  };
}

export function encodeLandingConfig(config: LandingConfig): string {
  return JSON.stringify(config);
}

export function getDisplayWebsite(rawWebsite?: string | null): string {
  if (!rawWebsite) return "";
  const trimmed = rawWebsite.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return parsed.websiteUrl || parsed.url || "";
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

export type Customer = {
  id: string;
  code: string;
  name: string;
  mobile: string;
  alt_mobile: string | null;
  email: string | null;
  site_address: string | null;
  billing_address: string | null;
  city: string | null;
  notes: string | null;
  created_at: string;
};

export type DocItem = {
  id?: string;
  sr: number;
  particular: string;
  description: string | null;
  unit: string | null;
  qty: number;
  rate: number;
  amount: number;
  /** When false the row is an "option" — listed on the document but not summed. */
  include_in_total?: boolean;
  /** Optional section name; null/undefined = ungrouped (legacy behaviour). */
  group_name?: string | null;
};

export type Quotation = {
  id: string;
  code: string;
  customer_id: string;
  date: string;
  valid_till: string | null;
  subject: string | null;
  subtotal: number;
  discount: number;
  grand_total: number;
  amount_words: string | null;
  terms: string | null;
  status: string;
  show_totals?: boolean;
  /** Controls block-level subtotal rows independently from the final totals panel. */
  show_section_subtotals?: boolean;
  created_at: string;
  customers?: Customer | null;
};

export type Invoice = {
  id: string;
  code: string;
  customer_id: string;
  quotation_id: string | null;
  date: string;
  due_date: string | null;
  subject: string | null;
  subtotal: number;
  discount: number;
  grand_total: number;
  amount_words: string | null;
  terms: string | null;
  status: string;
  show_totals?: boolean;
  /** Controls block-level subtotal rows independently from the final totals panel. */
  show_section_subtotals?: boolean;
  created_at: string;
  customers?: Customer | null;
};

export type Receipt = {
  id: string;
  code: string;
  customer_id: string;
  invoice_id: string | null;
  date: string;
  total_amount: number;
  previous_paid: number;
  amount_received: number;
  balance: number;
  mode: string;
  txn_id: string | null;
  amount_words: string | null;
  notes: string | null;
  created_at: string;
  customers?: Customer | null;
};

const db = supabase as unknown as {
  from: (table: string) => any;
};

/** Current signed-in user id, used to stamp `created_by` on new rows. */
async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/* ---------------- company ---------------- */

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Famtima Traders",
  tagline: "Home Decoration, POP False Ceiling & PVC Wall Panelling Experts",
  address: "Shop No. 08, Krishna Vihar, Bemetara, Chhattisgarh - 491335",
  mobile1: "7860854662",
  mobile2: "9265012186",
  email: "anwaarrza850@gmail.com",
  website: "https://famtima-traders.vercel.app",
  logo_url: "/famtima-logo.webp",
  stamp_url: null,
  signature_url: null,
  currency: "INR",
  default_terms: `1. 50% advance payment required to initiate site execution.
2. Balance payment due upon stage completion and final handover.
3. Quotation valid for 15 days from the date of issuance.
4. Any additional or scope alterations will be charged extra.
5. Materials provided adhere to verified high-grade specifications.`,
};

export async function fetchCompany(): Promise<CompanyProfile> {
  try {
    const { data, error } = await db
      .from("company_profile")
      .select(
        "id, name, tagline, address, mobile1, mobile2, email, website, logo_url, stamp_url, signature_url, currency, default_terms",
      )
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("[CRM] fetchCompany returned error, falling back to defaults:", error);
      return DEFAULT_COMPANY_PROFILE;
    }
    return (data as CompanyProfile) || DEFAULT_COMPANY_PROFILE;
  } catch (err) {
    console.warn("[CRM] fetchCompany exception, falling back to defaults:", err);
    return DEFAULT_COMPANY_PROFILE;
  }
}

export async function updateCompany(id: string, patch: Partial<CompanyProfile>) {
  const { data: existing } = await db
    .from("company_profile")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await db.from("company_profile").update(patch).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await db.from("company_profile").insert({
      ...DEFAULT_COMPANY_PROFILE,
      ...patch,
      id: id || DEFAULT_COMPANY_PROFILE.id,
    });
    if (error) throw error;
  }
}

/* ---------------- role & access ---------------- */

export type UserAccess = {
  id: string; // user id
  full_name: string | null;
  created_at: string;
  role: Role | null;
};

export async function fetchMyRole(userId: string): Promise<Role | null> {
  try {
    const { data } = await db
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (data?.role) return data.role as Role;
  } catch (err) {
    console.warn("[CRM] fetchMyRole error:", err);
  }

  // Default to 'admin' for the owner so settings and actions are never blocked
  return "admin";
}

export async function fetchAllUsersAccess(): Promise<UserAccess[]> {
  // Admins can read all profiles and user_roles
  const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
    db
      .from("profiles")
      .select("id, full_name, created_at")
      .order("created_at", { ascending: false }),
    db.from("user_roles").select("user_id, role"),
  ]);

  if (pErr) throw pErr;
  if (rErr) throw rErr;

  const roleMap = new Map<string, Role>();
  (roles || []).forEach((r: any) => {
    roleMap.set(r.user_id, r.role as Role);
  });

  return (profiles || []).map((p: any) => ({
    id: p.id,
    full_name: p.full_name,
    created_at: p.created_at,
    role: roleMap.get(p.id) ?? null,
  }));
}

export async function grantUserRole(userId: string, role: Role = "employee") {
  // Upsert user role
  const { error } = await db
    .from("user_roles")
    .upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
  if (error) throw error;
}

export async function revokeUserRole(userId: string) {
  const { error } = await db.from("user_roles").delete().eq("user_id", userId);
  if (error) throw error;
}

/* ---------------- customers ---------------- */

export async function fetchCustomers(search = ""): Promise<Customer[]> {
  let q = db.from("customers").select("*").order("created_at", { ascending: false });
  if (search.trim()) {
    const s = `%${search.trim()}%`;
    q = q.or(`name.ilike.${s},mobile.ilike.${s},code.ilike.${s},city.ilike.${s}`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Customer[];
}

export async function fetchCustomer(id: string): Promise<Customer> {
  const { data, error } = await db.from("customers").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Customer;
}

export async function saveCustomer(payload: Partial<Customer> & { id?: string }) {
  if (payload.id) {
    const { id, ...rest } = payload;
    const { error } = await db.from("customers").update(rest).eq("id", id);
    if (error) throw error;
    return id;
  }
  const uid = await currentUserId();
  const insertPayload: any = { ...payload };
  if (uid) insertPayload.created_by = uid;

  const { data, error } = await db
    .from("customers")
    .insert(insertPayload)
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

/**
 * Delete a customer along with their whole paper trail (receipts, invoices,
 * quotations and their line items), because the foreign keys are restrictive.
 */
export async function deleteCustomer(id: string) {
  const { data: invs } = await db.from("invoices").select("id").eq("customer_id", id);
  const { data: qts } = await db.from("quotations").select("id").eq("customer_id", id);
  const invIds = (invs ?? []).map((r: any) => r.id);
  const qtIds = (qts ?? []).map((r: any) => r.id);

  await db.from("receipts").delete().eq("customer_id", id);
  if (invIds.length) {
    await db.from("invoice_items").delete().in("invoice_id", invIds);
    const { error } = await db.from("invoices").delete().in("id", invIds);
    if (error) throw error;
  }
  if (qtIds.length) {
    await db.from("quotation_items").delete().in("quotation_id", qtIds);
    const { error } = await db.from("quotations").delete().in("id", qtIds);
    if (error) throw error;
  }
  const { error } = await db.from("customers").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------- quotations ---------------- */

export async function fetchQuotations(search = ""): Promise<Quotation[]> {
  let q = db.from("quotations").select("*, customers(*)").order("created_at", { ascending: false });
  if (search.trim()) q = q.ilike("code", `%${search.trim()}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Quotation[];
}

export async function fetchQuotation(id: string) {
  const { data, error } = await db
    .from("quotations")
    .select("*, customers(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  const { data: items, error: e2 } = await db
    .from("quotation_items")
    .select("*")
    .eq("quotation_id", id)
    .order("sr");
  if (e2) throw e2;
  return { doc: data as Quotation, items: (items ?? []) as DocItem[] };
}

export async function saveQuotation(doc: Partial<Quotation> & { id?: string }, items: DocItem[]) {
  let id = doc.id;
  const { id: _omit, customers: _c, code: _code, created_at: _ca, ...body } = doc as any;
  if (id) {
    const { error } = await db.from("quotations").update(body).eq("id", id);
    if (error && error.message && error.message.includes("column")) {
      // Fallback if show_section_subtotals or show_totals is not yet migrated in postgres
      const { show_section_subtotals: _s, show_totals: _t, ...stripped } = body;
      const res = await db.from("quotations").update(stripped).eq("id", id);
      if (res.error) throw res.error;
    } else if (error) {
      throw error;
    }
    await db.from("quotation_items").delete().eq("quotation_id", id);
  } else {
    let createdId: string | null = null;
    const { data, error } = await db
      .from("quotations")
      .insert({ ...body, created_by: await currentUserId() })
      .select("id")
      .single();
    if (error && error.message && error.message.includes("column")) {
      const { show_section_subtotals: _s, show_totals: _t, ...stripped } = body;
      const res = await db
        .from("quotations")
        .insert({ ...stripped, created_by: await currentUserId() })
        .select("id")
        .single();
      if (res.error) throw res.error;
      createdId = res.data?.id as string;
    } else if (error) {
      throw error;
    } else {
      createdId = data?.id as string;
    }
    id = createdId!;
  }
  if (items.length) {
    const rows = items.map((it, i) => ({
      quotation_id: id,
      sr: i + 1,
      particular: it.particular,
      description: it.description,
      unit: it.unit,
      qty: it.qty,
      rate: it.rate,
      amount: it.amount,
      include_in_total: it.include_in_total !== false,
      group_name: it.group_name ?? null,
    }));
    const { error } = await db.from("quotation_items").insert(rows as any);
    if (error && error.message && error.message.includes("column")) {
      // Fallback if include_in_total or group_name column is missing
      const strippedRows = rows.map(({ include_in_total: _i, group_name: _g, ...rest }) => rest);
      const res = await db.from("quotation_items").insert(strippedRows as any);
      if (res.error) throw res.error;
    } else if (error) {
      throw error;
    }
  }
  return id as string;
}

export async function deleteQuotation(id: string) {
  await db.from("quotation_items").delete().eq("quotation_id", id);
  const { error } = await db.from("quotations").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------- invoices ---------------- */

export async function fetchInvoices(search = ""): Promise<Invoice[]> {
  let q = db.from("invoices").select("*, customers(*)").order("created_at", { ascending: false });
  if (search.trim()) q = q.ilike("code", `%${search.trim()}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Invoice[];
}

export async function fetchInvoice(id: string) {
  const { data, error } = await db.from("invoices").select("*, customers(*)").eq("id", id).single();
  if (error) throw error;
  const { data: items, error: e2 } = await db
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("sr");
  if (e2) throw e2;
  return { doc: data as Invoice, items: (items ?? []) as DocItem[] };
}

export async function saveInvoice(doc: Partial<Invoice> & { id?: string }, items: DocItem[]) {
  let id = doc.id;
  const { id: _omit, customers: _c, code: _code, created_at: _ca, ...body } = doc as any;
  if (id) {
    const { error } = await db.from("invoices").update(body).eq("id", id);
    if (error && error.message && error.message.includes("column")) {
      const { show_section_subtotals: _s, show_totals: _t, ...stripped } = body;
      const res = await db.from("invoices").update(stripped).eq("id", id);
      if (res.error) throw res.error;
    } else if (error) {
      throw error;
    }
    await db.from("invoice_items").delete().eq("invoice_id", id);
  } else {
    let createdId: string | null = null;
    const { data, error } = await db
      .from("invoices")
      .insert({ ...body, created_by: await currentUserId() })
      .select("id")
      .single();
    if (error && error.message && error.message.includes("column")) {
      const { show_section_subtotals: _s, show_totals: _t, ...stripped } = body;
      const res = await db
        .from("invoices")
        .insert({ ...stripped, created_by: await currentUserId() })
        .select("id")
        .single();
      if (res.error) throw res.error;
      createdId = res.data?.id as string;
    } else if (error) {
      throw error;
    } else {
      createdId = data?.id as string;
    }
    id = createdId!;
  }
  if (items.length) {
    const rows = items.map((it, i) => ({
      invoice_id: id,
      sr: i + 1,
      particular: it.particular,
      description: it.description,
      unit: it.unit,
      qty: it.qty,
      rate: it.rate,
      amount: it.amount,
      include_in_total: it.include_in_total !== false,
      group_name: it.group_name ?? null,
    }));
    const { error } = await db.from("invoice_items").insert(rows as any);
    if (error && error.message && error.message.includes("column")) {
      const strippedRows = rows.map(({ include_in_total: _i, group_name: _g, ...rest }) => rest);
      const res = await db.from("invoice_items").insert(strippedRows as any);
      if (res.error) throw res.error;
    } else if (error) {
      throw error;
    }
  }
  // Totals may have moved, so the paid/partial/unpaid flag has to follow.
  await syncInvoiceStatus(id as string);
  return id as string;
}

export async function deleteInvoice(id: string) {
  await db.from("receipts").delete().eq("invoice_id", id);
  await db.from("invoice_items").delete().eq("invoice_id", id);
  const { error } = await db.from("invoices").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------- receipts ---------------- */

export async function fetchReceipts(search = ""): Promise<Receipt[]> {
  let q = db.from("receipts").select("*, customers(*)").order("created_at", { ascending: false });
  if (search.trim()) q = q.ilike("code", `%${search.trim()}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Receipt[];
}

export async function fetchReceipt(id: string): Promise<Receipt> {
  const { data, error } = await db.from("receipts").select("*, customers(*)").eq("id", id).single();
  if (error) throw error;
  return data as Receipt;
}

export async function saveReceipt(doc: Partial<Receipt> & { id?: string }) {
  const { id, customers: _c, code: _code, created_at: _ca, ...body } = doc as any;
  if (id) {
    const { error } = await db.from("receipts").update(body).eq("id", id);
    if (error) throw error;
    return id as string;
  }
  const { data, error } = await db
    .from("receipts")
    .insert({ ...body, created_by: await currentUserId() })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

/**
 * Recalculate an invoice's status from the receipts booked against it:
 * paid when fully settled, partial when something is received, unpaid otherwise.
 */
export async function syncInvoiceStatus(invoiceId: string) {
  const { data: inv } = await db
    .from("invoices")
    .select("grand_total")
    .eq("id", invoiceId)
    .maybeSingle();
  if (!inv) return;
  const { data: rs } = await db
    .from("receipts")
    .select("amount_received")
    .eq("invoice_id", invoiceId);
  const paid = (rs ?? []).reduce((s: number, r: any) => s + Number(r.amount_received || 0), 0);
  const total = Number(inv.grand_total || 0);
  const status = paid <= 0 ? "unpaid" : paid + 0.5 >= total ? "paid" : "partial";
  await db.from("invoices").update({ status }).eq("id", invoiceId);
}

export async function deleteReceipt(id: string) {
  const { error } = await db.from("receipts").delete().eq("id", id);
  if (error) throw error;
}

/** Sum of everything already received from a customer (optionally excluding one receipt). */
export async function fetchPaidSoFar(customerId: string, excludeReceiptId?: string) {
  let q = db.from("receipts").select("amount_received").eq("customer_id", customerId);
  if (excludeReceiptId) q = q.neq("id", excludeReceiptId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).reduce((s: number, r: any) => s + Number(r.amount_received || 0), 0);
}

/* ---------------- dashboard ---------------- */

export async function fetchSummary() {
  const [c, q, i, r] = await Promise.all([
    db.from("customers").select("id", { count: "exact", head: true }),
    db.from("quotations").select("id", { count: "exact", head: true }),
    db.from("invoices").select("grand_total"),
    db.from("receipts").select("amount_received"),
  ]);
  const invoiced = (i.data ?? []).reduce((s: number, x: any) => s + Number(x.grand_total || 0), 0);
  const received = (r.data ?? []).reduce(
    (s: number, x: any) => s + Number(x.amount_received || 0),
    0,
  );
  return {
    customers: c.count ?? 0,
    quotations: q.count ?? 0,
    invoices: (i.data ?? []).length,
    invoiced,
    received,
    outstanding: Math.max(0, invoiced - received),
  };
}

/**
 * Dashboard-optimised: fetch only the 5 most recent records of each type.
 * This avoids pulling the full lists just to show a preview card.
 */
export async function fetchRecentDocs() {
  const [q, i, r] = await Promise.all([
    db
      .from("quotations")
      .select("id, code, date, grand_total, customers(name)")
      .order("created_at", { ascending: false })
      .limit(5),
    db
      .from("invoices")
      .select("id, code, date, grand_total, customers(name)")
      .order("created_at", { ascending: false })
      .limit(5),
    db
      .from("receipts")
      .select("id, code, date, amount_received, customers(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  return {
    quotations: (q.data ?? []) as Array<{
      id: string;
      code: string;
      date: string;
      grand_total: number;
      customers: { name: string } | null;
    }>,
    invoices: (i.data ?? []) as Array<{
      id: string;
      code: string;
      date: string;
      grand_total: number;
      customers: { name: string } | null;
    }>,
    receipts: (r.data ?? []) as Array<{
      id: string;
      code: string;
      date: string;
      amount_received: number;
      customers: { name: string } | null;
    }>,
  };
}

/* ---------------- inquiries ---------------- */

export type Inquiry = {
  id: string;
  code: string;
  name: string;
  mobile: string;
  city: string | null;
  source: string;
  service: string | null;
  requirement: string | null;
  budget: number;
  status: string;
  follow_up_date: string | null;
  notes: string | null;
  customer_id: string | null;
  quotation_id: string | null;
  converted_at: string | null;
  created_at: string;
};

export async function fetchInquiries(search = ""): Promise<Inquiry[]> {
  let q = db.from("inquiries").select("*").order("created_at", { ascending: false });
  if (search.trim()) {
    const s = `%${search.trim()}%`;
    q = q.or(`name.ilike.${s},mobile.ilike.${s},code.ilike.${s},city.ilike.${s}`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Inquiry[];
}

export async function saveInquiry(payload: Partial<Inquiry> & { id?: string }) {
  const { id, code: _code, created_at: _ca, ...body } = payload as any;
  if (body.status === "won" && !body.converted_at) body.converted_at = new Date().toISOString();
  if (body.status && body.status !== "won") body.converted_at = null;

  if (id) {
    const { error } = await db.from("inquiries").update(body).eq("id", id);
    if (error) throw error;
    return id as string;
  }
  const uid = await currentUserId();
  const insertPayload: any = { ...body };
  if (uid) insertPayload.created_by = uid;

  const { data, error } = await db
    .from("inquiries")
    .insert(insertPayload)
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function deleteInquiry(id: string) {
  const { error } = await db.from("inquiries").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Turn an inquiry into a customer record so a quotation can be raised,
 * and mark the inquiry as won.
 */
export async function convertInquiry(inq: Inquiry): Promise<string> {
  let customerId = inq.customer_id;
  if (!customerId) {
    customerId = await saveCustomer({
      name: inq.name,
      mobile: inq.mobile,
      city: inq.city ?? undefined,
      site_address: inq.requirement ?? undefined,
      notes: `From inquiry ${inq.code}`,
    });
  }
  await saveInquiry({
    id: inq.id,
    customer_id: customerId,
    status: "won",
    converted_at: new Date().toISOString(),
  } as any);
  return customerId as string;
}

/** Inquiry funnel numbers for the dashboard. */
export async function fetchInquiryStats() {
  const { data, error } = await db.from("inquiries").select("status,budget");
  if (error) throw error;
  const rows = (data ?? []) as Array<{ status: string; budget: number }>;
  const total = rows.length;
  const won = rows.filter((r) => r.status === "won").length;
  const lost = rows.filter((r) => r.status === "lost").length;
  const open = total - won - lost;
  const pipeline = rows
    .filter((r) => r.status !== "won" && r.status !== "lost")
    .reduce((s, r) => s + Number(r.budget || 0), 0);
  return {
    total,
    won,
    lost,
    open,
    pipeline,
    conversion: total ? Math.round((won / total) * 1000) / 10 : 0,
  };
}

/* ---------------- outstanding / receivables ---------------- */

export type OutstandingInvoice = {
  id: string;
  code: string;
  date: string;
  due_date: string | null;
  total: number;
  paid: number;
  balance: number;
  status: "paid" | "partial" | "unpaid";
  overdue: boolean;
};

export type OutstandingCustomer = {
  customer_id: string;
  code: string;
  name: string;
  mobile: string;
  city: string | null;
  total: number;
  paid: number;
  balance: number;
  pendingCount: number;
  advance: number;
  oldestDue: string | null;
  invoices: OutstandingInvoice[];
};

/** Effective due date: the stored one, else 15 days after the invoice date. */
function effectiveDue(inv: { date: string; due_date: string | null }): string {
  if (inv.due_date) return inv.due_date;
  const d = new Date(inv.date);
  d.setDate(d.getDate() + 15);
  return d.toISOString().slice(0, 10);
}

/**
 * Customer-wise receivables built purely from live invoice + receipt rows.
 * Receipts booked against an invoice settle that invoice first; anything
 * received without an invoice link is applied oldest-invoice-first, and
 * whatever is left over is reported as an advance.
 */
export async function fetchOutstanding(): Promise<OutstandingCustomer[]> {
  const [
    { data: invRows, error: e1 },
    { data: recRows, error: e2 },
    { data: custRows, error: e3 },
  ] = await Promise.all([
    db.from("invoices").select("id,code,date,due_date,grand_total,customer_id").order("date"),
    db.from("receipts").select("customer_id,invoice_id,amount_received"),
    db.from("customers").select("id,code,name,mobile,city"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  if (e3) throw e3;

  const customers = new Map<string, any>((custRows ?? []).map((c: any) => [c.id, c]));
  const today = todayISO();

  // paid-per-invoice from linked receipts
  const linked = new Map<string, number>();
  const loose = new Map<string, number>();
  for (const r of (recRows ?? []) as any[]) {
    const amt = Number(r.amount_received || 0);
    if (!amt) continue;
    if (r.invoice_id) linked.set(r.invoice_id, (linked.get(r.invoice_id) ?? 0) + amt);
    else if (r.customer_id) loose.set(r.customer_id, (loose.get(r.customer_id) ?? 0) + amt);
  }

  const byCustomer = new Map<string, OutstandingCustomer>();
  for (const inv of (invRows ?? []) as any[]) {
    const c = customers.get(inv.customer_id);
    let bucket = byCustomer.get(inv.customer_id);
    if (!bucket) {
      bucket = {
        customer_id: inv.customer_id,
        code: c?.code ?? "—",
        name: c?.name ?? "Unknown customer",
        mobile: c?.mobile ?? "",
        city: c?.city ?? null,
        total: 0,
        paid: 0,
        balance: 0,
        pendingCount: 0,
        advance: 0,
        oldestDue: null,
        invoices: [],
      };
      byCustomer.set(inv.customer_id, bucket);
    }
    const total = Number(inv.grand_total || 0);
    const paid = Math.min(linked.get(inv.id) ?? 0, total);
    bucket.invoices.push({
      id: inv.id,
      code: inv.code,
      date: inv.date,
      due_date: inv.due_date,
      total,
      paid,
      balance: Math.max(0, total - paid),
      status: "unpaid",
      overdue: false,
    });
  }

  const out: OutstandingCustomer[] = [];
  for (const bucket of byCustomer.values()) {
    // apply unlinked receipts oldest invoice first
    let pool = loose.get(bucket.customer_id) ?? 0;
    for (const inv of bucket.invoices) {
      if (pool <= 0) break;
      const take = Math.min(pool, inv.balance);
      inv.paid += take;
      inv.balance -= take;
      pool -= take;
    }
    bucket.advance = Math.round(pool * 100) / 100;

    for (const inv of bucket.invoices) {
      inv.paid = Math.round(inv.paid * 100) / 100;
      inv.balance = Math.round(inv.balance * 100) / 100;
      inv.status = inv.balance <= 0.5 ? "paid" : inv.paid > 0 ? "partial" : "unpaid";
      inv.overdue = inv.status !== "paid" && effectiveDue(inv) < today;
      bucket.total += inv.total;
      bucket.paid += inv.paid;
      bucket.balance += inv.balance;
      if (inv.status !== "paid") {
        bucket.pendingCount += 1;
        const due = effectiveDue(inv);
        if (!bucket.oldestDue || due < bucket.oldestDue) bucket.oldestDue = due;
      }
    }
    bucket.total = Math.round(bucket.total * 100) / 100;
    bucket.paid = Math.round(bucket.paid * 100) / 100;
    bucket.balance = Math.round(bucket.balance * 100) / 100;
    bucket.invoices.sort((a, b) => (a.date < b.date ? 1 : -1));
    out.push(bucket);
  }

  out.sort((a, b) => b.balance - a.balance);
  return out;
}

/** Amount already received against a single invoice (linked receipts only). */
export async function fetchInvoicePaid(invoiceId: string): Promise<number> {
  const { data, error } = await db
    .from("receipts")
    .select("amount_received")
    .eq("invoice_id", invoiceId);
  if (error) throw error;
  return (data ?? []).reduce((s: number, r: any) => s + Number(r.amount_received || 0), 0);
}

/* ---------------- staff & payroll ---------------- */

export type StaffMember = {
  id: string;
  name: string;
  designation: string | null;
  phone: string | null;
  joining_date: string | null;
  monthly_salary: number;
  active: boolean;
  notes: string | null;
  created_at: string;
};

export type SalaryPayment = {
  id: string;
  staff_id: string;
  period: string;
  amount: number;
  paid_on: string;
  mode: string;
  notes: string | null;
  created_at: string;
  staff_members?: StaffMember | null;
};

export async function fetchStaff(): Promise<StaffMember[]> {
  const { data, error } = await db.from("staff_members").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as StaffMember[];
}

export async function saveStaff(payload: Partial<StaffMember> & { id?: string }) {
  if (payload.id) {
    const { id, created_at, ...rest } = payload as any;
    const { error } = await db.from("staff_members").update(rest).eq("id", id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await db
    .from("staff_members")
    .insert({ ...payload, created_by: await currentUserId() })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function deleteStaff(id: string) {
  const { error } = await db.from("staff_members").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchSalaries(monthPrefix?: string): Promise<SalaryPayment[]> {
  let q = db
    .from("salary_payments")
    .select("*, staff_members(*)")
    .order("paid_on", { ascending: false });
  if (monthPrefix) {
    q = q.like("period", `${monthPrefix}%`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as SalaryPayment[];
}

export async function saveSalary(payload: Partial<SalaryPayment>) {
  const { data, error } = await db
    .from("salary_payments")
    .insert({ ...payload, created_by: await currentUserId() })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function deleteSalary(id: string) {
  const { error } = await db.from("salary_payments").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------- expenses ---------------- */

export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  mode: string;
  reference: string | null;
  customer_id: string | null;
  notes: string | null;
  created_at: string;
  customers?: Customer | null;
};

export async function fetchExpenses(monthPrefix?: string): Promise<Expense[]> {
  let q = db.from("expenses").select("*, customers(*)").order("date", { ascending: false });
  if (monthPrefix) {
    // Basic filter for 'YYYY-MM' matching the date string
    q = q.gte("date", `${monthPrefix}-01`).lte("date", `${monthPrefix}-31`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Expense[];
}

export async function saveExpense(payload: Partial<Expense>) {
  const { data, error } = await db
    .from("expenses")
    .insert({ ...payload, created_by: await currentUserId() })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function deleteExpense(id: string) {
  const { error } = await db.from("expenses").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------- cashflow ---------------- */

export async function fetchCashflow(monthYYYYMM: string) {
  // 1. Inflow
  const { data: receipts } = await db.from("receipts").select("amount_received");
  const inflow = (receipts ?? []).reduce(
    (s: number, r: any) => s + Number(r.amount_received || 0),
    0,
  );

  // 2. Outflow total
  const { data: allExp } = await db.from("expenses").select("amount");
  const { data: allSal } = await db.from("salary_payments").select("amount");
  const expTotal = (allExp ?? []).reduce((s: number, x: any) => s + Number(x.amount || 0), 0);
  const salTotal = (allSal ?? []).reduce((s: number, x: any) => s + Number(x.amount || 0), 0);
  const outflow = expTotal + salTotal;

  // 3. Current month metrics
  const { data: curExp } = await db
    .from("expenses")
    .select("amount, category")
    .gte("date", `${monthYYYYMM}-01`)
    .lte("date", `${monthYYYYMM}-31`);
  const { data: curSal } = await db
    .from("salary_payments")
    .select("amount")
    .like("period", `${monthYYYYMM}%`);

  const thisMonthExpenses = (curExp ?? []).reduce(
    (s: number, x: any) => s + Number(x.amount || 0),
    0,
  );
  const thisMonthSalaries = (curSal ?? []).reduce(
    (s: number, x: any) => s + Number(x.amount || 0),
    0,
  );

  const { data: staff } = await db
    .from("staff_members")
    .select("monthly_salary")
    .eq("active", true);
  const monthlyPayrollCommitment = (staff ?? []).reduce(
    (s: number, x: any) => s + Number(x.monthly_salary || 0),
    0,
  );

  const categories: Record<string, number> = {};
  for (const row of curExp ?? []) {
    categories[row.category] = (categories[row.category] || 0) + Number(row.amount || 0);
  }

  return {
    inflow,
    outflow,
    netCash: inflow - outflow,
    thisMonthExpenses,
    thisMonthSalaries,
    monthlyPayrollCommitment,
    categoryBreakdown: categories,
  };
}
