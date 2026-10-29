import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

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

function resolveEnv(candidates: string[]): string | undefined {
  const metaEnv = (import.meta.env || {}) as Record<string, string | undefined>;
  const procEnv = (typeof process !== "undefined" ? process.env || {} : {}) as Record<string, string | undefined>;

  // 1. Direct key match
  for (const k of candidates) {
    if (metaEnv[k]?.trim()) return metaEnv[k]?.trim();
    if (procEnv[k]?.trim()) return procEnv[k]?.trim();
  }

  // 2. Case-insensitive search across all environment keys
  const merged = { ...procEnv, ...metaEnv };
  for (const [k, v] of Object.entries(merged)) {
    if (v?.trim() && candidates.some((c) => c.toLowerCase() === k.toLowerCase())) {
      return v.trim();
    }
  }

  return undefined;
}

const resolvedUrl = resolveEnv([
  "VITE_SUPABASE_URL",
  "SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "url",
  "URL",
  "supabase_url",
  "SUPABASE_PROJECT_URL",
]);

const resolvedKey = resolveEnv([
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "public_key",
  "PUBLIC_KEY",
  "public-key",
  "public",
  "PUBLIC",
  "anon_key",
  "ANON_KEY",
  "anon",
  "ANON",
  "supabase_key",
  "SUPABASE_KEY",
]);

export const isSupabaseConfigured = Boolean(resolvedUrl && resolvedKey);

function createSupabaseClient() {
  const SUPABASE_URL = resolvedUrl || "https://placeholder-project.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = resolvedKey || "placeholder-anon-key";

  if (!isSupabaseConfigured) {
    console.warn(
      "[Supabase] Environment variables not detected. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel settings."
    );
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
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
