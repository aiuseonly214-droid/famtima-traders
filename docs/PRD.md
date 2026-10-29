# Product Requirements Document (PRD)

## 1. Project Overview

**Name**: Famtima Traders CRM
**Purpose**: A professional web-based CRM for Famtima Traders to manage customer inquiries, quotations, invoices, and payment receipts.
**Target Audience**: Employees and Admin of Famtima Traders.

## 2. Business Workflows

- **Lead Generation**: Inquiry -> Customer.
- **Document Flow**: Customer -> Quotation (draft, sent, approved, rejected) -> Invoice (unpaid, partial, paid, cancelled) -> Receipt.

## 3. Features (Phase 1)

- **Authentication**: Role-based access (Admin, Employee). Admin has access to settings; Employee can manage documents and customers.
- **Dashboard**: Summary metrics for customers, outstanding amounts, recent documents, and quick actions.
- **Customer Management**: Code auto-generation, search functionality, contact tracking, and cascade deletion.
- **Inquiry Management**: Source tracking, pipeline status, and one-click conversion to customer.
- **Quotations**: Auto-numbering, customizable line items (with optional items and totals), status tracking, PDF generation (A4 format), and invoice conversion.
- **Invoices**: Syncs with quotation data, updates dynamically based on payments, and integrates with the receipt system.
- **Receipts**: Logs payments, auto-pulls invoice balances, and supports multiple payment modes (Cash, UPI, Cheque, etc.).
- **Outstanding Reports**: Tracks customer-wise and invoice-wise balances with FIFO settlement logic.
- **Settings (Admin)**: Manages company profile, branding assets (logo, stamp, signature), terms and conditions, and user passwords.

## 4. Tech Stack

- **Frontend**: React 19, TanStack Start, Tailwind CSS v4, shadcn/ui.
- **Backend/DB**: Supabase (Postgres, Auth, RLS).
- **PDF Generation**: jsPDF + html2canvas-pro.

## 5. Security & Access

- RLS enabled in Supabase to strictly isolate data according to user roles.
- Role validations (has_role()) applied for specific admin-only pages like Settings.
