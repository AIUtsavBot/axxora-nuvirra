import { ImportPreviewForm, PageHero } from "@/components/crm";

export default function ImportsPage() {
  return (
    <>
      <PageHero eyebrow="Imports" title="CSV intake and validation" description="Preview incoming conversation/message or order CSV files, validate required columns, and surface row-level parsing issues before import." chip="Preview-first workflow" />
      <ImportPreviewForm />
      <section className="panel"><div className="panel-heading"><div><p className="eyebrow">Expected columns</p><h3>Deterministic import contracts</h3></div></div><div className="context-list"><article className="context-card"><strong>Conversations & messages</strong><p>`customer_id`, `platform`, `subject`, `status`, `author`, `direction`, `content`</p></article><article className="context-card"><strong>Orders</strong><p>`customer_id`, `product_summary`, `quantity`, `status`, `channel`</p></article></div></section>
    </>
  );
}
