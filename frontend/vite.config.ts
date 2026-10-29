import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// Resolve Supabase credentials from any environment variable naming convention
function resolveSupabaseEnv() {
  const e = process.env;
  const url =
    e.VITE_SUPABASE_URL ||
    e.SUPABASE_URL ||
    e.NEXT_PUBLIC_SUPABASE_URL ||
    e.url ||
    e.URL ||
    "";
  const key =
    e.VITE_SUPABASE_PUBLISHABLE_KEY ||
    e.VITE_SUPABASE_ANON_KEY ||
    e.SUPABASE_PUBLISHABLE_KEY ||
    e.SUPABASE_ANON_KEY ||
    e.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    e.public_key ||
    e.PUBLIC_KEY ||
    e.anon_key ||
    e.ANON_KEY ||
    e.anon ||
    "";
  return { url, key };
}

const { url: sbUrl, key: sbKey } = resolveSupabaseEnv();

export default defineConfig({
  // Expose all common variable prefixes so client code never misses Supabase credentials
  envPrefix: ["VITE_", "SUPABASE_", "NEXT_PUBLIC_", "url", "URL", "public", "PUBLIC", "anon", "ANON"],
  // Force-inject resolved Supabase credentials at build time under canonical names
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(sbUrl),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(sbKey),
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    nitro({
      preset: process.env.NITRO_PRESET || (process.env.VERCEL ? "vercel" : undefined),
    }),
    viteReact(),
  ],
});
