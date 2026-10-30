-- =============================================================================
-- OWAIS INTERIOR DESIGNER — RESTORATION SCRIPT FOR SUPABASE
-- =============================================================================
-- Use this script in your OWAIS TRADERS Supabase Project SQL Editor to restore
-- the original business details, branding, contact info, and addresses.
--
-- NOTE: Your existing customers, quotations, invoices, and receipts were NOT deleted!
-- Running this will restore your company profile and branding back to Owais Designer.
-- =============================================================================

-- 1. Restore Company Profile for Owais Interior Designer
UPDATE public.company_profile
SET
  name = 'Owais Interior Designer',
  tagline = 'Turning your space into elegant design',
  address = 'Rahmat Nagar, Wadala, Nashik, Maharashtra',
  mobile1 = '7756043214',
  mobile2 = '7721926290',
  email = 'onlyw6469@gmail.com',
  website = 'https://owais-interior-designer.vercel.app',
  logo_url = '/owais-logo.png',
  currency = 'INR',
  default_terms = '1. 50% advance payment required to start the work.
2. Balance payment due on completion of work.
3. Quotation valid for 15 days from the date of issue.
4. Any additional work will be charged extra.
5. Material rates are subject to change without prior notice.',
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000001'
   OR name ILIKE '%famtima%';

-- If no row exists, insert the default Owais Interior Designer profile
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
  'Owais Interior Designer',
  'Turning your space into elegant design',
  'Rahmat Nagar, Wadala, Nashik, Maharashtra',
  '7756043214',
  '7721926290',
  'onlyw6469@gmail.com',
  'https://owais-interior-designer.vercel.app',
  '/owais-logo.png',
  'INR',
  '1. 50% advance payment required to start the work.
2. Balance payment due on completion of work.
3. Quotation valid for 15 days from the date of issue.
4. Any additional work will be charged extra.
5. Material rates are subject to change without prior notice.'
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

-- 2. Verify restored profile
SELECT id, name, address, mobile1, email, logo_url FROM public.company_profile;
