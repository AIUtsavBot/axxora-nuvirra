import Link from "next/link";
import { PageHero, StatusBadge, SummaryCards } from "@/components/crm";
import { getCampaigns } from "@/lib/data/repository";
import { CampaignForm } from "./campaign-form";

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  const total = campaigns.length;
  const pending = campaigns.filter((c) => c.status === "pending_approval").length;
  const approved = campaigns.filter((c) => c.status === "approved").length;
  const rejected = campaigns.filter((c) => c.status === "rejected").length;

  const stats = [
    { label: "Total Campaigns", value: total, note: "All registered campaigns" },
    { label: "Pending Approval", value: pending, note: "Awaiting Telegram reply" },
    { label: "Approved & Active", value: approved, note: "Active design pipelines" },
    { label: "Rejected Campaigns", value: rejected, note: "Declined on Telegram" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Campaigns"
        title="Custom Campaigns & Assets"
        description="Launch tailored marketing campaigns, request approval via Telegram interactive buttons, and manage generated kitchen designs."
        chip={`${approved} active campaigns`}
      />

      <SummaryCards items={stats} />

      <section className="context-grid">
        <div className="panel" style={{ display: "grid", gap: "16px", alignContent: "start" }}>
          <div className="panel-heading" style={{ marginBottom: "8px" }}>
            <div>
              <p className="eyebrow">Campaign Registry</p>
              <h3>Active Campaigns</h3>
            </div>
          </div>

          {campaigns.length > 0 ? (
            <div className="customer-grid" style={{ gridTemplateColumns: "1fr", gap: "14px" }}>
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="user-card"
                  style={{ display: "block", cursor: "pointer" }}
                >
                  <div className="user-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1, paddingRight: "16px" }}>
                      <strong style={{ fontSize: "1.08rem", color: "var(--text)" }}>{campaign.name}</strong>
                      <p
                        className="hero-copy"
                        style={{
                          margin: "6px 0 0",
                          fontSize: "0.85rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {campaign.description}
                      </p>
                    </div>
                    <StatusBadge value={campaign.status} />
                  </div>
                  <div
                    className="user-card-footer"
                    style={{
                      borderTop: "1px solid rgba(72, 53, 36, 0.06)",
                      paddingTop: "10px",
                      marginTop: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.8rem",
                      color: "var(--muted)",
                    }}
                  >
                    <span>💰 Budget: {campaign.budget ? `$${campaign.budget}` : "N/A"}</span>
                    <span>📱 Telegram Chat ID: {campaign.telegramChatId}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">No campaigns registered. Create one to begin.</div>
          )}
        </div>

        <CampaignForm />
      </section>
    </>
  );
}
