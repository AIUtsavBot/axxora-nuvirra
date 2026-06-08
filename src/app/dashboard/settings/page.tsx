import { ContextPanels, PageHero } from "@/components/crm";
import { getDashboardData, getPlatforms, getProducts } from "@/lib/data/repository";
import { hasSupabaseCredentials } from "@/lib/supabase/env";

export default async function SettingsPage() {
  const [dashboard, platforms, products] = await Promise.all([getDashboardData(), getPlatforms(), getProducts()]);
  return (
    <>
      <PageHero eyebrow="Settings" title="Workspace configuration" description="Review current operating assumptions, active channels, and lightweight product references for Nuvirra ops." chip={hasSupabaseCredentials() ? "Supabase configured" : "Demo mode active"} />
      <ContextPanels context={dashboard.context} priorities={dashboard.priorities} />
      <section className="context-grid">
        <article className="panel"><div className="panel-heading"><div><p className="eyebrow">Platforms</p><h3>Active channels</h3></div></div><div className="context-list">{platforms.map((platform) => <article key={platform.id} className="context-card"><strong>{platform.label}</strong><p>{platform.description}</p></article>)}</div></article>
        <article className="panel"><div className="panel-heading"><div><p className="eyebrow">Products</p><h3>Lightweight product catalog</h3></div></div><div className="context-list">{products.map((product) => <article key={product.id} className="context-card"><strong>{product.name}</strong><p>{product.category} | {product.summary}</p></article>)}</div></article>
      </section>
    </>
  );
}
