"use client";
import { useActionState } from "react";
import { createCampaignAction } from "@/app/dashboard/actions";

function FormFeedback({ state }: { state: { error?: string; success?: string } | null }) {
  if (state?.error) return <p className="form-error">{state.error}</p>;
  if (state?.success) return <p className="form-success">{state.success}</p>;
  return null;
}

export function CampaignForm() {
  const [state, action, pending] = useActionState(createCampaignAction, null);

  return (
    <form action={action} className="inline-form panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">New Campaign</p>
          <h3>Create Custom Campaign</h3>
        </div>
      </div>
      <div className="form-grid">
        <div style={{ gridColumn: "1 / -1", display: "grid", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text)" }}>Campaign Name</label>
          <input name="name" placeholder="e.g. Summer Culinary Launch" required />
        </div>
        
        <div style={{ gridColumn: "1 / -1", display: "grid", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text)" }}>Description & Objective</label>
          <textarea 
            name="description" 
            placeholder="Outline campaign goals, key messages, and target products..." 
            rows={4} 
            required 
          />
        </div>

        <div style={{ display: "grid", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text)" }}>Budget ($)</label>
          <input name="budget" type="number" min="0" placeholder="e.g. 1500" />
        </div>

        <div style={{ display: "grid", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text)" }}>Telegram Chat ID</label>
          <input name="telegramChatId" placeholder="e.g. -10022334455" required defaultValue="-10022334455" />
        </div>
      </div>
      
      <FormFeedback state={state} />
      
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Creating..." : "🚀 Create & Send for Approval"}
      </button>
      
      <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0" }}>
        * Creating a campaign will send an interactive Telegram message with "Approve" and "Reject" buttons to the specified Telegram Chat ID.
      </p>
    </form>
  );
}
