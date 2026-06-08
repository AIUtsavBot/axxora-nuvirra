import { revalidatePath } from "next/cache";
import { getConversations } from "@/lib/data/repository";
import { generateWithGemini } from "./gemini";
import { seedData } from "@/lib/data/seed";
import { sendTelegramMessage } from "./telegram";
import { sendUnipileMessage } from "./unipile";
import { hasSupabaseCredentials } from "../supabase/env";
import { createServerSupabase } from "../supabase/server";

export async function handleAutoReply(conversationId: string, platform: string, source: string) {
  try {
    console.log(`[Auto-Responder] Starting auto-reply generation for conversation: ${conversationId} (${platform})`);

    // 1. Retrieve conversation context using repository helper
    const conversations = await getConversations();
    const conversation = conversations.find((c) => c.id === conversationId);

    if (!conversation) {
      console.warn(`[Auto-Responder] Conversation ${conversationId} not found. Aborting auto-reply.`);
      return;
    }

    const customer = conversation.customer;
    // Get chronological history of message content
    const history = [...conversation.messages]
      .reverse()
      .map((m) => `${m.author} (${m.direction}): "${m.content}"`)
      .join("\n");

    const brandTone = seedData.context.find((ctx) => ctx.id === "ctx-1")?.detail ?? "";
    const catalog = seedData.context.find((ctx) => ctx.id === "ctx-2")?.detail ?? "";

    const systemInstruction = `You are Nuvirra's Automated Customer Support Assistant.
Nuvirra is a modern utensils and cookware own-brand.
Brand tone guidelines: ${brandTone}
Product catalog context: ${catalog}

Goal: Provide a helpful, concise, and professional auto-response to the customer.
Guidelines:
1. Be friendly and conversational.
2. Directly answer their last query or give a status update.
3. Keep the response short (1-3 sentences max).
4. Output ONLY the raw message text. Do not wrap in quotes or add signoffs like "Best regards".`;

    const prompt = `Customer Profile:
- Name: ${customer.name}
- City: ${customer.city}
- Intent: ${customer.intent}
- Value Tier: ${customer.valueTier}
- CRM Notes: ${customer.note}

Conversation History (Chrono):
${history}

Draft a brand-compliant reply to the customer's last message.`;

    const replyContent = await generateWithGemini(prompt, systemInstruction);

    if (!replyContent || replyContent.includes("Error generating response")) {
      console.warn(`[Auto-Responder] Failed to generate valid reply from Gemini. Aborting send.`);
      return;
    }

    console.log(`[Auto-Responder] Generated reply for ${customer.name}: "${replyContent}"`);

    // 2. Save outbound message to database
    if (hasSupabaseCredentials()) {
      const supabase = await createServerSupabase();
      if (supabase) {
        // Insert message
        const { error: msgErr } = await supabase.from("conversation_messages").insert({
          conversation_id: conversationId,
          author: "Nuvirra Assistant",
          direction: "outbound",
          content: replyContent,
        });

        if (msgErr) throw msgErr;

        // Update timestamps
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId);

        await supabase
          .from("customers")
          .update({ last_activity_at: new Date().toISOString() })
          .eq("id", customer.id);
      }
    } else {
      // Demo Mode Mutation
      const newMessage = {
        id: `msg-auto-${Date.now()}`,
        conversationId,
        author: "Nuvirra Assistant",
        direction: "outbound" as const,
        content: replyContent,
        createdAt: new Date().toISOString(),
      };
      seedData.messages.push(newMessage);
      
      const conv = seedData.conversations.find((c) => c.id === conversationId);
      if (conv) conv.updatedAt = new Date().toISOString();

      const cust = seedData.customers.find((c) => c.id === customer.id);
      if (cust) cust.lastActivityAt = new Date().toISOString();
    }

    // 3. Deliver message back to the external channel
    if (platform === "Telegram" && source.startsWith("telegram_chat:")) {
      const chatId = source.replace("telegram_chat:", "");
      await sendTelegramMessage(chatId, replyContent);
    } else if ((platform === "WhatsApp" || platform === "Instagram") && source.startsWith("unipile_chat:")) {
      const unipileChatId = source.replace("unipile_chat:", "");
      await sendUnipileMessage(unipileChatId, replyContent);
    }

    revalidatePath("/dashboard/inbox");
    revalidatePath(`/dashboard/customers/${customer.id}`);
    console.log(`[Auto-Responder] Auto-reply fully processed and delivered.`);
  } catch (error) {
    console.error("[Auto-Responder Exception]", error);
  }
}
