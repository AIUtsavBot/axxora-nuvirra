"use client";

import { useActionState } from "react";
import { loginAction } from "../login.actions";

const initialState = { error: "" };

export function LoginForm({ demoMode }: { demoMode: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="auth-card__form">
      <input type="hidden" name="mode" value={demoMode ? "demo" : "supabase"} />
      <label>
        <span>Email</span>
        <input name="email" type="email" placeholder="ops@nuvirra.com" required />
      </label>
      <label>
        <span>Password</span>
        <input name="password" type="password" placeholder={demoMode ? "Optional in demo mode" : "Your password"} />
      </label>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      <button type="submit" disabled={pending}>{pending ? "Signing in..." : demoMode ? "Enter Demo Workspace" : "Sign in"}</button>
    </form>
  );
}
