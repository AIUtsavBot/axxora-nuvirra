import { AiContentStudio, ContentForm, DataTable, PageHero, StatusBadge } from "@/components/crm";
import { getContentRequests, getCustomers, getPlatforms } from "@/lib/data/repository";

export default async function ContentPage() {
  const [requests, customers, platforms] = await Promise.all([getContentRequests(), getCustomers(), getPlatforms()]);
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <>
      <PageHero eyebrow="Content" title="Content-led demand tracking" description="Track inbound content requests and turn social interest into product-aware customer journeys." chip={`${requests.length} active requests`} />
      <DataTable columns={["Customer", "Topic", "Platform", "Campaign", "Status", "Updated"]} rows={requests.map((content) => [customerMap.get(content.customerId)?.name ?? "Unknown", content.topic, content.sourcePlatform, content.campaign, <StatusBadge key="status" value={content.status} />, new Date(content.updatedAt).toLocaleString()])} empty="No content requests available." />
      <section className="context-grid">
        <ContentForm customers={customers} platforms={platforms} />
        <AiContentStudio />
      </section>
    </>
  );
}
