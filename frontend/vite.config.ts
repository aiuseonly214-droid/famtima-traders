import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  // Expose all common variable prefixes so client code never misses Supabase credentials
  envPrefix: ["VITE_", "SUPABASE_", "NEXT_PUBLIC_", "url", "URL", "public", "PUBLIC", "anon", "ANON"],
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
