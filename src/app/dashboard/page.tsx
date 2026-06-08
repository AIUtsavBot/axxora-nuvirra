import Link from "next/link";
import { ContextPanels, CustomerList, MetricsGrid, PageHero, SummaryCards } from "@/components/crm";
import { getCustomers, getDashboardData } from "@/lib/data/repository";

export default async function DashboardPage() {
  const dashboard = await getDashboardData();
  const customers = await getCustomers();

  return (
    <>
      <PageHero eyebrow="Nuvirra operations hub" title={dashboard.companyName} description={dashboard.companySummary} chip={dashboard.companyHealth} />
      <MetricsGrid metrics={dashboard.metrics} />
      <SummaryCards items={[
        { label: "Open conversations", value: dashboard.quickStats.openConversations, note: "Needs response or follow-up" },
        { label: "Open orders", value: dashboard.quickStats.openOrders, note: "Active fulfillment workload" },
        { label: "Open support", value: dashboard.quickStats.openSupport, note: "Customer issues in progress" },
        { label: "Open content", value: dashboard.quickStats.openContent, note: "Requests under review" },
      ]} />
      <ContextPanels context={dashboard.context} priorities={dashboard.priorities} />
      <section className="panel"><div className="panel-heading"><div><p className="eyebrow">Customer 360</p><h3>Unified customer list</h3></div><Link className="secondary-button" href="/dashboard/inbox">Open inbox</Link></div><CustomerList customers={customers} /></section>
    </>
  );
}
