import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const DEFAULT_URL = "https://jmnhbkvlgabbvrviycmi.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptbmhia3ZsZ2FiYnZydml5Y21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNzUyODUsImV4cCI6MjEwODg1MTI4NX0.UprjZVJ9Rb6aCrc5UMjZhsKlCnYX_0IGfj-MIUPaGSU";

// These are baked at build time by vite.config.ts `define` block,
// which resolves any naming variant (url, public_key, SUPABASE_URL, etc.)
// into the canonical VITE_ names before the build.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL?.trim() ||
  (typeof process !== "undefined" ? (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "") : "") ||
  DEFAULT_URL;

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  (typeof process !== "undefined"
    ? (process.env.SUPABASE_PUBLISHABLE_KEY ||
       process.env.SUPABASE_ANON_KEY ||
       process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
       "")
    : "") ||
  DEFAULT_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_URL !== "https://placeholder-project.supabase.co" &&
    SUPABASE_PUBLISHABLE_KEY &&
    SUPABASE_PUBLISHABLE_KEY !== "placeholder-anon-key",
);

if (!isSupabaseConfigured) {
  console.warn(
    "[Supabase] Credentials not found. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel → Project → Settings → Environment Variables, then Redeploy.",
  );
}

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New publishable key format uses apikey header, not Bearer auth
    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createSupabaseClient() {
  const url = SUPABASE_URL || "https://placeholder-project.supabase.co";
  const key = SUPABASE_PUBLISHABLE_KEY || "placeholder-anon-key";

  return createClient<Database>(url, key, {
    global: {
      fetch: createSupabaseFetch(key),
    },
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
