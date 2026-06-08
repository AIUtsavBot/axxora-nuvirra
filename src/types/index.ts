export type PlatformKey = "Website" | "WhatsApp" | "Instagram" | "Email" | "Marketplace" | "Telegram";

export type ConversationStatus = "open" | "pending" | "closed";
export type OrderStatus = "draft" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type SupportStatus = "open" | "in_progress" | "resolved";
export type ContentStatus = "new" | "reviewing" | "approved" | "completed";

export interface CompanyContextItem { id: string; title: string; detail: string; }
export interface PriorityItem { id: string; title: string; level: "High" | "Medium" | "Low"; }
export interface DashboardMetric { label: string; value: string; delta: string; }

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  valueTier: string;
  intent: string;
  journey: string;
  note: string;
  tags: string[];
  createdAt: string;
  lastActivityAt: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  platform: PlatformKey;
  subject: string;
  status: ConversationStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  author: string;
  direction: "inbound" | "outbound";
  content: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  productSummary: string;
  quantity: number;
  status: OrderStatus;
  trackingReference: string;
  channel: PlatformKey;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportCase {
  id: string;
  customerId: string;
  topic: string;
  status: SupportStatus;
  priority: "low" | "medium" | "high";
  resolutionNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentRequest {
  id: string;
  customerId: string;
  topic: string;
  sourcePlatform: PlatformKey;
  status: ContentStatus;
  campaign: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  summary: string;
}

export interface PlatformDefinition {
  id: PlatformKey;
  label: string;
  description: string;
}

export type CampaignStatus = "pending_approval" | "approved" | "rejected";
export type DesignStatus = "pending_approval" | "approved" | "rejected";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  budget?: number;
  telegramChatId: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDesign {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  imageUrl: string;
  status: DesignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NuvirraSeedData {
  companyName: string;
  companySummary: string;
  companyHealth: string;
  metrics: DashboardMetric[];
  context: CompanyContextItem[];
  priorities: PriorityItem[];
  platforms: PlatformDefinition[];
  products: Product[];
  customers: Customer[];
  conversations: Conversation[];
  messages: ConversationMessage[];
  orders: Order[];
  supportCases: SupportCase[];
  contentRequests: ContentRequest[];
  campaigns: Campaign[];
  campaignDesigns: CampaignDesign[];
}

export interface CustomerDetail extends Customer {
  conversations: Array<Conversation & { messages: ConversationMessage[] }>;
  orders: Order[];
  supportCases: SupportCase[];
  contentRequests: ContentRequest[];
}

export interface ActivityEntry {
  id: string;
  type: "message" | "order" | "support" | "content";
  title: string;
  body: string;
  meta: string;
  createdAt: string;
  platform?: PlatformKey;
}
