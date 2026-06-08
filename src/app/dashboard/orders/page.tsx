import { DataTable, OrderForm, PageHero, StatusBadge } from "@/components/crm";
import { getCustomers, getOrders, getPlatforms } from "@/lib/data/repository";

export default async function OrdersPage() {
  const [orders, customers, platforms] = await Promise.all([getOrders(), getCustomers(), getPlatforms()]);
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <>
      <PageHero eyebrow="Orders" title="Manual order command" description="Create orders, track current status, and keep shipping references linked to the customer record." chip={`${orders.length} orders`} />
      <DataTable columns={["Customer", "Products", "Qty", "Status", "Tracking", "Updated"]} rows={orders.map((order) => [customerMap.get(order.customerId)?.name ?? "Unknown", order.productSummary, order.quantity, <StatusBadge key="status" value={order.status} />, order.trackingReference || "-", new Date(order.updatedAt).toLocaleString()])} empty="No orders available." />
      <OrderForm customers={customers} platforms={platforms} />
    </>
  );
}
