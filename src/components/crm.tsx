"use client";
import Link from "next/link";
import clsx from "clsx";
import { useActionState, useState } from "react";
import { commitImportAction, createContentAction, createConversationAction, createOrderAction, createSupportAction, previewImportAction, replyToConversationAction } from "@/app/dashboard/actions";
import type { ActivityEntry, ContentRequest, Conversation, Customer, DashboardMetric, Order, PlatformDefinition, PriorityItem, SupportCase } from "@/types";

export function PageHero({ eyebrow, title, description, chip }: { eyebrow: string; title: string; description: string; chip?: string }) { return <section className="hero panel"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="hero-copy">{description}</p></div>{chip ? <div className="hero-chip hero-chip-alt">{chip}</div> : null}</section>; }
export function MetricsGrid({ metrics }: { metrics: DashboardMetric[] }) { return <section className="stats-grid">{metrics.map((metric) => <article key={metric.label} className="stat-card"><p className="eyebrow">{metric.label}</p><div className="metric">{metric.value}</div><div className="delta">{metric.delta}</div></article>)}</section>; }
export function ContextPanels({ context, priorities }: { context: { id: string; title: string; detail: string }[]; priorities: PriorityItem[] }) { return <section className="context-grid"><article className="panel"><div className="panel-heading"><div><p className="eyebrow">Shared Company Context</p><h3>What every team already knows</h3></div></div><div className="context-list">{context.map((item) => <article key={item.id} className="context-card"><strong>{item.title}</strong><p>{item.detail}</p></article>)}</div></article><article className="panel"><div className="panel-heading"><div><p className="eyebrow">Current Priorities</p><h3>Operational watchlist</h3></div></div><div className="priority-list">{priorities.map((item) => <article key={item.id} className="priority-card"><div><strong>{item.title}</strong><p>Visible to all teams handling Nuvirra</p></div><span className={clsx("priority-level", item.level.toLowerCase())}>{item.level}</span></article>)}</div></article></section>; }
export function StatusBadge({ value }: { value: string }) { const tone = value.includes("resolved") || value.includes("delivered") || value.includes("approved") ? "teal" : value.includes("cancel") ? "danger" : value.includes("pending") || value.includes("processing") || value.includes("review") ? "gold" : "accent"; return <span className={`value-pill tone-${tone}`}>{value.replaceAll("_", " ")}</span>; }
export function DataTable({ columns, rows, empty }: { columns: string[]; rows: React.ReactNode[][]; empty: string }) { return <div className="table-wrap panel">{rows.length ? <table className="crm-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table> : <div className="empty-state">{empty}</div>}</div>; }
export function Timeline({ entries }: { entries: ActivityEntry[] }) { return <div className="timeline">{entries.map((entry) => <article key={entry.id} className="timeline-card"><div className="message-row"><strong>{entry.title}</strong><span>{new Date(entry.createdAt).toLocaleString()}</span></div><p>{entry.body}</p><p>{entry.meta}</p></article>)}</div>; }
export function CustomerList({ customers }: { customers: Customer[] }) { return <div className="customer-grid">{customers.map((customer) => <Link key={customer.id} href={`/dashboard/customers/${customer.id}`} className="user-card"><div className="user-card-header"><div><strong>{customer.name}</strong><p>{customer.intent}</p></div><span className="value-pill">{customer.valueTier}</span></div><div className="user-card-footer"><small>{customer.city}</small><small>{new Date(customer.lastActivityAt).toLocaleDateString()}</small></div></Link>)}</div>; }
function FormFeedback({ state }: { state: { error?: string; success?: string } | null }) { if (state?.error) return <p className="form-error">{state.error}</p>; if (state?.success) return <p className="form-success">{state.success}</p>; return null; }
export function OrderForm({ customers, platforms }: { customers: Customer[]; platforms: PlatformDefinition[] }) { const [state, action, pending] = useActionState(createOrderAction, null); return <form action={action} className="inline-form panel"><div className="panel-heading"><div><p className="eyebrow">Create Order</p><h3>Manual order workflow</h3></div></div><div className="form-grid"><select name="customerId" required><option value="">Select customer</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input name="productSummary" placeholder="Product summary" required /><input name="quantity" type="number" min="1" defaultValue="1" required /><select name="status" defaultValue="draft">{["draft","confirmed","processing","shipped","delivered","cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}</select><select name="channel" defaultValue="WhatsApp">{platforms.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select><input name="trackingReference" placeholder="Tracking reference" /><textarea name="note" placeholder="Operational note" rows={3} /></div><FormFeedback state={state} /><button className="primary-button" type="submit" disabled={pending}>{pending ? "Saving..." : "Create order"}</button></form>; }
export function SupportForm({ customers }: { customers: Customer[] }) { const [state, action, pending] = useActionState(createSupportAction, null); return <form action={action} className="inline-form panel"><div className="panel-heading"><div><p className="eyebrow">Create Support Case</p><h3>Log customer issues</h3></div></div><div className="form-grid"><select name="customerId" required><option value="">Select customer</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input name="topic" placeholder="Issue topic" required /><select name="status" defaultValue="open">{["open","in_progress","resolved"].map((status) => <option key={status} value={status}>{status}</option>)}</select><select name="priority" defaultValue="medium">{["low","medium","high"].map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select><textarea name="resolutionNote" placeholder="Notes or next steps" rows={3} /></div><FormFeedback state={state} /><button className="primary-button" type="submit" disabled={pending}>{pending ? "Saving..." : "Create support case"}</button></form>; }
export function ContentForm({ customers, platforms }: { customers: Customer[]; platforms: PlatformDefinition[] }) { const [state, action, pending] = useActionState(createContentAction, null); return <form action={action} className="inline-form panel"><div className="panel-heading"><div><p className="eyebrow">Create Content Request</p><h3>Track content-led demand</h3></div></div><div className="form-grid"><select name="customerId" required><option value="">Select customer</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input name="topic" placeholder="Topic" required /><select name="sourcePlatform" defaultValue="Instagram">{platforms.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select><select name="status" defaultValue="new">{["new","reviewing","approved","completed"].map((status) => <option key={status} value={status}>{status}</option>)}</select><input name="campaign" placeholder="Campaign" required /><textarea name="note" placeholder="Request note" rows={3} /></div><FormFeedback state={state} /><button className="primary-button" type="submit" disabled={pending}>{pending ? "Saving..." : "Create content request"}</button></form>; }
export function ConversationForm({ customers, platforms }: { customers: Customer[]; platforms: PlatformDefinition[] }) { const [state, action, pending] = useActionState(createConversationAction, null); return <form action={action} className="inline-form panel"><div className="panel-heading"><div><p className="eyebrow">Create Conversation</p><h3>Manual inbox entry</h3></div></div><div className="form-grid"><select name="customerId" required><option value="">Select customer</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select name="platform">{platforms.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select><input name="subject" placeholder="Conversation subject" required /><select name="status" defaultValue="open">{["open","pending","closed"].map((status) => <option key={status} value={status}>{status}</option>)}</select><input name="source" placeholder="Source" required /><input name="messageAuthor" placeholder="Message author" required /><select name="messageDirection" defaultValue="inbound"><option value="inbound">inbound</option><option value="outbound">outbound</option></select><textarea name="messageContent" placeholder="First message content" rows={3} required /></div><FormFeedback state={state} /><button className="primary-button" type="submit" disabled={pending}>{pending ? "Saving..." : "Create conversation"}</button></form>; }
export function ImportPreviewForm() { const [previewState, previewAction, previewPending] = useActionState(previewImportAction, null); const [commitState, commitAction, commitPending] = useActionState(commitImportAction, null); return <div className="context-grid"><form action={previewAction} className="inline-form panel"><div className="panel-heading"><div><p className="eyebrow">CSV Preview</p><h3>Validate before import</h3></div></div><div className="form-grid"><select name="kind" defaultValue="conversations"><option value="conversations">Conversations and messages</option><option value="orders">Orders</option></select><textarea name="csv" rows={10} placeholder="Paste CSV content here" required /></div><FormFeedback state={previewState} />{previewState?.preview ? <pre className="preview-box">{previewState.preview}</pre> : null}<button className="primary-button" type="submit" disabled={previewPending}>{previewPending ? "Parsing..." : "Preview import"}</button></form><form action={commitAction} className="inline-form panel"><div className="panel-heading"><div><p className="eyebrow">Commit Import</p><h3>Write validated rows to Supabase</h3></div></div><div className="form-grid"><select name="kind" defaultValue="conversations"><option value="conversations">Conversations and messages</option><option value="orders">Orders</option></select><textarea name="csv" rows={10} placeholder="Paste the same validated CSV here to commit" required /></div><FormFeedback state={commitState} /><button className="primary-button" type="submit" disabled={commitPending}>{commitPending ? "Importing..." : "Commit import"}</button></form></div>; }
export function MessageReplyForm({ conversationId }: { conversationId: string }) {
  const [state, action, pending] = useActionState(replyToConversationAction, null);
  const [content, setContent] = useState("");
  const [drafting, setDrafting] = useState(false);

  const handleDraftAI = async () => {
    setDrafting(true);
    try {
      const res = await fetch(`/api/ai/draft?conversationId=${conversationId}`);
      const data = await res.json();
      if (data.draft) {
        setContent(data.draft);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDrafting(false);
    }
  };

  return (
    <form action={action} className="inline-form" style={{ marginTop: "16px", borderTop: "1px solid rgba(72,53,36,.06)", paddingTop: "12px" }}>
      <input type="hidden" name="conversationId" value={conversationId} />
      <div style={{ display: "flex", gap: "8px" }}>
        <input 
          name="content" 
          placeholder="Type a response..." 
          required 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ flex: 1, border: "1px solid rgba(72,53,36,.12)", borderRadius: "12px", padding: "8px 12px", background: "rgba(255,252,247,.92)", fontSize: "0.88rem" }} 
        />
        <button 
          className="secondary-button" 
          type="button" 
          onClick={handleDraftAI} 
          disabled={drafting}
          style={{ padding: "8px 14px", borderRadius: "12px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
        >
          {drafting ? "Thinking..." : "✨ Draft AI"}
        </button>
        <button className="primary-button" type="submit" disabled={pending} style={{ padding: "8px 16px", borderRadius: "12px", fontSize: "0.85rem" }}>
          {pending ? "..." : "Send"}
        </button>
      </div>
      {state?.error ? <p className="form-error" style={{ fontSize: "0.8rem", marginTop: "4px" }}>{state.error}</p> : null}
      {state?.success ? <p className="form-success" style={{ fontSize: "0.8rem", marginTop: "4px" }}>{state.success}</p> : null}
    </form>
  );
}

export function MessageSplit({ conversations }: { conversations: Array<Conversation & { messages: { id: string; author: string; direction: string; content: string; createdAt: string }[]; customer: Customer }> }) { return <div className="platform-boards">{conversations.map((conversation) => <article key={conversation.id} className="board"><div className="board-header"><div><h4>{conversation.platform}</h4><p>{conversation.customer.name}</p></div><StatusBadge value={conversation.status} /></div><div className="message-stack">{conversation.messages.map((message) => <article key={message.id} className={`message-card ${message.direction}`}><div className="message-row"><strong>{message.author}</strong><span>{new Date(message.createdAt).toLocaleString()}</span></div><p className="message">{message.content}</p></article>)}</div><MessageReplyForm conversationId={conversation.id} /></article>)}</div>; }
export function SummaryCards({ items }: { items: { label: string; value: string | number; note: string }[] }) { return <div className="stats-grid">{items.map((item) => <article key={item.label} className="stat-card"><p className="eyebrow">{item.label}</p><div className="metric">{item.value}</div><div className="delta">{item.note}</div></article>)}</div>; }
export function DetailList({ title, items }: { title: string; items: (Order | SupportCase | ContentRequest)[] }) { return <article className="panel"><div className="panel-heading"><div><p className="eyebrow">Customer linked records</p><h3>{title}</h3></div></div><div className="context-list">{items.length ? items.map((item) => { const description = "productSummary" in item ? item.note : "resolutionNote" in item ? item.resolutionNote : item.note; return <article key={item.id} className="context-card"><strong>{"productSummary" in item ? item.productSummary : item.topic}</strong><p>{description}</p><div><StatusBadge value={item.status} /></div></article>; }) : <div className="empty-state">No records yet.</div>}</div></article>; }

export function AiContentStudio() {
  const [topic, setTopic] = useState("");
  const [campaign, setCampaign] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !campaign) return;
    setGenerating(true);
    setOutput("");
    try {
      const res = await fetch(`/api/ai/generate-content?topic=${encodeURIComponent(topic)}&campaign=${encodeURIComponent(campaign)}&platform=${encodeURIComponent(platform)}`);
      const data = await res.json();
      if (data.content) {
        setOutput(data.content);
      } else {
        setOutput(data.error || "Failed to generate ideas.");
      }
    } catch (err: any) {
      setOutput("Error connecting to generator endpoint: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="panel inline-form" style={{ background: "linear-gradient(135deg, rgba(255,250,241,.94), rgba(255,242,229,.96))" }}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Gemini AI Studio</p>
          <h3>AI Content Creator</h3>
        </div>
      </div>
      <form onSubmit={handleGenerate} className="form-grid" style={{ gap: "12px" }}>
        <input
          placeholder="Post Topic (e.g. Cookware Starters)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <input
          placeholder="Campaign Name (e.g. Premium Cook)"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          required
        />
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="Instagram">Instagram (DM / Post)</option>
          <option value="WhatsApp">WhatsApp Message</option>
          <option value="Website">Website Copy</option>
        </select>
        <button className="primary-button" type="submit" disabled={generating} style={{ gridColumn: "1 / -1" }}>
          {generating ? "Crafting Copy..." : "✨ Generate Captions & Hooks"}
        </button>
      </form>
      {output ? (
        <div style={{ marginTop: "16px", background: "rgba(255, 255, 255, 0.7)", borderRadius: "16px", border: "1px solid rgba(72,53,36,.06)", padding: "16px" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>Generated Variations</p>
          <pre style={{ whiteSpace: "pre-wrap", fontStyle: "normal", fontFamily: "var(--font-body), sans-serif", fontSize: "0.92rem", color: "var(--muted)", margin: 0 }}>
            {output}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
