"use client";
import { useActionState, useTransition } from "react";
import { generateDesignAction, simulateTelegramCallbackAction } from "@/app/dashboard/actions";
import { StatusBadge } from "@/components/crm";

function FormFeedback({ state }: { state: { error?: string; success?: string } | null }) {
  if (state?.error) return <p className="form-error">{state.error}</p>;
  if (state?.success) return <p className="form-success">{state.success}</p>;
  return null;
}

export function CampaignDetailsClient({
  campaignId,
  campaignStatus,
  designs,
  chatId,
}: {
  campaignId: string;
  campaignStatus: string;
  designs: any[];
  chatId: string;
}) {
  const [designState, designAction, designPending] = useActionState(generateDesignAction, null);
  const [isSimulating, startTransition] = useTransition();

  const handleSimulate = (callbackData: string) => {
    startTransition(async () => {
      await simulateTelegramCallbackAction(callbackData);
    });
  };

  return (
    <div style={{ display: "grid", gap: "22px" }}>
      {/* Simulation Banner */}
      <div
        className="panel"
        style={{
          background: "linear-gradient(135deg, rgba(72,53,36,.03), rgba(72,53,36,.06))",
          border: "1px dashed var(--stroke)",
        }}
      >
        <p className="eyebrow" style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
          🛠️ Telegram Simulation Center
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "4px 0 14px" }}>
          Since Telegram Bot webhooks require public HTTPS endpoints, you can simulate interactive button presses directly from
          here. Clicking these will execute the identical logic as a Telegram webhook click.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {campaignStatus === "pending_approval" && (
            <>
              <button
                className="secondary-button"
                onClick={() => handleSimulate(`approve_campaign:${campaignId}`)}
                disabled={isSimulating}
                style={{ borderColor: "var(--teal)", color: "var(--teal)" }}
              >
                {isSimulating ? "Simulating..." : "Simulate Telegram Bot: Approve Campaign ✅"}
              </button>
              <button
                className="secondary-button"
                onClick={() => handleSimulate(`reject_campaign:${campaignId}`)}
                disabled={isSimulating}
                style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
              >
                {isSimulating ? "Simulating..." : "Simulate Telegram Bot: Reject Campaign ❌"}
              </button>
            </>
          )}

          {campaignStatus !== "pending_approval" && (
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>
              Campaign status is currently <StatusBadge value={campaignStatus} />.
              {campaignStatus === "approved" ? " You can generate designs and simulate approval buttons below." : " This campaign is rejected."}
            </p>
          )}
        </div>
      </div>

      <div className="context-grid">
        {/* Left Column: Designs Listing */}
        <div className="panel" style={{ display: "grid", gap: "16px", alignContent: "start" }}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Creative Assets</p>
              <h3>Generated Cookware Designs</h3>
            </div>
          </div>

          {campaignStatus !== "approved" ? (
            <div className="empty-state">Designs can only be generated once the campaign has been Approved.</div>
          ) : designs.length > 0 ? (
            <div style={{ display: "grid", gap: "18px" }}>
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="board"
                  style={{
                    padding: "16px",
                    display: "grid",
                    gap: "18px",
                    gridTemplateColumns: "140px 1fr",
                    background: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <div style={{ position: "relative", width: "140px", height: "140px", overflow: "hidden", borderRadius: "14px" }}>
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                        <strong style={{ fontSize: "1.05rem", color: "var(--text)" }}>{design.title}</strong>
                        <StatusBadge value={design.status} />
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "6px 0 0", lineHeight: "1.4" }}>
                        {design.description}
                      </p>
                    </div>

                    {/* Simulation buttons for design pending approval */}
                    {design.status === "pending_approval" && (
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <button
                          className="secondary-button"
                          onClick={() => handleSimulate(`approve_design:${design.id}`)}
                          disabled={isSimulating}
                          style={{
                            padding: "6px 12px",
                            fontSize: "0.75rem",
                            borderColor: "var(--teal)",
                            color: "var(--teal)",
                            borderRadius: "8px",
                          }}
                        >
                          Simulate Telegram Approval ✅
                        </button>
                        <button
                          className="secondary-button"
                          onClick={() => handleSimulate(`reject_design:${design.id}`)}
                          disabled={isSimulating}
                          style={{
                            padding: "6px 12px",
                            fontSize: "0.75rem",
                            borderColor: "var(--danger)",
                            color: "var(--danger)",
                            borderRadius: "8px",
                          }}
                        >
                          Simulate Telegram Rejection ❌
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No designs generated yet. Use the asset generator on the right.</div>
          )}
        </div>

        {/* Right Column: Generate Design Form */}
        {campaignStatus === "approved" ? (
          <form action={designAction} className="inline-form panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Asset Generator</p>
                <h3>Generate Design Asset</h3>
              </div>
            </div>

            <input type="hidden" name="campaignId" value={campaignId} />

            <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Design Title</label>
                <input name="title" placeholder="e.g. Frypan with Sizzling Garlic" required />
              </div>
              <div style={{ display: "grid", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Visual Prompt & Details</label>
                <textarea
                  name="description"
                  placeholder="Describe details, lighting, angles, cookware items..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <FormFeedback state={designState} />

            <button className="primary-button" type="submit" disabled={designPending}>
              {designPending ? "Generating..." : "✨ Generate & Request Telegram Review"}
            </button>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: 0 }}>
              * Generating a design automatically registers a curated cookware illustration and sends a Telegram photo approval
              message to chat ID: <strong>{chatId}</strong>.
            </p>
          </form>
        ) : (
          <div className="panel" style={{ height: "fit-content", display: "grid", placeItems: "center", minHeight: "180px" }}>
            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
              🔒 Design Generator is locked.<br />Approve the campaign using the simulation controls first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
