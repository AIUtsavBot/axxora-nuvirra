import { CustomerList, PageHero } from "@/components/crm";
import { getCustomers } from "@/lib/data/repository";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ search?: string; tier?: string }> }) {
  const params = await searchParams;
  const customers = await getCustomers();

  const search = params.search?.toLowerCase().trim();
  const tier = params.tier;

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      !search ||
      [customer.name, customer.email, customer.city, customer.note, customer.intent]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search);

    const matchesTier = !tier || tier === "All" || customer.valueTier === tier;

    return matchesSearch && matchesTier;
  });

  const valueTiers = Array.from(new Set(customers.map((c) => c.valueTier).filter(Boolean)));

  return (
    <>
      <PageHero
        eyebrow="Customer 360"
        title="Unified Customer Directory"
        description="Search across all customers, filter by intent/value tier, and view aggregated interaction timelines."
        chip={`${filteredCustomers.length} customers`}
      />

      <section className="panel filters-panel">
        <form className="filters-inline">
          <input
            name="search"
            defaultValue={params.search ?? ""}
            placeholder="Search name, email, or city..."
          />
          <select name="tier" defaultValue={params.tier ?? "All"}>
            <option value="All">All value tiers</option>
            {valueTiers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button className="secondary-button" type="submit">
            Filter
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Database records</p>
            <h3>Customer Profiles</h3>
          </div>
        </div>
        {filteredCustomers.length > 0 ? (
          <CustomerList customers={filteredCustomers} />
        ) : (
          <div className="empty-state">No customers match the current search filters.</div>
        )}
      </section>
    </>
  );
}
