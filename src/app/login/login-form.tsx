"use client";

import { useActionState } from "react";
import { loginAction } from "../login.actions";

const initialState = { error: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="auth-card__form">
      <label>
        <span>Email</span>
        <input name="email" type="email" placeholder="nuvirra9@gmail.com" required />
      </label>
      <label>
        <span>Password</span>
        <input name="password" type="password" placeholder="Your password" required />
      </label>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      <button type="submit" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
