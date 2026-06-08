import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { seedData } from "./seed";
import type { ActivityEntry, ContentRequest, Conversation, ConversationMessage, Customer, CustomerDetail, Order, PlatformDefinition, Product, SupportCase, Campaign, CampaignDesign } from "@/types";

function byDateDesc(a: { createdAt?: string; updatedAt?: string; lastActivityAt?: string }, b: { createdAt?: string; updatedAt?: string; lastActivityAt?: string }) {
  const aTime = a.updatedAt ?? a.createdAt ?? a.lastActivityAt ?? "";
  const bTime = b.updatedAt ?? b.createdAt ?? b.lastActivityAt ?? "";
  return new Date(bTime).getTime() - new Date(aTime).getTime();
}

async function shouldUseSupabase() {
  if (!hasSupabaseCredentials()) return false;
  const supabase = await createServerSupabase();
  if (!supabase) return false;
  const { data } = await supabase.auth.getUser();
  return Boolean(data.user);
}

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    city: String(row.city ?? ""),
    valueTier: String(row.value_tier ?? ""),
    intent: String(row.intent ?? ""),
    journey: String(row.journey ?? ""),
    note: String(row.note ?? ""),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    createdAt: String(row.created_at ?? new Date().toISOString()),
    lastActivityAt: String(row.last_activity_at ?? new Date().toISOString()),
  };
}

function mapConversation(row: Record<string, unknown>): Conversation {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    platform: row.platform as Conversation["platform"],
    subject: String(row.subject ?? ""),
    status: row.status as Conversation["status"],
    source: String(row.source ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapMessage(row: Record<string, unknown>): ConversationMessage {
  return {
    id: String(row.id),
    conversationId: String(row.conversation_id),
    author: String(row.author ?? ""),
    direction: row.direction as ConversationMessage["direction"],
    content: String(row.content ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    productSummary: String(row.product_summary ?? ""),
    quantity: Number(row.quantity ?? 0),
    status: row.status as Order["status"],
    trackingReference: String(row.tracking_reference ?? ""),
    channel: row.channel as Order["channel"],
    note: String(row.note ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapSupportCase(row: Record<string, unknown>): SupportCase {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    topic: String(row.topic ?? ""),
    status: row.status as SupportCase["status"],
    priority: row.priority as SupportCase["priority"],
    resolutionNote: String(row.resolution_note ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapContentRequest(row: Record<string, unknown>): ContentRequest {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    topic: String(row.topic ?? ""),
    sourcePlatform: row.source_platform as ContentRequest["sourcePlatform"],
    status: row.status as ContentRequest["status"],
    campaign: String(row.campaign ?? ""),
    note: String(row.note ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    budget: row.budget ? Number(row.budget) : undefined,
    telegramChatId: String(row.telegram_chat_id ?? ""),
    status: row.status as Campaign["status"],
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapCampaignDesign(row: Record<string, unknown>): CampaignDesign {
  return {
    id: String(row.id),
    campaignId: String(row.campaign_id),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    imageUrl: String(row.image_url ?? ""),
    status: row.status as CampaignDesign["status"],
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapPlatform(row: Record<string, unknown>): PlatformDefinition {
  return { id: row.id as PlatformDefinition["id"], label: String(row.label ?? row.id), description: String(row.description ?? "") };
}

function mapProduct(row: Record<string, unknown>): Product {
  return { id: String(row.id), name: String(row.name ?? ""), category: String(row.category ?? ""), summary: String(row.summary ?? "") };
}

async function getSupabaseData() {
  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const [customersRes, conversationsRes, messagesRes, ordersRes, supportRes, contentRes, platformsRes, productsRes, campaignsRes, campaignDesignsRes] = await Promise.all([
    supabase.from("customers").select("*").order("last_activity_at", { ascending: false }),
    supabase.from("conversations").select("*").order("updated_at", { ascending: false }),
    supabase.from("conversation_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*").order("updated_at", { ascending: false }),
    supabase.from("support_cases").select("*").order("updated_at", { ascending: false }),
    supabase.from("content_requests").select("*").order("updated_at", { ascending: false }),
    supabase.from("platforms").select("*"),
    supabase.from("products").select("*"),
    supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
    supabase.from("campaign_designs").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    customers: (customersRes.data ?? []).map(mapCustomer),
    conversations: (conversationsRes.data ?? []).map(mapConversation),
    messages: (messagesRes.data ?? []).map(mapMessage),
    orders: (ordersRes.data ?? []).map(mapOrder),
    supportCases: (supportRes.data ?? []).map(mapSupportCase),
    contentRequests: (contentRes.data ?? []).map(mapContentRequest),
    platforms: (platformsRes.data ?? []).map(mapPlatform),
    products: (productsRes.data ?? []).map(mapProduct),
    campaigns: (campaignsRes.data ?? []).map(mapCampaign),
    campaignDesigns: (campaignDesignsRes.data ?? []).map(mapCampaignDesign),
  };
}

async function getDataSource() {
  if (await shouldUseSupabase()) {
    const live = await getSupabaseData();
    if (live) {
      return {
        companyName: seedData.companyName,
        companySummary: seedData.companySummary,
        companyHealth: seedData.companyHealth,
        metrics: seedData.metrics,
        context: seedData.context,
        priorities: seedData.priorities,
        ...live,
      };
    }
  }
  return {
    companyName: seedData.companyName,
    companySummary: seedData.companySummary,
    companyHealth: seedData.companyHealth,
    metrics: seedData.metrics,
    context: seedData.context,
    priorities: seedData.priorities,
    customers: seedData.customers,
    conversations: seedData.conversations,
    messages: seedData.messages,
    orders: seedData.orders,
    supportCases: seedData.supportCases,
    contentRequests: seedData.contentRequests,
    platforms: seedData.platforms,
    products: seedData.products,
    campaigns: seedData.campaigns,
    campaignDesigns: seedData.campaignDesigns,
  };
}

export async function getDashboardData() {
  const source = await getDataSource();
  const openConversations = source.conversations.filter((item) => item.status !== "closed").length;
  const openOrders = source.orders.filter((item) => !["delivered", "cancelled"].includes(item.status)).length;
  const openSupport = source.supportCases.filter((item) => item.status !== "resolved").length;
  const openContent = source.contentRequests.filter((item) => item.status !== "completed").length;

  return {
    companyName: source.companyName,
    companySummary: source.companySummary,
    companyHealth: source.companyHealth,
    metrics: source.metrics,
    context: source.context,
    priorities: source.priorities,
    quickStats: { openConversations, openOrders, openSupport, openContent },
  };
}

export async function getCustomers() { const source = await getDataSource(); return [...source.customers].sort(byDateDesc); }
export async function getOrders() { const source = await getDataSource(); return [...source.orders].sort(byDateDesc); }
export async function getSupportCases() { const source = await getDataSource(); return [...source.supportCases].sort(byDateDesc); }
export async function getContentRequests() { const source = await getDataSource(); return [...source.contentRequests].sort(byDateDesc); }
export async function getPlatforms() { const source = await getDataSource(); return source.platforms; }
export async function getProducts() { const source = await getDataSource(); return source.products; }

export async function getConversations(filters?: { platform?: string; status?: string; search?: string }) {
  const source = await getDataSource();
  const search = filters?.search?.toLowerCase().trim();
  return source.conversations.filter((conversation) => {
    const customer = source.customers.find((item) => item.id === conversation.customerId);
    const matchesPlatform = !filters?.platform || filters.platform === "All" || conversation.platform === filters.platform;
    const matchesStatus = !filters?.status || filters.status === "all" || conversation.status === filters.status;
    const matchesSearch = !search || [conversation.subject, conversation.source, customer?.name, customer?.intent].filter(Boolean).join(" ").toLowerCase().includes(search);
    return matchesPlatform && matchesStatus && matchesSearch;
  }).map((conversation) => ({ ...conversation, customer: source.customers.find((item) => item.id === conversation.customerId) as Customer, messages: source.messages.filter((message) => message.conversationId === conversation.id).sort(byDateDesc) })).sort(byDateDesc);
}

export async function getCustomerDetail(customerId: string): Promise<CustomerDetail | null> {
  const source = await getDataSource();
  const customer = source.customers.find((item) => item.id === customerId);
  if (!customer) return null;
  return { ...customer, conversations: source.conversations.filter((item) => item.customerId === customerId).map((conversation) => ({ ...conversation, messages: source.messages.filter((message) => message.conversationId === conversation.id).sort(byDateDesc) })).sort(byDateDesc), orders: source.orders.filter((item) => item.customerId === customerId).sort(byDateDesc), supportCases: source.supportCases.filter((item) => item.customerId === customerId).sort(byDateDesc), contentRequests: source.contentRequests.filter((item) => item.customerId === customerId).sort(byDateDesc) };
}

export async function getCustomerTimeline(customerId: string): Promise<ActivityEntry[]> {
  const detail = await getCustomerDetail(customerId);
  if (!detail) return [];
  const messageEntries: ActivityEntry[] = detail.conversations.flatMap((conversation) => conversation.messages.map((message) => ({ id: message.id, type: "message", title: `${conversation.platform} ${message.direction === "inbound" ? "message" : "reply"}`, body: message.content, meta: `${message.author} | ${conversation.subject}`, createdAt: message.createdAt, platform: conversation.platform })));
  const orderEntries: ActivityEntry[] = detail.orders.map((order) => ({ id: order.id, type: "order", title: `Order ${order.status}`, body: `${order.productSummary} x${order.quantity}`, meta: order.trackingReference || "No tracking reference yet", createdAt: order.updatedAt, platform: order.channel }));
  const supportEntries: ActivityEntry[] = detail.supportCases.map((support) => ({ id: support.id, type: "support", title: `Support ${support.status}`, body: support.topic, meta: support.resolutionNote, createdAt: support.updatedAt }));
  const contentEntries: ActivityEntry[] = detail.contentRequests.map((content) => ({ id: content.id, type: "content", title: `Content ${content.status}`, body: content.topic, meta: `${content.sourcePlatform} | ${content.campaign}`, createdAt: content.updatedAt, platform: content.sourcePlatform }));
  return [...messageEntries, ...orderEntries, ...supportEntries, ...contentEntries].sort(byDateDesc);
}

export async function previewCsv(text: string, requiredColumns: string[]) {
  const Papa = (await import("papaparse")).default;
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  const headers = result.meta.fields ?? [];
  const missingColumns = requiredColumns.filter((column) => !headers.includes(column));
  const rowErrors = result.errors.map((error) => `${error.type}: row ${error.row} - ${error.message}`);
  return { headers, rows: result.data.slice(0, 10), totalRows: result.data.length, missingColumns, rowErrors, parsedRows: result.data };
}

export async function getCampaigns() {
  const source = await getDataSource();
  return [...source.campaigns].sort(byDateDesc);
}

export async function getCampaignDesigns(campaignId: string) {
  const source = await getDataSource();
  return [...source.campaignDesigns].filter(d => d.campaignId === campaignId).sort(byDateDesc);
}

export async function getCampaignDetail(campaignId: string) {
  const source = await getDataSource();
  const campaign = source.campaigns.find(c => c.id === campaignId);
  if (!campaign) return null;
  const designs = source.campaignDesigns.filter(d => d.campaignId === campaignId).sort(byDateDesc);
  return {
    ...campaign,
    designs
  };
}
