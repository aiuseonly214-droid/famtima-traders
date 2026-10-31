-- =============================================================================
-- FAMTIMA TRADERS — COMPLETE ALL-IN-ONE SUPABASE DATABASE SETUP (IDEMPOTENT / RE-RUNNABLE)
-- =============================================================================
-- Location: Bemetara, Chhattisgarh
-- Owner: Anwar Khan
-- Contact: +91 7860854662 / +91 9265012186
-- Email: anwaarrza850@gmail.com
--
-- INSTRUCTIONS:
-- 1. Open the SQL Editor in your Supabase dashboard (https://supabase.com).
-- 2. Paste this entire script and click "Run".
-- 3. You can safely run this script multiple times without any "already exists" errors.
-- 4. Automatically assigns 'admin' role to all current and future accounts!
-- =============================================================================

-- PART 1: CORE SCHEMA & TYPES (IDEMPOTENT)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'employee');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated, anon, service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id IS NOT NULL;
$$;

DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins update roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "authenticated all user_roles" ON public.user_roles;
CREATE POLICY "authenticated all user_roles" ON public.user_roles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated, anon, service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read profiles" ON public.profiles;
DROP POLICY IF EXISTS "update own profile" ON public.profiles;
DROP POLICY IF EXISTS "read own profile" ON public.profiles;
DROP POLICY IF EXISTS "insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "authenticated all profiles" ON public.profiles;
CREATE POLICY "authenticated all profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger to automatically create profile and assign 'admin' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill all existing users in auth.users so their profiles and admin roles exist right now
INSERT INTO public.profiles (id, full_name)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE IF NOT EXISTS public.company_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Famtima Traders',
  tagline text NOT NULL DEFAULT 'Home Decoration, POP False Ceiling & PVC Wall Panelling Experts',
  address text NOT NULL DEFAULT 'Shop No. 08, Krishna Vihar, Bemetara, Chhattisgarh - 491335',
  mobile1 text NOT NULL DEFAULT '7860854662',
  mobile2 text DEFAULT '9265012186',
  email text NOT NULL DEFAULT 'anwaarrza850@gmail.com',
  website text,
  logo_url text,
  stamp_url text,
  signature_url text,
  currency text NOT NULL DEFAULT 'INR',
  default_terms text NOT NULL DEFAULT '1. 50% advance payment required to start the work.
2. Balance payment due on completion of work.
3. Quotation valid for 15 days from the date of issue.
4. Any additional work will be charged extra.
5. Material rates are subject to change without prior notice.',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_profile TO authenticated, anon, service_role;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "all read company" ON public.company_profile;
DROP POLICY IF EXISTS "admin update company" ON public.company_profile;
DROP POLICY IF EXISTS "admin insert company" ON public.company_profile;
DROP POLICY IF EXISTS "staff read company" ON public.company_profile;
DROP POLICY IF EXISTS "public read company" ON public.company_profile;
DROP POLICY IF EXISTS "authenticated all company" ON public.company_profile;

CREATE POLICY "public read company" ON public.company_profile FOR SELECT TO public USING (true);
CREATE POLICY "authenticated all company" ON public.company_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS company_updated ON public.company_profile;
CREATE TRIGGER company_updated BEFORE UPDATE ON public.company_profile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.company_profile (
  id,
  name,
  tagline,
  address,
  mobile1,
  mobile2,
  email,
  website,
  logo_url,
  currency,
  default_terms
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Famtima Traders',
  'Home Decoration, POP False Ceiling & PVC Wall Panelling Experts',
  'Shop No. 08, Krishna Vihar, Bemetara, Chhattisgarh - 491335',
  '7860854662',
  '9265012186',
  'anwaarrza850@gmail.com',
  'https://famtima-traders.vercel.app',
  '/famtima-logo.webp',
  'INR',
  '1. 50% advance payment required to initiate site execution.
2. Balance payment due upon stage completion and final handover.
3. Quotation valid for 15 days from the date of issuance.
4. Any additional or scope alterations will be charged extra.
5. Materials provided adhere to verified high-grade specifications.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  address = EXCLUDED.address,
  mobile1 = EXCLUDED.mobile1,
  mobile2 = EXCLUDED.mobile2,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  logo_url = EXCLUDED.logo_url,
  currency = EXCLUDED.currency,
  default_terms = EXCLUDED.default_terms,
  updated_at = now();

CREATE SEQUENCE IF NOT EXISTS public.customer_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.quotation_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.invoice_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.receipt_seq START 1;

CREATE OR REPLACE FUNCTION public.next_code(_prefix text, _seq text, _with_year boolean)
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
DECLARE n bigint;
BEGIN
  n := nextval(_seq);
  IF _with_year THEN
    RETURN _prefix || '-' || to_char(now(), 'YYYY') || '-' || lpad(n::text, 4, '0');
  END IF;
  RETURN _prefix || '-' || lpad(n::text, 4, '0');
END; $$;

CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT public.next_code('CUS', 'public.customer_seq', false),
  name text NOT NULL,
  mobile text NOT NULL,
  alt_mobile text,
  email text,
  site_address text,
  billing_address text,
  city text,
  notes text,
  is_archived boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated, anon, service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read customers" ON public.customers;
DROP POLICY IF EXISTS "insert customers" ON public.customers;
DROP POLICY IF EXISTS "update customers" ON public.customers;
DROP POLICY IF EXISTS "admin delete customers" ON public.customers;
DROP POLICY IF EXISTS "staff read customers" ON public.customers;
DROP POLICY IF EXISTS "staff insert customers" ON public.customers;
DROP POLICY IF EXISTS "staff update customers" ON public.customers;
DROP POLICY IF EXISTS "authenticated all customers" ON public.customers;
DROP POLICY IF EXISTS "public all customers" ON public.customers;
CREATE POLICY "public all customers" ON public.customers FOR ALL TO public USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS customers_updated ON public.customers;
CREATE TRIGGER customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT public.next_code('QT', 'public.quotation_seq', true),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  date date NOT NULL DEFAULT current_date,
  valid_till date,
  subject text,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  discount numeric(14,2) NOT NULL DEFAULT 0,
  grand_total numeric(14,2) NOT NULL DEFAULT 0,
  amount_words text,
  terms text,
  status text NOT NULL DEFAULT 'draft',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotations TO authenticated, anon, service_role;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read quotations" ON public.quotations;
DROP POLICY IF EXISTS "insert quotations" ON public.quotations;
DROP POLICY IF EXISTS "update quotations" ON public.quotations;
DROP POLICY IF EXISTS "admin delete quotations" ON public.quotations;
DROP POLICY IF EXISTS "staff read quotations" ON public.quotations;
DROP POLICY IF EXISTS "staff insert quotations" ON public.quotations;
DROP POLICY IF EXISTS "staff update quotations" ON public.quotations;
DROP POLICY IF EXISTS "authenticated all quotations" ON public.quotations;
CREATE POLICY "authenticated all quotations" ON public.quotations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS quotations_updated ON public.quotations;
CREATE TRIGGER quotations_updated BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  sr integer NOT NULL DEFAULT 1,
  particular text NOT NULL DEFAULT '',
  description text,
  unit text,
  qty numeric(12,2) NOT NULL DEFAULT 1,
  rate numeric(14,2) NOT NULL DEFAULT 0,
  amount numeric(14,2) NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotation_items TO authenticated, anon, service_role;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "manage quotation items" ON public.quotation_items;
DROP POLICY IF EXISTS "staff manage quotation items" ON public.quotation_items;
DROP POLICY IF EXISTS "authenticated all quotation_items" ON public.quotation_items;
CREATE POLICY "authenticated all quotation_items" ON public.quotation_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT public.next_code('INV', 'public.invoice_seq', true),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT current_date,
  due_date date,
  subject text,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  discount numeric(14,2) NOT NULL DEFAULT 0,
  grand_total numeric(14,2) NOT NULL DEFAULT 0,
  amount_words text,
  terms text,
  status text NOT NULL DEFAULT 'unpaid',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated, anon, service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read invoices" ON public.invoices;
DROP POLICY IF EXISTS "insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "update invoices" ON public.invoices;
DROP POLICY IF EXISTS "admin delete invoices" ON public.invoices;
DROP POLICY IF EXISTS "staff read invoices" ON public.invoices;
DROP POLICY IF EXISTS "staff insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "staff update invoices" ON public.invoices;
DROP POLICY IF EXISTS "authenticated all invoices" ON public.invoices;
CREATE POLICY "authenticated all invoices" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS invoices_updated ON public.invoices;
CREATE TRIGGER invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  sr integer NOT NULL DEFAULT 1,
  particular text NOT NULL DEFAULT '',
  description text,
  unit text,
  qty numeric(12,2) NOT NULL DEFAULT 1,
  rate numeric(14,2) NOT NULL DEFAULT 0,
  amount numeric(14,2) NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated, anon, service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "manage invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "staff manage invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "authenticated all invoice_items" ON public.invoice_items;
CREATE POLICY "authenticated all invoice_items" ON public.invoice_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT public.next_code('RC', 'public.receipt_seq', true),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT current_date,
  total_amount numeric(14,2) NOT NULL DEFAULT 0,
  previous_paid numeric(14,2) NOT NULL DEFAULT 0,
  amount_received numeric(14,2) NOT NULL DEFAULT 0,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  mode text NOT NULL DEFAULT 'cash',
  txn_id text,
  amount_words text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receipts TO authenticated, anon, service_role;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read receipts" ON public.receipts;
DROP POLICY IF EXISTS "insert receipts" ON public.receipts;
DROP POLICY IF EXISTS "update receipts" ON public.receipts;
DROP POLICY IF EXISTS "admin delete receipts" ON public.receipts;
DROP POLICY IF EXISTS "staff read receipts" ON public.receipts;
DROP POLICY IF EXISTS "staff insert receipts" ON public.receipts;
DROP POLICY IF EXISTS "staff update receipts" ON public.receipts;
DROP POLICY IF EXISTS "authenticated all receipts" ON public.receipts;
CREATE POLICY "authenticated all receipts" ON public.receipts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS receipts_updated ON public.receipts;
CREATE TRIGGER receipts_updated BEFORE UPDATE ON public.receipts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PART 2: LEAD INQUIRIES PIPELINE
CREATE SEQUENCE IF NOT EXISTS public.inquiry_seq START 1;

CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL DEFAULT public.next_code('INQ', 'public.inquiry_seq', false),
  name text NOT NULL,
  mobile text NOT NULL,
  city text,
  source text NOT NULL DEFAULT 'walk_in',
  service text,
  requirement text,
  budget numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  follow_up_date date,
  notes text,
  customer_id uuid REFERENCES public.customers(id),
  quotation_id uuid REFERENCES public.quotations(id),
  converted_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated, anon, service_role;
GRANT USAGE ON SEQUENCE public.inquiry_seq TO authenticated, anon, service_role;

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff read inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "staff insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "staff update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "admin delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "authenticated all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "anon insert inquiries" ON public.inquiries;

-- Authenticated team members can perform all operations on inquiries
DROP POLICY IF EXISTS "public all inquiries" ON public.inquiries;
CREATE POLICY "public all inquiries" ON public.inquiries FOR ALL TO public USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS inquiries_updated ON public.inquiries;
CREATE TRIGGER inquiries_updated BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PART 3: EXPENSES, PAYROLL & STAFF
CREATE TABLE IF NOT EXISTS public.staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT,
    phone TEXT,
    joining_date DATE,
    monthly_salary NUMERIC NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.salary_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.staff_members(id) ON DELETE RESTRICT,
    period TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    paid_on DATE NOT NULL,
    mode TEXT NOT NULL,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    mode TEXT NOT NULL,
    reference TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_members TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.salary_payments TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated, anon, service_role;

DROP POLICY IF EXISTS "Admin can manage staff_members" ON public.staff_members;
DROP POLICY IF EXISTS "admin manage staff_members" ON public.staff_members;
DROP POLICY IF EXISTS "authenticated all staff_members" ON public.staff_members;
CREATE POLICY "authenticated all staff_members" ON public.staff_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage salary_payments" ON public.salary_payments;
DROP POLICY IF EXISTS "admin manage salary_payments" ON public.salary_payments;
DROP POLICY IF EXISTS "authenticated all salary_payments" ON public.salary_payments;
CREATE POLICY "authenticated all salary_payments" ON public.salary_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage expenses" ON public.expenses;
DROP POLICY IF EXISTS "admin manage expenses" ON public.expenses;
DROP POLICY IF EXISTS "authenticated all expenses" ON public.expenses;
CREATE POLICY "authenticated all expenses" ON public.expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PART 4: STORAGE BUCKET FOR COMPANY ASSETS & SIGNATURES
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Company Assets" ON storage.objects;
CREATE POLICY "Public Read Company Assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-assets');

DROP POLICY IF EXISTS "Authenticated Staff Upload Company Assets" ON storage.objects;
CREATE POLICY "Authenticated Staff Upload Company Assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets');

DROP POLICY IF EXISTS "Authenticated Staff Update Company Assets" ON storage.objects;
CREATE POLICY "Authenticated Staff Update Company Assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'company-assets');
