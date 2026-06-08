import Link from "next/link";
import { ConversationForm, DataTable, MessageSplit, PageHero, StatusBadge } from "@/components/crm";
import { getConversations, getCustomers, getPlatforms } from "@/lib/data/repository";

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ platform?: string; status?: string; search?: string }> }) {
  const params = await searchParams;
  const [conversations, customers, platforms] = await Promise.all([
    getConversations(params),
    getCustomers(),
    getPlatforms(),
  ]);

  return (
    <>
      <PageHero eyebrow="Unified inbox" title="Cross-platform conversation command" description="Review open customer threads by platform, search intent, and status. Use manual entry for new platform activity in v1." chip={`${conversations.length} visible threads`} />
      <section className="panel filters-panel"><form className="filters-inline"><input name="search" defaultValue={params.search ?? ""} placeholder="Search customer or subject" /><select name="platform" defaultValue={params.platform ?? "All"}><option value="All">All platforms</option>{platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.label}</option>)}</select><select name="status" defaultValue={params.status ?? "all"}><option value="all">All statuses</option><option value="open">open</option><option value="pending">pending</option><option value="closed">closed</option></select><button className="secondary-button" type="submit">Filter</button></form></section>
      <DataTable
        columns={["Customer", "Platform", "Subject", "Status", "Updated", "Action"]}
        rows={conversations.map((conversation) => [
          <strong key="c">{conversation.customer.name}</strong>,
          conversation.platform,
          conversation.subject,
          <StatusBadge key="s" value={conversation.status} />,
          new Date(conversation.updatedAt).toLocaleString(),
          <Link key="a" href={`/dashboard/customers/${conversation.customerId}`}>Open customer</Link>,
        ])}
        empty="No conversations match the current filters."
      />
      <ConversationForm customers={customers} platforms={platforms} />
      <section className="panel"><div className="panel-heading"><div><p className="eyebrow">Split channel view</p><h3>Recent message boards</h3></div></div><MessageSplit conversations={conversations.slice(0, 4)} /></section>
    </>
  );
}
