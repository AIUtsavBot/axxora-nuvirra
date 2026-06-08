"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { previewCsv } from "@/lib/data/repository";
import { seedData } from "@/lib/data/seed";
import { appendToGoogleSheet } from "@/lib/integrations/google-sheets";
import { sendTelegramMessage, sendTelegramCampaignApproval, sendTelegramDesignApproval } from "@/lib/integrations/telegram";
import { sendUnipileMessage } from "@/lib/integrations/unipile";

const campaignSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  budget: z.coerce.number().optional(),
  telegramChatId: z.string().min(1)
});

const designSchema = z.object({
  campaignId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(5)
});

const DESIGN_IMAGES = [
  "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80", // Premium Cookware Set
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", // Modern Kitchen with spices
  "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80", // Frying pan sizzling
  "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80", // Chef spatula and cooking oil
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80", // Gourmet dinner plating
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80", // Stirring soup in pot
  "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=800&q=80", // Cutting board with vegetables
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"  // Freshly cooked Italian pasta
];

const platformEnum = ["Website", "WhatsApp", "Instagram", "Email", "Marketplace", "Telegram"] as const;

const orderSchema = z.object({
  customerId: z.string().min(1),
  productSummary: z.string().min(3),
  quantity: z.coerce.number().min(1),
  status: z.enum(["draft", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
  trackingReference: z.string().optional(),
  channel: z.enum(platformEnum),
  note: z.string().optional()
});

const supportSchema = z.object({
  customerId: z.string().min(1),
  topic: z.string().min(3),
  status: z.enum(["open", "in_progress", "resolved"]),
  priority: z.enum(["low", "medium", "high"]),
  resolutionNote: z.string().optional()
});

const contentSchema = z.object({
  customerId: z.string().min(1),
  topic: z.string().min(3),
  sourcePlatform: z.enum(platformEnum),
  status: z.enum(["new", "reviewing", "approved", "completed"]),
  campaign: z.string().min(2),
  note: z.string().optional()
});

const conversationSchema = z.object({
  customerId: z.string().min(1),
  platform: z.enum(platformEnum),
  subject: z.string().min(3),
  status: z.enum(["open", "pending", "closed"]),
  source: z.string().min(2),
  messageAuthor: z.string().min(2),
  messageContent: z.string().min(3),
  messageDirection: z.enum(["inbound", "outbound"])
});

const replySchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1)
});

async function getSupabaseOrError() {
  if (!hasSupabaseCredentials()) return { error: "Supabase is not configured." };
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase client unavailable." };
  return { supabase };
}

export async function createOrderAction(_: { error?: string; success?: string } | null, formData: FormData) {
  const parsed = orderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const qty = parsed.data.quantity;
  const channel = parsed.data.channel;
  const note = parsed.data.note ?? "";
  const tracking = parsed.data.trackingReference ?? "";

  // 1. Sync to Google Sheets
  await appendToGoogleSheet("Orders", [
    parsed.data.customerId,
    parsed.data.productSummary,
    String(qty),
    parsed.data.status,
    channel,
    note,
    tracking,
    new Date().toISOString()
  ]);

  const result = await getSupabaseOrError();
  if ("error" in result) {
    // Demo Mode Mutation
    const newOrder = {
      id: `ord-mock-${Date.now()}`,
      customerId: parsed.data.customerId,
      productSummary: parsed.data.productSummary,
      quantity: qty,
      status: parsed.data.status,
      trackingReference: tracking,
      channel,
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    seedData.orders.push(newOrder);
    const customer = seedData.customers.find(c => c.id === parsed.data.customerId);
    if (customer) customer.lastActivityAt = new Date().toISOString();

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
    return { success: "Order created (Demo mode)." };
  }

  const { error } = await result.supabase.from("orders").insert({
    customer_id: parsed.data.customerId,
    product_summary: parsed.data.productSummary,
    quantity: qty,
    status: parsed.data.status,
    tracking_reference: tracking,
    channel,
    note
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
  return { success: "Order created." };
}

export async function createSupportAction(_: { error?: string; success?: string } | null, formData: FormData) {
  const parsed = supportSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const note = parsed.data.resolutionNote ?? "";

  // 1. Sync to Google Sheets
  await appendToGoogleSheet("Support", [
    parsed.data.customerId,
    parsed.data.topic,
    parsed.data.status,
    parsed.data.priority,
    note,
    new Date().toISOString()
  ]);

  const result = await getSupabaseOrError();
  if ("error" in result) {
    // Demo Mode Mutation
    const newSupport = {
      id: `sup-mock-${Date.now()}`,
      customerId: parsed.data.customerId,
      topic: parsed.data.topic,
      status: parsed.data.status,
      priority: parsed.data.priority,
      resolutionNote: note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    seedData.supportCases.push(newSupport);
    const customer = seedData.customers.find(c => c.id === parsed.data.customerId);
    if (customer) customer.lastActivityAt = new Date().toISOString();

    revalidatePath("/dashboard/support");
    revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
    return { success: "Support case created (Demo mode)." };
  }

  const { error } = await result.supabase.from("support_cases").insert({
    customer_id: parsed.data.customerId,
    topic: parsed.data.topic,
    status: parsed.data.status,
    priority: parsed.data.priority,
    resolution_note: note
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/support");
  revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
  return { success: "Support case created." };
}

export async function createContentAction(_: { error?: string; success?: string } | null, formData: FormData) {
  const parsed = contentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const note = parsed.data.note ?? "";

  // 1. Sync to Google Sheets
  await appendToGoogleSheet("Content", [
    parsed.data.customerId,
    parsed.data.topic,
    parsed.data.sourcePlatform,
    parsed.data.status,
    parsed.data.campaign,
    note,
    new Date().toISOString()
  ]);

  const result = await getSupabaseOrError();
  if ("error" in result) {
    // Demo Mode Mutation
    const newContent = {
      id: `cnt-mock-${Date.now()}`,
      customerId: parsed.data.customerId,
      topic: parsed.data.topic,
      sourcePlatform: parsed.data.sourcePlatform,
      status: parsed.data.status,
      campaign: parsed.data.campaign,
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    seedData.contentRequests.push(newContent);
    const customer = seedData.customers.find(c => c.id === parsed.data.customerId);
    if (customer) customer.lastActivityAt = new Date().toISOString();

    revalidatePath("/dashboard/content");
    revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
    return { success: "Content request created (Demo mode)." };
  }

  const { error } = await result.supabase.from("content_requests").insert({
    customer_id: parsed.data.customerId,
    topic: parsed.data.topic,
    source_platform: parsed.data.sourcePlatform,
    status: parsed.data.status,
    campaign: parsed.data.campaign,
    note
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/content");
  revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
  return { success: "Content request created." };
}

export async function createConversationAction(_: { error?: string; success?: string } | null, formData: FormData) {
  const parsed = conversationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const result = await getSupabaseOrError();
  if ("error" in result) {
    // Demo Mode Mutation
    const newConv = {
      id: `conv-mock-${Date.now()}`,
      customerId: parsed.data.customerId,
      platform: parsed.data.platform,
      subject: parsed.data.subject,
      status: parsed.data.status,
      source: parsed.data.source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const newMsg = {
      id: `msg-mock-${Date.now()}`,
      conversationId: newConv.id,
      author: parsed.data.messageAuthor,
      direction: parsed.data.messageDirection,
      content: parsed.data.messageContent,
      createdAt: new Date().toISOString()
    };
    seedData.conversations.push(newConv);
    seedData.messages.push(newMsg);
    const customer = seedData.customers.find(c => c.id === parsed.data.customerId);
    if (customer) customer.lastActivityAt = new Date().toISOString();

    revalidatePath("/dashboard/inbox");
    revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
    return { success: "Conversation created (Demo mode)." };
  }

  const { data: conversation, error: conversationError } = await result.supabase.from("conversations").insert({
    customer_id: parsed.data.customerId,
    platform: parsed.data.platform,
    subject: parsed.data.subject,
    status: parsed.data.status,
    source: parsed.data.source
  }).select("id").single();

  if (conversationError) return { error: conversationError.message };

  const { error: messageError } = await result.supabase.from("conversation_messages").insert({
    conversation_id: conversation.id,
    author: parsed.data.messageAuthor,
    direction: parsed.data.messageDirection,
    content: parsed.data.messageContent
  });

  if (messageError) return { error: messageError.message };
  revalidatePath("/dashboard/inbox");
  revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
  return { success: "Conversation created." };
}

export async function replyToConversationAction(_: { error?: string; success?: string } | null, formData: FormData) {
  const parsed = replySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { conversationId, content } = parsed.data;

  let platform = "";
  let source = "";
  let customerId = "";

  const result = await getSupabaseOrError();
  if ("error" in result) {
    // 1. Demo Mode Send
    const conversation = seedData.conversations.find(c => c.id === conversationId);
    if (!conversation) return { error: "Conversation not found." };
    
    platform = conversation.platform;
    source = conversation.source;
    customerId = conversation.customerId;

    const newMessage = {
      id: `msg-reply-${Date.now()}`,
      conversationId,
      author: "Ops Admin",
      direction: "outbound" as const,
      content,
      createdAt: new Date().toISOString()
    };
    seedData.messages.push(newMessage);
    conversation.updatedAt = new Date().toISOString();
    
    const customer = seedData.customers.find(c => c.id === customerId);
    if (customer) customer.lastActivityAt = new Date().toISOString();
  } else {
    // 2. Supabase Live Send
    const { data: conv, error: convErr } = await result.supabase
      .from("conversations")
      .select("platform, source, customer_id")
      .eq("id", conversationId)
      .single();

    if (convErr || !conv) return { error: convErr?.message || "Conversation not found." };

    platform = conv.platform;
    source = conv.source;
    customerId = conv.customer_id;

    const { error: msgErr } = await result.supabase.from("conversation_messages").insert({
      conversation_id: conversationId,
      author: "Ops Admin",
      direction: "outbound",
      content
    });

    if (msgErr) return { error: msgErr.message };

    await result.supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    await result.supabase
      .from("customers")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("id", customerId);
  }

  // 3. Trigger External Channel Integrations
  if (platform === "Telegram" && source.startsWith("telegram_chat:")) {
    const chatId = source.replace("telegram_chat:", "");
    await sendTelegramMessage(chatId, content);
  } else if ((platform === "WhatsApp" || platform === "Instagram") && source.startsWith("unipile_chat:")) {
    const unipileChatId = source.replace("unipile_chat:", "");
    await sendUnipileMessage(unipileChatId, content);
  }

  revalidatePath("/dashboard/inbox");
  revalidatePath(`/dashboard/customers/${customerId}`);
  return { success: "Reply sent." };
}

export async function previewImportAction(_: { error?: string; success?: string; preview?: string } | null, formData: FormData) {
  const csv = String(formData.get("csv") ?? ""); const kind = String(formData.get("kind") ?? "conversations");
  const requiredColumns = kind === "orders" ? ["customer_id", "product_summary", "quantity", "status", "channel"] : ["customer_id", "platform", "subject", "status", "author", "direction", "content"];
  const preview = await previewCsv(csv, requiredColumns);
  if (preview.missingColumns.length) return { error: `Missing columns: ${preview.missingColumns.join(", ")}` };
  return { success: `Parsed ${preview.totalRows} rows.`, preview: JSON.stringify({ headers: preview.headers, rows: preview.rows, totalRows: preview.totalRows, rowErrors: preview.rowErrors }, null, 2) };
}

export async function commitImportAction(_: { error?: string; success?: string } | null, formData: FormData) {
  const result = await getSupabaseOrError(); if ("error" in result) return { error: result.error };
  const csv = String(formData.get("csv") ?? ""); const kind = String(formData.get("kind") ?? "conversations");
  const requiredColumns = kind === "orders" ? ["customer_id", "product_summary", "quantity", "status", "channel"] : ["customer_id", "platform", "subject", "status", "author", "direction", "content"];
  const preview = await previewCsv(csv, requiredColumns);
  if (preview.missingColumns.length || preview.rowErrors.length) return { error: "Import blocked because the CSV preview has missing columns or row errors." };

  if (kind === "orders") {
    for (const row of preview.parsedRows) {
      const { data: existing } = await result.supabase.from("orders").select("id").eq("customer_id", row.customer_id).eq("product_summary", row.product_summary).eq("status", row.status).limit(1);
      if (existing?.length) continue;
      await result.supabase.from("orders").insert({ customer_id: row.customer_id, product_summary: row.product_summary, quantity: Number(row.quantity), status: row.status, tracking_reference: row.tracking_reference ?? "", channel: row.channel, note: row.note ?? "" });
    }
    revalidatePath("/dashboard/orders");
    return { success: `Imported ${preview.totalRows} order rows with duplicate skipping enabled.` };
  }

  for (const row of preview.parsedRows) {
    const { data: existing } = await result.supabase.from("conversations").select("id").eq("customer_id", row.customer_id).eq("platform", row.platform).eq("subject", row.subject).limit(1);
    let conversationId = existing?.[0]?.id as string | undefined;
    if (!conversationId) {
      const inserted = await result.supabase.from("conversations").insert({ customer_id: row.customer_id, platform: row.platform, subject: row.subject, status: row.status, source: row.source ?? "CSV import" }).select("id").single();
      conversationId = inserted.data?.id;
    }
    if (!conversationId) continue;
    const { data: duplicateMessage } = await result.supabase.from("conversation_messages").select("id").eq("conversation_id", conversationId).eq("author", row.author).eq("content", row.content).limit(1);
    if (duplicateMessage?.length) continue;
    await result.supabase.from("conversation_messages").insert({ conversation_id: conversationId, author: row.author, direction: row.direction, content: row.content });
  }

  revalidatePath("/dashboard/inbox");
  return { success: `Imported ${preview.totalRows} conversation rows with duplicate skipping enabled.` };
}

export async function createCampaignAction(_: { error?: string; success?: string } | null, formData: FormData) {
  const parsed = campaignSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { name, description, budget, telegramChatId } = parsed.data;

  const result = await getSupabaseOrError();
  if ("error" in result) {
    // Demo Mode
    const newCampaign = {
      id: `camp-mock-${Date.now()}`,
      name,
      description,
      budget,
      telegramChatId,
      status: "pending_approval" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    seedData.campaigns.push(newCampaign);

    // Try sending mock or real Telegram notification
    await sendTelegramCampaignApproval(telegramChatId, newCampaign);

    revalidatePath("/dashboard/campaigns");
    return { success: "Campaign created and sent for Telegram approval (Demo Mode)." };
  }

  // Supabase Mode
  const { data: campaign, error } = await result.supabase.from("campaigns").insert({
    name,
    description,
    budget,
    telegram_chat_id: telegramChatId,
    status: "pending_approval"
  }).select("*").single();

  if (error || !campaign) return { error: error?.message || "Failed to create campaign." };

  const typedCampaign = {
    id: campaign.id,
    name: campaign.name,
    description: campaign.description,
    budget: campaign.budget ? Number(campaign.budget) : undefined,
    telegramChatId: campaign.telegram_chat_id,
    status: campaign.status as any,
    createdAt: campaign.created_at,
    updatedAt: campaign.updated_at
  };

  await sendTelegramCampaignApproval(telegramChatId, typedCampaign);

  revalidatePath("/dashboard/campaigns");
  return { success: "Campaign created and sent for Telegram approval." };
}

export async function generateDesignAction(_: { error?: string; success?: string } | null, formData: FormData) {
  const parsed = designSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { campaignId, title, description } = parsed.data;

  // Select random image from design images list
  const imageUrl = DESIGN_IMAGES[Math.floor(Math.random() * DESIGN_IMAGES.length)];

  let campaignName = "Campaign";
  let telegramChatId = "";

  const result = await getSupabaseOrError();
  if ("error" in result) {
    // Demo Mode
    const campaign = seedData.campaigns.find(c => c.id === campaignId);
    if (!campaign) return { error: "Campaign not found." };

    campaignName = campaign.name;
    telegramChatId = campaign.telegramChatId;

    const newDesign = {
      id: `dsg-mock-${Date.now()}`,
      campaignId,
      title,
      description,
      imageUrl,
      status: "pending_approval" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    seedData.campaignDesigns.push(newDesign);

    await sendTelegramDesignApproval(telegramChatId, newDesign, campaignName);

    revalidatePath(`/dashboard/campaigns/${campaignId}`);
    revalidatePath("/dashboard/campaigns");
    return { success: "Design generated and sent for Telegram approval (Demo Mode)." };
  }

  // Supabase Mode
  const { data: campaign, error: campErr } = await result.supabase
    .from("campaigns")
    .select("name, telegram_chat_id")
    .eq("id", campaignId)
    .single();

  if (campErr || !campaign) return { error: campErr?.message || "Campaign not found." };
  campaignName = campaign.name;
  telegramChatId = campaign.telegram_chat_id;

  const { data: design, error } = await result.supabase.from("campaign_designs").insert({
    campaign_id: campaignId,
    title,
    description,
    image_url: imageUrl,
    status: "pending_approval"
  }).select("*").single();

  if (error || !design) return { error: error?.message || "Failed to create design." };

  const typedDesign = {
    id: design.id,
    campaignId: design.campaign_id,
    title: design.title,
    description: design.description,
    imageUrl: design.image_url,
    status: design.status as any,
    createdAt: design.created_at,
    updatedAt: design.updated_at
  };

  await sendTelegramDesignApproval(telegramChatId, typedDesign, campaignName);

  revalidatePath(`/dashboard/campaigns/${campaignId}`);
  revalidatePath("/dashboard/campaigns");
  return { success: "Design generated and sent for Telegram approval." };
}

export async function simulateTelegramCallbackAction(callbackData: string) {
  const isSup = hasSupabaseCredentials();
  const isApprove = callbackData.startsWith("approve_");
  const isCampaign = callbackData.includes("campaign");
  const id = callbackData.split(":")[1];
  const newStatus = isApprove ? "approved" : "rejected";

  if (isCampaign) {
    if (isSup) {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase
          .from("campaigns")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("id", id);
      }
    } else {
      const campaign = seedData.campaigns.find(c => c.id === id);
      if (campaign) {
        campaign.status = newStatus;
        campaign.updatedAt = new Date().toISOString();
      }
    }
    revalidatePath("/dashboard/campaigns");
    revalidatePath(`/dashboard/campaigns/${id}`);
    return { success: `Simulated Telegram: Campaign status changed to ${newStatus}.` };
  } else {
    let campaignId = "";
    if (isSup) {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data: design } = await supabase
          .from("campaign_designs")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select("campaign_id")
          .single();
        if (design) campaignId = design.campaign_id;
      }
    } else {
      const design = seedData.campaignDesigns.find(d => d.id === id);
      if (design) {
        design.status = newStatus;
        design.updatedAt = new Date().toISOString();
        campaignId = design.campaignId;
      }
    }
    revalidatePath("/dashboard/campaigns");
    if (campaignId) revalidatePath(`/dashboard/campaigns/${campaignId}`);
    return { success: `Simulated Telegram: Design status changed to ${newStatus}.` };
  }
}
