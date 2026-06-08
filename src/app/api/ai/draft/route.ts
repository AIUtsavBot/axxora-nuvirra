import { NextResponse } from "next/server";
import { getConversations } from "@/lib/data/repository";
import { generateWithGemini } from "@/lib/integrations/gemini";
import { seedData } from "@/lib/data/seed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    const conversations = await getConversations();
    const conversation = conversations.find((c) => c.id === conversationId);

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const customer = conversation.customer;
    // Messages are sorted by date desc in repository.ts, reverse to get chronological order
    const history = [...conversation.messages]
      .reverse()
      .map((m) => `${m.author} (${m.direction}): "${m.content}"`)
      .join("\n");

    const brandTone = seedData.context.find((ctx) => ctx.id === "ctx-1")?.detail ?? "";
    const catalog = seedData.context.find((ctx) => ctx.id === "ctx-2")?.detail ?? "";

    const systemInstruction = `You are Nuvirra's AI Ops CRM Customer Assistant.
Nuvirra is a modern kitchen utensil and cookware own-brand.
Brand tone guidelines: ${brandTone}
Product catalog context: ${catalog}

Goal: Assist CRM operators by drafting a response to the customer.
Guidelines for your response:
1. Be helpful, concise, and professional.
2. Directly answer the customer's last query or address their status.
3. Match the Nuvirra brand tone.
4. Output ONLY the raw message text. Do not wrap in quotes. Do not add metadata, signatures (like "Best regards, Nuvirra"), or brackets.`;

    const prompt = `Customer Profile:
- Name: ${customer.name}
- City: ${customer.city}
- Intent: ${customer.intent}
- Value Tier: ${customer.valueTier}
- CRM Notes: ${customer.note}

Conversation History (Chrono):
${history}

Draft a brand-compliant reply to the customer's last message.`;

    const draft = await generateWithGemini(prompt, systemInstruction);

    return NextResponse.json({ draft });
  } catch (error: any) {
    console.error("[AI Draft API Exception]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
