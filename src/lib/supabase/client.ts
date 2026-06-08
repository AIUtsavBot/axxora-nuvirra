import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, hasSupabaseCredentials } from "./env";

export function createClient() {
  const env = getSupabaseEnv();
  if (!hasSupabaseCredentials()) {
    return null;
  }

  return createBrowserClient(env.url, env.anonKey);
}
