import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/crm";
import { getCampaignDetail } from "@/lib/data/repository";
import { CampaignDetailsClient } from "./campaign-details-client";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignDetail(id);

  if (!campaign) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Campaign Detail"
        title={campaign.name}
        description={campaign.description}
        chip={campaign.status.toUpperCase().replace("_", " ")}
      />

      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "4px" }}>
        <Link
          href="/dashboard/campaigns"
          className="secondary-button"
          style={{ padding: "8px 16px", borderRadius: "12px", fontSize: "0.85rem" }}
        >
          ← Back to Campaigns
        </Link>
        <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Budget: <strong>{campaign.budget ? `$${campaign.budget}` : "N/A"}</strong> | Telegram Chat:{" "}
          <strong>{campaign.telegramChatId}</strong>
        </span>
      </div>

      <CampaignDetailsClient
        campaignId={campaign.id}
        campaignStatus={campaign.status}
        designs={campaign.designs}
        chatId={campaign.telegramChatId}
      />
    </>
  );
}
