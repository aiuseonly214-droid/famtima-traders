import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { ChatbotWidget } from "@/components/ChatbotWidget";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          "Fatima Traders | Home Decoration, POP False Ceiling & PVC Wall Panelling | Bemetara, Chhattisgarh",
      },
      {
        name: "description",
        content:
          "Top-rated home decoration, POP false ceiling design, PVC wall panelling & turnkey renovation contractor in Bemetara, Durg, Bhilai, Raipur, Kawardha & Chhattisgarh. 15+ years expert craftsmanship by Anwar Khan. Free site estimate: +91 7860854662.",
      },
      {
        name: "keywords",
        content:
          "fatima traders, fatima traders bemetara, pop work bemetara, pop false ceiling bemetara, pvc wall panelling bemetara, home decoration bemetara, false ceiling chhattisgarh, pop contractor bemetara, pvc ceiling contractor chhattisgarh, interior designer bemetara, pop design bemetara, pvc wall panel shop bemetara, gypsum false ceiling durg bhilai, home interior raipur chhattisgarh, false ceiling contractor raipur, pop ceiling rate per sq ft chhattisgarh, wall panelling kawardha, turnkey renovation bemetara, krishna vihar bemetara, anwar khan pop contractor, bemetara me pop ka kaam, false ceiling design 2026",
      },
      { name: "author", content: "Fatima Traders" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:site_name", content: "Fatima Traders" },
      {
        property: "og:title",
        content: "Fatima Traders | Home Decoration, POP Work & PVC Wall Panelling | Bemetara",
      },
      {
        property: "og:description",
        content:
          "Bemetara's trusted home decoration, POP work, false ceiling, PVC wall panelling & renovation experts. Contact +91 7860854662.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:image", content: "/fatima-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Fatima Traders | Home Decoration & Renovation in Bemetara",
      },
      {
        name: "twitter:description",
        content:
          "Bemetara's trusted home decoration, POP work, PVC wall panelling & renovation. Call +91 7860854662.",
      },
      { name: "twitter:image", content: "/fatima-logo.png" },
      { name: "google-site-verification", content: "ekcA6wQzHfHys-ze-aV36IEQ5JAnOHGA5OSsSbrkkOo" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster richColors position="top-right" />
      <ChatbotWidget companyPhone="7860854662" />
    </QueryClientProvider>
  );
}
