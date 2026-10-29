-- =============================================================================
-- FAMTIMA TRADERS — COMPLETE ALL-IN-ONE SUPABASE DATABASE SETUP
-- =============================================================================
-- Location: Bemetara, Chhattisgarh
-- Owner: Anwar Khan
-- Contact: +91 7860854662 / +91 9265012186
-- Email: anwaarrza850@gmail.com
--

-- INSTRUCTIONS:
-- 1. Create a new project in your Supabase dashboard (https://supabase.com).
-- 2. Open the SQL Editor in your Supabase dashboard.
-- 3. Copy and paste this entire script and click "RUN".
-- 4. When the first user registers, they are automatically granted the 'admin' role!
-- =============================================================================

-- PART 1: CORE SCHEMA & TABLES
CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN (SELECT count(*) FROM public.user_roles WHERE role = 'admin') = 0 THEN 'admin'::public.app_role ELSE 'employee'::public.app_role END)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.company_profile (
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
GRANT SELECT, INSERT, UPDATE ON public.company_profile TO authenticated;
GRANT ALL ON public.company_profile TO service_role;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all read company" ON public.company_profile FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin update company" ON public.company_profile FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin insert company" ON public.company_profile FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
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

CREATE SEQUENCE public.customer_seq START 1;
CREATE SEQUENCE public.quotation_seq START 1;
CREATE SEQUENCE public.invoice_seq START 1;
CREATE SEQUENCE public.receipt_seq START 1;

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

CREATE TABLE public.customers (
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
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update customers" ON public.customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "admin delete customers" ON public.customers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.quotations (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotations TO authenticated;
GRANT ALL ON public.quotations TO service_role;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read quotations" ON public.quotations FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert quotations" ON public.quotations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update quotations" ON public.quotations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "admin delete quotations" ON public.quotations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER quotations_updated BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.quotation_items (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotation_items TO authenticated;
GRANT ALL ON public.quotation_items TO service_role;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage quotation items" ON public.quotation_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.invoices (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read invoices" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update invoices" ON public.invoices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "admin delete invoices" ON public.invoices FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.invoice_items (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage invoice items" ON public.invoice_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.receipts (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receipts TO authenticated;
GRANT ALL ON public.receipts TO service_role;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read receipts" ON public.receipts FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert receipts" ON public.receipts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update receipts" ON public.receipts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "admin delete receipts" ON public.receipts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER receipts_updated BEFORE UPDATE ON public.receipts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PART 2: ROLE-BASED ACCESS CONTROL (STAFF & ADMIN)
-- Staff helper (admin or employee)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;

-- Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- CUSTOMERS
DROP POLICY IF EXISTS "read customers" ON public.customers;
DROP POLICY IF EXISTS "insert customers" ON public.customers;
DROP POLICY IF EXISTS "update customers" ON public.customers;
CREATE POLICY "staff read customers" ON public.customers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "staff update customers" ON public.customers FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- QUOTATIONS
DROP POLICY IF EXISTS "read quotations" ON public.quotations;
DROP POLICY IF EXISTS "insert quotations" ON public.quotations;
DROP POLICY IF EXISTS "update quotations" ON public.quotations;
CREATE POLICY "staff read quotations" ON public.quotations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert quotations" ON public.quotations FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "staff update quotations" ON public.quotations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- INVOICES
DROP POLICY IF EXISTS "read invoices" ON public.invoices;
DROP POLICY IF EXISTS "insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "update invoices" ON public.invoices;
CREATE POLICY "staff read invoices" ON public.invoices FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "staff update invoices" ON public.invoices FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- RECEIPTS
DROP POLICY IF EXISTS "read receipts" ON public.receipts;
DROP POLICY IF EXISTS "insert receipts" ON public.receipts;
DROP POLICY IF EXISTS "update receipts" ON public.receipts;
CREATE POLICY "staff read receipts" ON public.receipts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert receipts" ON public.receipts FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "staff update receipts" ON public.receipts FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- QUOTATION ITEMS
DROP POLICY IF EXISTS "manage quotation items" ON public.quotation_items;
CREATE POLICY "staff manage quotation items" ON public.quotation_items FOR ALL TO authenticated
USING (public.is_staff(auth.uid()) AND EXISTS (SELECT 1 FROM public.quotations q WHERE q.id = quotation_id))
WITH CHECK (public.is_staff(auth.uid()) AND EXISTS (SELECT 1 FROM public.quotations q WHERE q.id = quotation_id));

-- INVOICE ITEMS
DROP POLICY IF EXISTS "manage invoice items" ON public.invoice_items;
CREATE POLICY "staff manage invoice items" ON public.invoice_items FOR ALL TO authenticated
USING (public.is_staff(auth.uid()) AND EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id))
WITH CHECK (public.is_staff(auth.uid()) AND EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id));

-- COMPANY PROFILE
DROP POLICY IF EXISTS "all read company" ON public.company_profile;
CREATE POLICY "staff read company" ON public.company_profile FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- PROFILES
DROP POLICY IF EXISTS "read profiles" ON public.profiles;
CREATE POLICY "read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- PART 3: FIRST USER ADMIN BOOTSTRAP TRIGGER

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  -- Only the very first account is bootstrapped as admin.
  -- All other accounts get NO role: an admin must grant access explicitly.
  IF (SELECT count(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END; $function$;

-- Admin-managed role assignment
DROP POLICY IF EXISTS "admins insert roles" ON public.user_roles;
CREATE POLICY "admins insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins update roles" ON public.user_roles;
CREATE POLICY "admins update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins delete roles" ON public.user_roles;
CREATE POLICY "admins delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role) AND user_id <> auth.uid());

GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

-- Profiles: allow a user to create only their own profile row
DROP POLICY IF EXISTS "insert own profile" ON public.profiles;
CREATE POLICY "insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
GRANT INSERT ON public.profiles TO authenticated;


-- PART 4: LEAD INQUIRIES PIPELINE
CREATE SEQUENCE IF NOT EXISTS public.inquiry_seq START 1;

CREATE TABLE public.inquiries (
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

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
GRANT USAGE ON SEQUENCE public.inquiry_seq TO authenticated, service_role;

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff read inquiries" ON public.inquiries FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert inquiries" ON public.inquiries FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "staff update inquiries" ON public.inquiries FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "admin delete inquiries" ON public.inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER inquiries_updated BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PART 5: EXPENSES, PAYROLL & CUSTOMER ARCHIVING
-- ==============================================================================
-- CUSTOMER ARCHIVE & PAYROLL/EXPENSES RLS ENFORCEMENT
-- Migration: 20261014130000_expenses_payroll_and_customer_archive.sql
-- ==============================================================================

-- 1. Add customer archive column to prevent deletion of historical financial facts
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;

-- 2. Staff members table
CREATE TABLE IF NOT EXISTS public.staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT,
    phone TEXT,
    joining_date DATE,
    monthly_salary NUMERIC NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Salary payments table
CREATE TABLE IF NOT EXISTS public.salary_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.staff_members(id) ON DELETE RESTRICT,
    period TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    paid_on DATE NOT NULL,
    mode TEXT NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Operational expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    mode TEXT NOT NULL,
    reference TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 6. Grants & Least-Privilege Policies (Admin-only for salaries, payroll and company expenses)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.salary_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;

DROP POLICY IF EXISTS "Admin can manage staff_members" ON public.staff_members;
DROP POLICY IF EXISTS "admin manage staff_members" ON public.staff_members;
CREATE POLICY "admin manage staff_members" ON public.staff_members
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admin can manage salary_payments" ON public.salary_payments;
DROP POLICY IF EXISTS "admin manage salary_payments" ON public.salary_payments;
CREATE POLICY "admin manage salary_payments" ON public.salary_payments
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admin can manage expenses" ON public.expenses;
DROP POLICY IF EXISTS "admin manage expenses" ON public.expenses;
CREATE POLICY "admin manage expenses" ON public.expenses
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


-- PART 6: STORAGE BUCKET FOR COMPANY ASSETS & SIGNATURES
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Company Assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-assets');

CREATE POLICY "Authenticated Staff Upload Company Assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets' AND public.is_staff(auth.uid()));

CREATE POLICY "Authenticated Staff Update Company Assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'company-assets' AND public.is_staff(auth.uid()));
