import { notFound } from "next/navigation";
import { DetailList, PageHero, StatusBadge, Timeline } from "@/components/crm";
import { getCustomerDetail, getCustomerTimeline } from "@/lib/data/repository";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [customer, timeline] = await Promise.all([getCustomerDetail(id), getCustomerTimeline(id)]);
  if (!customer) notFound();

  return (
    <>
      <PageHero eyebrow="Customer 360" title={customer.name} description={customer.note} chip={customer.valueTier} />
      <section className="workspace-grid">
        <article className="panel"><div className="panel-heading"><div><p className="eyebrow">Profile</p><h3>Shared customer context</h3></div></div><div className="user-meta"><div><span className="meta-label">Intent</span><strong>{customer.intent}</strong></div><div><span className="meta-label">Journey</span><strong>{customer.journey}</strong></div><div><span className="meta-label">Last activity</span><strong>{new Date(customer.lastActivityAt).toLocaleString()}</strong></div><div><span className="meta-label">Email</span><strong>{customer.email}</strong></div><div><span className="meta-label">Phone</span><strong>{customer.phone}</strong></div><div><span className="meta-label">City</span><strong>{customer.city}</strong></div></div><div className="tag-list">{customer.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div><div className="context-list">{customer.conversations.map((conversation) => <article key={conversation.id} className="context-card"><strong>{conversation.subject}</strong><p>{conversation.platform}</p><div><StatusBadge value={conversation.status} /></div></article>)}</div></article>
        <article className="panel"><div className="panel-heading"><div><p className="eyebrow">Merged timeline</p><h3>Messages, orders, support, content</h3></div></div><Timeline entries={timeline} /></article>
      </section>
      <section className="context-grid">
        <DetailList title="Orders" items={customer.orders} />
        <DetailList title="Support cases" items={customer.supportCases} />
      </section>
      <DetailList title="Content requests" items={customer.contentRequests} />
    </>
  );
}
