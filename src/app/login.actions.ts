"use server";

import { redirect } from "next/navigation";
import { clearSession, createDemoSession, signInWithSupabase } from "@/lib/auth/session";

export async function loginAction(_: { error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const mode = String(formData.get("mode") ?? "supabase");

  if (!email) {
    return { error: "Email is required." };
  }

  if (mode === "demo") {
    if (process.env.VERCEL) {
      return { error: "Demo mode is disabled on Vercel." };
    }
    await createDemoSession(email);
    redirect("/dashboard");
  }

  const result = await signInWithSupabase(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
