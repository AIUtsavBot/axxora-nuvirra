import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { logoutAction } from "@/app/login.actions";
import { SidebarNav } from "@/components/sidebar-nav";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/inbox", label: "Inbox" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/support", label: "Support" },
  { href: "/dashboard/content", label: "Content" },
  { href: "/dashboard/campaigns", label: "Campaigns" },
  { href: "/dashboard/imports", label: "Imports" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">NV</div>
          <div>
            <p className="eyebrow">Internal CRM</p>
            <h1>Nuvirra Ops</h1>
          </div>
        </div>
        <div className="sidebar-section sidebar-note">
          <p className="section-label">Signed in</p>
          <p>{user.email}</p>
        </div>
        <SidebarNav items={navItems} />
        <form action={logoutAction}>
          <button className="secondary-button sidebar-button" type="submit">Sign out</button>
        </form>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
