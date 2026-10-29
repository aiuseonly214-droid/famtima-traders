# Famtima Traders CRM & Public Platform

A comprehensive, enterprise-grade web-based CRM, ERP, and Public Marketing Platform built for **Famtima Traders**. It unifies the entire business lifecycle — from lead capture, public discovery, and bilingual engagement to advanced quotation building with section grouping, dynamic invoicing, receipt generation, outstanding debt recovery, staff payroll, company expense tracking, real-time cashflow analytics, customer review management.

---

## Brand & Business Profile

| Property | Details |
|---|---|
| **Company Name** | Famtima Traders |
| **Owner** | Anwar Khan |
| **Tagline** | *"Bemetara’s Trusted Home Decoration & Renovation Experts"* |
| **Operating Location** | Shop No. 08, Krishna Vihar, Bemetara, Chhattisgarh 491335, India |
| **Primary Phone / WhatsApp** | +91 7860854662 |
| **Alternate Phone** | +91 9265012186 |
| **Official Email** | `anwaarrza850@gmail.com` |
| **Service Areas** | Bemetara, Durg, Bhilai, Raipur, Bilaspur, Rajnandgaon, Kawardha, and across Chhattisgarh |
| **Core Services** | Home Decoration & Styling · POP False Ceiling · 100% Waterproof PVC Wall Panelling · Renovation & Remodelling |
| **Currency** | Indian Rupee (INR - ₹) · Non-GST / Standard Trade Billing |
| **Brand Colors** | Dark Forest Green (`#1A4731`), Warm Gold (`#C4902A`), Pale Mint (`#F0F7F2`), Crisp White (`#FFFFFF`) |

---

## High-Level Architecture Mindmap

```mermaid
mindmap
  root((Famtima Traders Platform))
    Public Landing & Discovery
      Responsive Multi-Device Layout
        Mobile Bottom Quick Action Bar
        Tablet 2-Column Responsive Grid
        Desktop Full Header Navigation
      Bilingual Localization
        English Mode
        Hindi Mode (हिंदी)
      Trust & Social Proof
        Customer Ratings & Reviews Modal
        Verified Testimonials Gateway
        Google Maps Business Profile Integration
      Public Showcase & Portfolio
        Home Decoration & Styling
        POP False Ceilings
        100% Waterproof PVC Wall Panelling
        Complete Home & Commercial Renovation
      Lead Capture & Quick Estimator
        Instant WhatsApp Estimate Form
        Direct WhatsApp Click-to-Chat (+91 7860854662)
        Direct Phone Call Dialers
    Authentication & Security
      Role-Based Access Control
        Admin Full Clearance & Company Profile
        Employee Day-to-day CRM Operations
      Supabase RLS Policies
      Anon Public Verification
    CRM & Business Engine
      Inquiries & Leads
        Sources: Walk-in / Call / WhatsApp / Social / Website
        Pipeline: New > Contacted > Quoted > Won / Lost
      Customer Directory
        Auto Code CUS-0001
        Contact & Billing Details
        Linked Documents Cascade
    Document Generation
      Quotations QT-YYYY-XXXX
        Section Grouping & Subtotals
        Optional Items Toggle
        Totals Visibility Toggle
        One-Click Convert to Invoice
      Invoices INV-YYYY-XXXX
        Quote Conversion or Fresh
        Dynamic Balance Sync
        One-Click Record Payment
      Receipts RC-YYYY-XXXX
        Auto Invoice Balance Pull
        Multi-Mode: Cash / UPI / Bank / Cheque / Card
        Automatic Amount in Words
      A4 Print & PDF Engine
        Famtima Traders Dark Green & Gold Palette
        Watermark Stamp & Signature
        Embedded Verification QR
    Financial Tracking
      Outstanding Balance FIFO Aging
      Expense Tracking by Category
      Monthly Staff Payroll Disbursements
      Real-Time Cashflow (Inflow vs Outflow)
    Digital Trust & Verification
      QR Code Generation
      Public Authenticity Portal (/verify/:type/:id)
      Tamper-Proof Audit
```

---

## End-to-End Business Flow

```mermaid
flowchart TD
    %% Public Discovery
    PUB[Public Visitor on Famtima Traders Web] -->|Bilingual Toggle EN/HI| LANG[Localized Website Content]
    PUB -->|Inspect Reviews & Ratings| REV[Reviews & Rating Modal]
    PUB -->|Request Estimate / WhatsApp| INQ[Customer Inquiry / Lead]
    
    %% Lead Conversion
    INQ -->|Qualify & Convert| CUST[Customer Master Profile]
    
    %% Document Lifecycle
    CUST -->|Create Draft| QT[Quotation / Proposal]
    QT -->|Item Options & Section Subtotals| QT_APP[Quotation Sent & Approved]
    QT_APP -->|1-Click Convert| INV[Tax / Commercial Invoice]
    
    %% Payment & Settlement
    INV -->|Outstanding Balance| OUT[Outstanding Aging Report]
    INV -->|Record Payment| RCPT[Payment Receipt]
    RCPT -->|Auto Deduct Balance| INV
    RCPT -->|FIFO Settlement| OUT
    
    %% Cashflow
    RCPT -->|Inflow| CASH[Lifetime & Monthly Cashflow Engine]
    
    %% Operational Expenses
    EXP[Operational Expenses] -->|Outflow| CASH
    PAY[Staff Payroll & Salaries] -->|Outflow| CASH
    
    %% Digital Verification
    
    classDef highlight fill:#1A4731,stroke:#C4902A,stroke-width:2px,color:#fff;
    classDef flow fill:#F0F7F2,stroke:#1A4731,stroke-width:1px,color:#1A4731;
    class PUB,LANG,REV,INQ,CUST,QT,INV,RCPT,OUT,CASH,EXP,PAY highlight;
```

---

## Comprehensive Module Breakdown

### 1. Public Landing & Discovery Website (`/`)
* **Responsive Multi-Device Layout (Desktop, Tablet, Mobile)**:
  * Zero horizontal page wobble (`overflow-x: hidden`, `max-width: 100vw`, `box-sizing: border-box`).
  * Dedicated Mobile Bottom Quick-Action Bar (`WhatsApp`, `Call Now`, `Instant Quote`) fixed on screen.
  * Adaptive mobile navigation drawer with hamburger toggle.
* **Bilingual Localization (English & हिंदी Toggle)**:
  * Fast language selector in the announcement bar and mobile drawer.
  * Real-time language translation across headers, hero copy, trust metrics, service descriptions, quote forms, and FAQs.
* **Streamlined UI/UX Content**:
  * Clean, scannable value propositions without text overload.
  * Top service catalog: Home Decoration, Designer POP False Ceiling, 100% Waterproof PVC Wall Panels, and Renovation.
  * Service coverage pills covering Bemetara, Durg, Bhilai, Raipur, Bilaspur, Rajnandgaon, Kawardha, and Chhattisgarh.
* **Reviews & Social Proof Section**:
  * Honest, unpopulated review state ready for genuine customer testimonials.
  * Placeholder for Google Business Profile & Maps integration.

### 2. Authentication & Role-Based Access Control (RBAC)
* **Dedicated Gateways**: Dedicated role selection between Administrator (`/admin-login`) and Staff/Employee (`/employee-login`) portals.
* **Role Enforcement**:
  * **Admin**: Complete system clearance including company profile, company assets (logo, authorized stamp, signature), user passwords, and settings.
  * **Employee**: Operational clearance for inquiries, customers, quotes, invoices, receipts, and payroll; restricted from company identity and credentials settings.
* **Supabase Auth & Session Handling**: Secure token-based session persistence, password reset flow, and local storage state persistence.

### 3. Inquiry & Pipeline Lead Management
* **Channel Source Tagging**: Logs inquiries originating from Walk-in, Phone Calls, WhatsApp, Instagram, Website, or Referrals.
* **Lifecycle Pipeline**: Visual progression: `New` &rarr; `Contacted` &rarr; `Quoted` &rarr; `Won` / `Lost`.
* **Instant Customer Conversion**: Converts qualified inquiries to complete Customer records with pre-populated phone numbers, service details, and requirements.

### 4. Customer Master Directory
* **Deterministic Auto-Coding**: Sequenced identifier generation (`CUS-0001`, `CUS-0002`).
* **Complete Metadata**: Full customer name, validated 10-digit mobile number, alternate contact, billing address, site location, city, and notes.
* **Comprehensive Search**: Multi-vector real-time filtering across customer name, phone number, customer code, and city.

### 5. Advanced Quotation & Proposal Builder
* **Custom Sequence**: Auto-generated sequential identifiers (`QT-2026-0001`).
* **Section Grouping & Subtotals**: Categorize line items into named zones/rooms (e.g., *Living Room*, *Master Bedroom*, *Hall POP Ceiling*, *PVC Wall Panelling*).
* **Section Subtotal Visibility**: Toggle `show_section_subtotals` on/off based on customer presentation needs.
* **Optional Line Items**: Mark individual rows as optional proposals (`include_in_total = false`). Renders with an `OPTION` badge, excluding cost from final calculation.
* **Optional Totals Display**: Toggle `show_totals` to produce clean itemized scope-of-work sheets without showing monetary sums.
* **One-Click Invoice Conversion**: Instantly creates a complete linked invoice carrying over all line items, rates, and customer relationships.

### 6. Invoicing & Billing Engine
* **Invoice Sequences**: Standardized sequential codes (`INV-2026-0001`).
* **Real-time Balance Computation**: Syncs total invoiced against linked receipt payments.
* **Dynamic Status Synchronization**: Transitions automatically between `Unpaid`, `Partially Paid`, `Paid`, and `Cancelled`.
* **Quick Payment Settlement**: One-click "Record Payment" button launches a pre-filled receipt builder directly tied to the target invoice.

### 7. Payment Receipts
* **Sequenced Receipt Numbers**: (`RC-2026-0001`).
* **Smart Balance Fetching**: Automatically loads prior payments, calculates outstanding balance, and computes remaining dues.
* **Multi-Mode Support**: Cash, UPI, Direct Bank Transfer, Cheque, Credit/Debit Cards.
* **Indian Currency Number-to-Words**: Automatically converts numbers into words (e.g., *"Rupees One Lakh Twenty-Five Thousand Only"*).

### 8. Outstanding Debt Recovery & FIFO Settlement
* **Customer-Level Rollups**: Aggregates total invoiced, total collected, net pending receivables, and pending invoice count.
* **Expandable Details**: Inspect individual invoice line items and payment histories per client.
* **FIFO Settlement Engine**: Receipts settle oldest pending invoices first, preventing billing discrepancies.
* **Visual Overdue Alerting**: Flags unpaid invoices exceeding due dates in bold crimson badges.

### 9. Staff Directory & Monthly Payroll
* **Staff Master**: Manage design assistants, site supervisors, artisans, and contractors with monthly salary contracts, designations, phone numbers, and active/inactive status.
* **Salary Payout Logging**: Record payout disbursements with date, period (`YYYY-MM`), mode, reference notes, and receipts.
* **Live Commitment Overview**: Real-time KPI cards calculating total active personnel and total monthly salary commitments.

### 10. Company Expenses & Cashflow Engine
* **Expense Categories**: Outflow classification across *Material*, *Transport*, *Food/Chai*, *Office Supplies*, *Marketing*, and *Other*.
* **Real-time Financial KPI Matrix**:
  * **Lifetime Inflow**: Real-time sum of all verified customer receipt collections.
  * **Lifetime Outflow**: Aggregated sum of operational expenses and employee salary payouts.
  * **Lifetime Net Cash**: Available company cash reserves (`Inflow - Outflow`).
  * **This Month Outflow**: Current month's burn rate across operational expenses and salaries.

### 11. Document Authenticity & Official Signatory
* **Official Document Layout**: Every generated quotation, invoice, and receipt features authorized signature, company seal watermark, and itemized trade specifications.
* **Zero Authentication Barrier**: Uses dedicated, read-only public RPC/RLS policies allowing third parties, clients, and banks to verify authenticity without logging in.

---

## QR Document Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Client / Third Party
    participant QR as Scanned QR Code
    participant App as Verification Portal (/verify/:type/:id)
    participant DB as Supabase Postgres (Anon RLS)
    
    Customer->>QR: Scans QR code on printed/PDF document
    QR->>App: Opens verification URL (Public Web Portal)
    App->>DB: Query document by UUID/Code + public read policy
    alt Document Valid & Found
        DB-->>App: Returns code, date, amount, customer name, status
        App-->>Customer: Displays Green "AUTHENTIC DIGITAL RECORD" badge, verified metadata
    else Document Not Found / Altered
        DB-->>App: Returns empty / not found
        App-->>Customer: Displays Red "DOCUMENT NOT FOUND OR UNVERIFIED" alert
    end
```

---

## Visual Status & Design System

The application incorporates a unified, high-contrast visual status system across all modules using dot indicators and soft background badges:

| Status Tone | Hex / Class Base | Used For | Visual Representation |
|---|---|---|---|
| **Success / Emerald** | `#059669` / `bg-emerald-50 text-emerald-700` | `paid`, `approved`, `won`, `active` | 🟢 Paid / Approved |
| **Warning / Amber** | `#D97706` / `bg-amber-50 text-amber-700` | `partial`, `sent`, `quoted`, `in-progress` | 🟡 Partial / Sent |
| **Info / Sky** | `#0284C7` / `bg-sky-50 text-sky-700` | `new`, `contacted` | 🔵 New / Contacted |
| **Danger / Rose** | `#E11D48` / `bg-rose-50 text-rose-700` | `unpaid`, `overdue`, `lost`, `rejected`, `cancelled` | 🔴 Unpaid / Overdue |
| **Neutral / Slate** | `#64748B` / `bg-slate-100 text-slate-700` | `draft`, default | ⚪ Draft |

---

## Technology Stack

```
Frontend:
  ├── Core: React 19, TypeScript, Vite
  ├── Routing: TanStack Router (File-based routing)
  ├── Server State & Cache: TanStack Query v5
  ├── Styling & Design Tokens: Tailwind CSS v4, Lucide React Icons
  ├── Form & UI Primitives: Radix UI, Hookform, Zod, Sonner (Toast notifications)
  ├── PDF & Print Engine: html2canvas-pro, jsPDF, jspdf-autotable
  
Backend & Data Layer:
  ├── Database: PostgreSQL (Managed on Supabase)
  ├── Authentication: Supabase Auth (JWT + Session refresh)
  ├── Authorization & Security: PostgreSQL Row Level Security (RLS)
  └── Static Verification: Dedicated verify_document() RPC
```

---

## Repository Structure

```text
├── database/                       # Database schema and SQL migrations
│   └── migrations/                 # PostgreSQL migrations
├── frontend/                       # Client web application
│   ├── public/                     # Static assets, logos, and PWA assets
│   │   ├── famtima-logo.png        # Official high-resolution company logo
│   │   ├── famtima-logo.webp       # Optimized WebP logo
│   │   ├── robots.txt              # Search engine crawling rules
│   │   └── sitemap.xml             # XML sitemap for SEO indexation
│   ├── src/
│   │   ├── components/             # Reusable UI & document builder components
│   │   │   ├── doc/                # Generic document editor & A4 print canvas
│   │   │   ├── layout/             # Sidebar, Navbar, Mobile navigation
│   │   │   └── ui/                 # Buttons, modals, badges, inputs
│   │   ├── lib/
│   │   │   ├── branding.ts         # Company asset URLs and Famtima color tokens
│   │   │   ├── crm.ts              # Database queries, mutations, landing config
│   │   │   ├── numberToWords.ts    # Indian Rupee words generator
│   │   │   ├── status.ts           # Unified status badges & color tokens
│   │   │   └── supabase.ts         # Supabase client instantiation
│   │   ├── routes/                 # TanStack file-based routes
│   │   │   ├── index.tsx           # Bilingual Public Landing & Discovery Page
│   │   │   ├── auth.tsx            # Role selection login hub
│   │   │   ├── admin-login.tsx     # Administrator gateway
│   │   │   ├── employee-login.tsx  # Employee gateway
│   │   │   │   │   │   └── _authenticated/     # Protected application routes
│   │   │       ├── dashboard.tsx   # Executive metrics & quick actions
│   │   │       ├── inquiries.tsx   # Leads pipeline & customer conversion
│   │   │       ├── customers.tsx   # Customer directory
│   │   │       ├── quotations/     # List, creation, editing & views
│   │   │       ├── invoices/       # Billing management & payment triggers
│   │   │       ├── receipts/       # Payment records & printable receipts
│   │   │       ├── outstanding.tsx # Debt recovery & FIFO aging
│   │   │       ├── payroll.tsx     # Staff master & salary disbursements
│   │   │       ├── expenses.tsx    # Operational expenses & cashflow
│   │   │       └── settings.tsx    # Identity, logo, stamp, signature & rates
│   │   └── styles.css              # Global layout tokens, anti-drift & print rules
│   ├── .env                        # Environment configurations
│   ├── package.json
│   └── vite.config.ts
├── prd.md                          # Product Requirements Document
└── README.md                       # Master System Documentation
```

---

## Local Setup & Development

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (version 18, 20, or 22 LTS)
* Independent Supabase project with PostgreSQL instance

### 2. Environment Configuration
Create a `.env` file inside `frontend/`:

```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-anon-key>

VITE_PUBLIC_URL=https://famtima-traders.vercel.app
```

### 3. Installation & Run
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Production Build Validation
```bash
npm run build
npm run preview
```

---

## Database Migration & RLS Security

To enable section subtotal enhancements on your independent Supabase database, execute the migrations located in `database/migrations/` in order.

---

## License

Private and Confidential. Developed exclusively for **Famtima Traders, Bemetara, Chhattisgarh**. All rights reserved.
