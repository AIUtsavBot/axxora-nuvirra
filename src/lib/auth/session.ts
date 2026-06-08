import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabaseCredentials } from "@/lib/supabase/env";

const DEMO_COOKIE = "nuvirra_demo_session";

export interface SessionUser {
  email: string;
  mode: "demo" | "supabase";
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (hasSupabaseCredentials()) {
    const supabase = await createServerSupabase();
    const { data } = await supabase!.auth.getUser();
    if (data.user?.email) {
      return { email: data.user.email, mode: "supabase" };
    }
  }

  if (process.env.VERCEL) {
    return null;
  }

  const cookieStore = await cookies();
  const demo = cookieStore.get(DEMO_COOKIE)?.value;
  return demo ? { email: demo, mode: "demo" } : null;
}

export async function createDemoSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function signInWithSupabase(email: string, password: string) {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_COOKIE);

  const supabase = await createServerSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
}
