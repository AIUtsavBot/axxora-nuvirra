import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv, hasSupabaseCredentials } from "./env";

export async function createServerSupabase() {
  if (!hasSupabaseCredentials()) {
    return null;
  }

  const cookieStore = await cookies();
  const env = getSupabaseEnv();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items) {
        items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });
}
