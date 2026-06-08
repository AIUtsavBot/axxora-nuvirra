"use server";

import { redirect } from "next/navigation";
import { clearSession, createDemoSession, signInWithSupabase } from "@/lib/auth/session";

import { hasSupabaseCredentials } from "@/lib/supabase/env";

export async function loginAction(_: { error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (email !== "nuvirra9@gmail.com" || password !== "Nuvirra9@") {
    return { error: "Invalid email or password." };
  }

  if (hasSupabaseCredentials()) {
    const result = await signInWithSupabase(email, password);
    if (!result.ok) {
      return { error: result.error };
    }
  } else {
    await createDemoSession(email);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
