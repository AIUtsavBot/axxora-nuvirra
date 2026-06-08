import { DataTable, PageHero, StatusBadge, SupportForm } from "@/components/crm";
import { getCustomers, getSupportCases } from "@/lib/data/repository";

export default async function SupportPage() {
  const [cases, customers] = await Promise.all([getSupportCases(), getCustomers()]);
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <>
      <PageHero eyebrow="Support" title="Issue resolution workspace" description="Log customer issues, track progress, and keep resolution notes tied to the full customer timeline." chip={`${cases.length} support cases`} />
      <DataTable columns={["Customer", "Topic", "Priority", "Status", "Updated"]} rows={cases.map((support) => [customerMap.get(support.customerId)?.name ?? "Unknown", support.topic, support.priority, <StatusBadge key="status" value={support.status} />, new Date(support.updatedAt).toLocaleString()])} empty="No support cases available." />
      <SupportForm customers={customers} />
    </>
  );
}
