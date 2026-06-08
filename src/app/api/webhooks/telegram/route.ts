import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { seedData } from "@/lib/data/seed";
import { handleAutoReply } from "@/lib/integrations/auto-responder";
import { answerTelegramCallbackQuery, editTelegramMessageText, editTelegramMessageCaption } from "@/lib/integrations/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Process Telegram Callback Queries (Interactive Buttons)
    const callbackQuery = body.callback_query;
    if (callbackQuery) {
      const data = callbackQuery.data;
      const callbackQueryId = callbackQuery.id;
      const chatId = callbackQuery.message?.chat?.id;
      const messageId = callbackQuery.message?.message_id;

      if (data && callbackQueryId) {
        let answerText = "Action completed!";
        let editNeeded = false;
        let newContent = "";
        let isPhoto = false;

        const isSup = hasSupabaseCredentials();

        if (data.startsWith("approve_campaign:") || data.startsWith("reject_campaign:")) {
          const isApprove = data.startsWith("approve_campaign:");
          const campaignId = data.split(":")[1];
          const newStatus = isApprove ? "approved" : "rejected";

          let campaignName = "Campaign";
          let campaignDesc = "";
          let campaignBudget = "";

          if (isSup) {
            const supabase = await createServerSupabase();
            if (supabase) {
              const { data: campaign } = await supabase
                .from("campaigns")
                .select("*")
                .eq("id", campaignId)
                .single();
              if (campaign) {
                campaignName = campaign.name;
                campaignDesc = campaign.description;
                campaignBudget = campaign.budget ? `$${campaign.budget}` : "N/A";
                await supabase
                  .from("campaigns")
                  .update({ status: newStatus, updated_at: new Date().toISOString() })
                  .eq("id", campaignId);
              }
            }
          } else {
            const campaign = seedData.campaigns.find(c => c.id === campaignId);
            if (campaign) {
              campaignName = campaign.name;
              campaignDesc = campaign.description;
              campaignBudget = campaign.budget ? `$${campaign.budget}` : "N/A";
              campaign.status = newStatus;
              campaign.updatedAt = new Date().toISOString();
            }
          }

          answerText = `Campaign "${campaignName}" ${newStatus}!`;
          const statusIcon = isApprove ? "✅ Approved" : "❌ Rejected";
          newContent = `📢 *Campaign Approval Response*\n\n*Campaign:* ${campaignName}\n*Description:* ${campaignDesc}\n*Budget:* ${campaignBudget}\n\n*Status:* ${statusIcon}\n(Processed via Telegram button)`;
          editNeeded = true;
          isPhoto = false;
        } else if (data.startsWith("approve_design:") || data.startsWith("reject_design:")) {
          const isApprove = data.startsWith("approve_design:");
          const designId = data.split(":")[1];
          const newStatus = isApprove ? "approved" : "rejected";

          let designTitle = "Design";
          let designDesc = "";
          let campaignName = "Campaign";

          if (isSup) {
            const supabase = await createServerSupabase();
            if (supabase) {
              const { data: design } = await supabase
                .from("campaign_designs")
                .select("*, campaigns(name)")
                .eq("id", designId)
                .single();
              if (design) {
                designTitle = design.title;
                designDesc = design.description;
                campaignName = design.campaigns?.name ?? "Campaign";
                await supabase
                  .from("campaign_designs")
                  .update({ status: newStatus, updated_at: new Date().toISOString() })
                  .eq("id", designId);
              }
            }
          } else {
            const design = seedData.campaignDesigns.find(d => d.id === designId);
            if (design) {
              designTitle = design.title;
              designDesc = design.description;
              const campaign = seedData.campaigns.find(c => c.id === design.campaignId);
              campaignName = campaign ? campaign.name : "Campaign";
              design.status = newStatus;
              design.updatedAt = new Date().toISOString();
            }
          }

          answerText = `Design "${designTitle}" ${newStatus}!`;
          const statusIcon = isApprove ? "✅ Approved" : "❌ Rejected";
          newContent = `🎨 *Campaign Design Approval Response*\n\n*Campaign:* ${campaignName}\n*Design Title:* ${designTitle}\n*Description:* ${designDesc}\n\n*Status:* ${statusIcon}\n(Processed via Telegram button)`;
          editNeeded = true;
          isPhoto = true;
        }

        // Acknowledge callback query
        await answerTelegramCallbackQuery(callbackQueryId, answerText);

        // Edit Telegram message to reflect new state
        if (editNeeded && chatId && messageId) {
          if (isPhoto) {
            await editTelegramMessageCaption(String(chatId), messageId, newContent);
          } else {
            await editTelegramMessageText(String(chatId), messageId, newContent);
          }
        }

        revalidatePath("/dashboard/campaigns");
        if (data.includes("campaign:")) {
          const id = data.split(":")[1];
          revalidatePath(`/dashboard/campaigns/${id}`);
        } else if (data.includes("design:")) {
          // Revalidate campaigns page too
          revalidatePath("/dashboard/campaigns");
        }

        return NextResponse.json({ ok: true });
      }
    }

    const message = body.message;
    const text = message?.text;
    const chatId = message?.chat?.id;

    if (!chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    const firstName = message?.from?.first_name ?? "";
    const lastName = message?.from?.last_name ?? "";
    const name = `${firstName} ${lastName}`.trim() || `Telegram User ${chatId}`;
    const tagPattern = `telegram_chat:${chatId}`;

    console.log(`[Telegram Webhook Inbound] Received message from ${name} (Chat: ${chatId}): "${text}"`);

    if (hasSupabaseCredentials()) {
      const supabase = await createServerSupabase();
      if (supabase) {
        // 1. Search for customer with tag: telegram_chat:<chatId>
        const { data: customerSearch, error: searchErr } = await supabase
          .from("customers")
          .select("*")
          .contains("tags", [tagPattern])
          .limit(1);

        let customer = customerSearch?.[0];

        if (!customer) {
          // Create new customer
          const { data: newCustomer, error: createCustErr } = await supabase
            .from("customers")
            .insert({
              name,
              email: `telegram_${chatId}@example.com`,
              phone: "Telegram",
              city: "",
              value_tier: "Lead",
              intent: "Telegram Direct Inquiry",
              journey: "Inbound Lead",
              note: "Created automatically via Telegram Bot integration.",
              tags: ["Telegram", tagPattern],
            })
            .select("*")
            .single();

          if (createCustErr) throw createCustErr;
          customer = newCustomer;
        }

        // 2. Find or create open conversation on Telegram platform
        const { data: convSearch } = await supabase
          .from("conversations")
          .select("*")
          .eq("customer_id", customer.id)
          .eq("platform", "Telegram")
          .eq("source", tagPattern)
          .eq("status", "open")
          .limit(1);

        let conversation = convSearch?.[0];

        if (!conversation) {
          const { data: newConv, error: createConvErr } = await supabase
            .from("conversations")
            .insert({
              customer_id: customer.id,
              platform: "Telegram",
              subject: "Telegram Bot Chat",
              status: "open",
              source: tagPattern,
            })
            .select("*")
            .single();

          if (createConvErr) throw createConvErr;
          conversation = newConv;
        }

        // 3. Deduplication check
        const { data: duplicateCheck } = await supabase
          .from("conversation_messages")
          .select("id")
          .eq("conversation_id", conversation.id)
          .eq("direction", "inbound")
          .eq("content", text)
          .limit(1);

        if (duplicateCheck && duplicateCheck.length > 0) {
          console.log(`[Telegram Webhook] Duplicate message detected in DB. Skipping processing.`);
          return NextResponse.json({ ok: true });
        }

        // 4. Insert message
        const { error: msgErr } = await supabase
          .from("conversation_messages")
          .insert({
            conversation_id: conversation.id,
            author: customer.name,
            direction: "inbound",
            content: text,
          });

        if (msgErr) throw msgErr;

        // 5. Update last activity time
        await supabase
          .from("customers")
          .update({ last_activity_at: new Date().toISOString() })
          .eq("id", customer.id);

        revalidatePath("/dashboard/inbox");
        revalidatePath(`/dashboard/customers/${customer.id}`);

        // 6. Trigger Auto-Responder
        if (process.env.AUTO_RESPONDER !== "false") {
          handleAutoReply(conversation.id, "Telegram", tagPattern).catch((e) =>
            console.error("[Telegram Auto-Responder Trigger Error]", e)
          );
        }

        return NextResponse.json({ ok: true });
      }
    }

    // --- Demo Mode Fallback ---
    let customer = seedData.customers.find((c) =>
      c.tags.includes(tagPattern)
    );

    if (!customer) {
      customer = {
        id: `cust-tg-${chatId}`,
        name,
        email: `telegram_${chatId}@example.com`,
        phone: "Telegram",
        city: "",
        valueTier: "Lead",
        intent: "Telegram Direct Inquiry",
        journey: "Inbound Lead",
        note: "Created automatically via Telegram Bot integration.",
        tags: ["Telegram", tagPattern],
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };
      seedData.customers.push(customer);
    }

    let conversation = seedData.conversations.find(
      (c) =>
        c.customerId === customer.id &&
        c.platform === "Telegram" &&
        c.source === tagPattern &&
        c.status === "open"
    );

    if (!conversation) {
      conversation = {
        id: `conv-tg-${chatId}`,
        customerId: customer.id,
        platform: "Telegram",
        subject: "Telegram Bot Chat",
        status: "open",
        source: tagPattern,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      seedData.conversations.push(conversation);
    }

    // Deduplication check for Demo Mode
    const duplicateCheck = seedData.messages.find(
      (m) =>
        m.conversationId === conversation.id &&
        m.direction === "inbound" &&
        m.content === text
    );

    if (duplicateCheck) {
      console.log(`[Telegram Webhook Mock] Duplicate message detected in memory. Skipping processing.`);
      return NextResponse.json({ ok: true });
    }

    const newMessage = {
      id: `msg-tg-in-${Date.now()}`,
      conversationId: conversation.id,
      author: customer.name,
      direction: "inbound" as const,
      content: text,
      createdAt: new Date().toISOString(),
    };
    seedData.messages.push(newMessage);
    conversation.updatedAt = new Date().toISOString();
    customer.lastActivityAt = new Date().toISOString();

    // Trigger Auto-Responder
    if (process.env.AUTO_RESPONDER !== "false") {
      handleAutoReply(conversation.id, "Telegram", tagPattern).catch((e) =>
        console.error("[Telegram Auto-Responder Trigger Error]", e)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("[Telegram Webhook Exception]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
