import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { seedData } from "@/lib/data/seed";
import { handleAutoReply } from "@/lib/integrations/auto-responder";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.event !== "message_received") {
      return NextResponse.json({ ok: true });
    }

    const chatId = body.chat_id;
    const text = body.message;
    const accountType = body.account_type;

    if (!chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    const platform = accountType === "INSTAGRAM" ? "Instagram" : "WhatsApp";
    const senderName = body.sender?.attendee_name || `${platform} User`;
    const senderProviderId = body.sender?.attendee_provider_id;
    const connectedUserId = body.account_info?.user_id;

    // Determine direction
    const direction =
      senderProviderId && connectedUserId && senderProviderId === connectedUserId
        ? "outbound"
        : "inbound";

    const author = direction === "outbound" ? "Ops Admin" : senderName;
    const tagPattern = `unipile_chat:${chatId}`;

    console.log(`[Unipile Webhook Inbound] Received ${direction} message on ${platform} (Chat: ${chatId}): "${text}"`);

    if (hasSupabaseCredentials()) {
      const supabase = await createServerSupabase();
      if (supabase) {
        // 1. Search for customer with tag: unipile_chat:<chatId>
        const { data: customerSearch } = await supabase
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
              name: senderName,
              email: `unipile_${chatId}@example.com`,
              phone: "WhatsApp/Instagram Direct",
              city: "",
              value_tier: "Lead",
              intent: `${platform} Direct Contact`,
              journey: "Inbound Lead",
              note: `Created automatically via Unipile ${platform} integration.`,
              tags: [platform, tagPattern],
            })
            .select("*")
            .single();

          if (createCustErr) throw createCustErr;
          customer = newCustomer;
        }

        // 2. Find or create open conversation on platform
        const { data: convSearch } = await supabase
          .from("conversations")
          .select("*")
          .eq("customer_id", customer.id)
          .eq("platform", platform)
          .eq("source", tagPattern)
          .eq("status", "open")
          .limit(1);

        let conversation = convSearch?.[0];

        if (!conversation) {
          const { data: newConv, error: createConvErr } = await supabase
            .from("conversations")
            .insert({
              customer_id: customer.id,
              platform: platform,
              subject: `Unipile ${platform} Chat`,
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
          .eq("direction", direction)
          .eq("content", text)
          .limit(1);

        if (duplicateCheck && duplicateCheck.length > 0) {
          console.log(`[Unipile Webhook] Duplicate message detected in DB. Skipping processing.`);
          return NextResponse.json({ ok: true });
        }

        // 4. Insert message
        const { error: msgErr } = await supabase
          .from("conversation_messages")
          .insert({
            conversation_id: conversation.id,
            author,
            direction,
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
        if (direction === "inbound" && process.env.AUTO_RESPONDER !== "false") {
          handleAutoReply(conversation.id, platform, tagPattern).catch((e) =>
            console.error("[Unipile Auto-Responder Trigger Error]", e)
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
        id: `cust-unipile-${chatId}`,
        name: senderName,
        email: `unipile_${chatId}@example.com`,
        phone: "WhatsApp/Instagram Direct",
        city: "",
        valueTier: "Lead",
        intent: `${platform} Direct Contact`,
        journey: "Inbound Lead",
        note: `Created automatically via Unipile ${platform} integration.`,
        tags: [platform, tagPattern],
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };
      seedData.customers.push(customer);
    }

    let conversation = seedData.conversations.find(
      (c) =>
        c.customerId === customer.id &&
        c.platform === platform &&
        c.source === tagPattern &&
        c.status === "open"
    );

    if (!conversation) {
      conversation = {
        id: `conv-unipile-${chatId}`,
        customerId: customer.id,
        platform,
        subject: `Unipile ${platform} Chat`,
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
        m.direction === direction &&
        m.content === text
    );

    if (duplicateCheck) {
      console.log(`[Unipile Webhook Mock] Duplicate message detected in memory. Skipping processing.`);
      return NextResponse.json({ ok: true });
    }

    const newMessage = {
      id: `msg-unipile-${Date.now()}`,
      conversationId: conversation.id,
      author,
      direction: direction as "inbound" | "outbound",
      content: text,
      createdAt: new Date().toISOString(),
    };
    seedData.messages.push(newMessage);
    conversation.updatedAt = new Date().toISOString();
    customer.lastActivityAt = new Date().toISOString();

    // Trigger Auto-Responder
    if (direction === "inbound" && process.env.AUTO_RESPONDER !== "false") {
      handleAutoReply(conversation.id, platform, tagPattern).catch((e) =>
        console.error("[Unipile Auto-Responder Trigger Error]", e)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("[Unipile Webhook Exception]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
