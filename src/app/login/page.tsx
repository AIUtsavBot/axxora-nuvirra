import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Nuvirra internal workspace</p>
          <h1>Ops CRM</h1>
          <p className="hero-copy">
            Manage customer conversations, orders, support cases, and content-led leads in one place.
          </p>
        </div>
        <div className="callout-grid">
          <div className="callout"><strong>Unified inbox</strong><span>Cross-platform customer context with timeline-first navigation.</span></div>
          <div className="callout"><strong>Order workflows</strong><span>Create, update, and track orders without leaving the CRM.</span></div>
          <div className="callout"><strong>Import-ready</strong><span>CSV preview and import flows for historical message and order data.</span></div>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
