import type { NuvirraSeedData } from "@/types";
import { loadLocalDb, saveLocalDb, createPersistentProxy } from "./persistence";

const rawSeedData: NuvirraSeedData = {
  companyName: "Nuvirra",
  companySummary:
    "Nuvirra is a modern utensil and cookware own-brand. This CRM helps the team manage customer conversations, product guidance, order workflows, support resolution, and content-driven leads from one internal workspace.",
  companyHealth: "91% response continuity",
  metrics: [
    { label: "Unified users", value: "186", delta: "+17 this week" },
    { label: "Messages synced", value: "2,914", delta: "Cross-channel traffic rising" },
    { label: "Platforms live", value: "5", delta: "Website, WhatsApp, Instagram, Email, Marketplace" },
    { label: "Open operations", value: "28", delta: "Orders, support, and content combined" }
  ],
  context: [
    { id: "ctx-1", title: "Brand tone", detail: "Friendly, modern, engaging, and slightly premium. Help customers choose confidently." },
    { id: "ctx-2", title: "Core catalog", detail: "Kitchen utensils, cookware, and daily-use kitchen products across modern home-cooking use cases." },
    { id: "ctx-3", title: "Current operating model", detail: "Manual entry plus CSV import in v1, with product, order, support, and content workflows connected to one customer record." }
  ],
  priorities: [
    { id: "p-1", title: "Keep product detail consistent across Instagram, website, and WhatsApp", level: "High" },
    { id: "p-2", title: "Reduce repeated tracking questions by linking support and order data", level: "Medium" },
    { id: "p-3", title: "Convert content-led visitors into order-ready leads faster", level: "Low" }
  ],
  platforms: [
    { id: "Website", label: "Website", description: "Customer inquiry and product discovery forms" },
    { id: "WhatsApp", label: "WhatsApp", description: "Direct buyer assistance and support follow-up" },
    { id: "Instagram", label: "Instagram", description: "Content-driven discovery and product messaging" },
    { id: "Email", label: "Email", description: "Long-form support and order confirmation" },
    { id: "Marketplace", label: "Marketplace", description: "Marketplace-origin threads and order follow-up" },
    { id: "Telegram", label: "Telegram", description: "Telegram bot direct support channel" }
  ],
  products: [
    { id: "prd-1", name: "Everyday Cookware Starter Set", category: "Cookware", summary: "Starter cookware bundle for daily home cooking." },
    { id: "prd-2", name: "Modern Ladle & Spatula Pair", category: "Utensils", summary: "Daily-use serving and cooking tools." },
    { id: "prd-3", name: "Family Meal Pan", category: "Cookware", summary: "Large-format pan for family-sized cooking." }
  ],
  customers: [
    { id: "cust-1", name: "Ananya Rao", email: "ananya@example.com", phone: "+91-9876500011", city: "Bengaluru", valueTier: "High intent", intent: "Cookware comparison before purchase", journey: "Choosing first premium set", note: "Discovered Nuvirra through Instagram and expects a consistent recommendation across channels.", tags: ["Cookware", "Lead", "Instagram source"], createdAt: "2026-06-01T10:15:00.000Z", lastActivityAt: "2026-06-05T08:40:00.000Z" },
    { id: "cust-2", name: "Rahul Mehta", email: "rahul@example.com", phone: "+91-9876500022", city: "Mumbai", valueTier: "Order-ready", intent: "Bundle clarification and purchase", journey: "Ready to buy after Q&A", note: "Needs a clean handoff from product discussion into order creation.", tags: ["Order", "Bundle buyer", "WhatsApp assist"], createdAt: "2026-05-29T13:00:00.000Z", lastActivityAt: "2026-06-05T06:20:00.000Z" },
    { id: "cust-3", name: "Megha Sinha", email: "megha@example.com", phone: "+91-9876500033", city: "Delhi", valueTier: "Repeat customer", intent: "Order tracking and support", journey: "Post-purchase follow-up", note: "Wants quick status checks using whichever identifier she already shared.", tags: ["Tracking", "Support", "Repeat buyer"], createdAt: "2026-05-24T09:30:00.000Z", lastActivityAt: "2026-06-04T18:15:00.000Z" },
    { id: "cust-4", name: "Vivaan Kapoor", email: "vivaan@example.com", phone: "+91-9876500044", city: "Hyderabad", valueTier: "Content lead", intent: "Product-led content inquiry", journey: "Content to commerce path", note: "Asks for more visual and content-led product storytelling.", tags: ["Content", "Awareness", "Potential conversion"], createdAt: "2026-05-31T11:20:00.000Z", lastActivityAt: "2026-06-05T09:05:00.000Z" }
  ],
  conversations: [
    { id: "conv-1", customerId: "cust-1", platform: "Instagram", subject: "Cookware reel inquiry", status: "open", source: "Organic social", createdAt: "2026-06-04T14:00:00.000Z", updatedAt: "2026-06-05T08:40:00.000Z" },
    { id: "conv-2", customerId: "cust-1", platform: "WhatsApp", subject: "Starter set recommendation", status: "pending", source: "Social handoff", createdAt: "2026-06-05T07:30:00.000Z", updatedAt: "2026-06-05T08:20:00.000Z" },
    { id: "conv-3", customerId: "cust-2", platform: "Website", subject: "Bundle suitability", status: "open", source: "Website form", createdAt: "2026-06-04T10:00:00.000Z", updatedAt: "2026-06-05T06:20:00.000Z" },
    { id: "conv-4", customerId: "cust-2", platform: "WhatsApp", subject: "Order creation details", status: "open", source: "Website follow-up", createdAt: "2026-06-05T05:55:00.000Z", updatedAt: "2026-06-05T06:20:00.000Z" },
    { id: "conv-5", customerId: "cust-3", platform: "WhatsApp", subject: "Tracking update request", status: "pending", source: "Support", createdAt: "2026-06-04T17:45:00.000Z", updatedAt: "2026-06-04T18:15:00.000Z" },
    { id: "conv-6", customerId: "cust-3", platform: "Email", subject: "Dispatch confirmation", status: "open", source: "Support escalation", createdAt: "2026-06-04T18:00:00.000Z", updatedAt: "2026-06-04T18:15:00.000Z" },
    { id: "conv-7", customerId: "cust-4", platform: "Instagram", subject: "Content inspiration request", status: "open", source: "DM", createdAt: "2026-06-05T08:30:00.000Z", updatedAt: "2026-06-05T09:05:00.000Z" }
  ],
  messages: [
    { id: "msg-1", conversationId: "conv-1", author: "Ananya", direction: "inbound", content: "Loved the cookware reel. Is this good for everyday Indian cooking?", createdAt: "2026-06-04T14:02:00.000Z" },
    { id: "msg-2", conversationId: "conv-1", author: "Social Team", direction: "outbound", content: "Yes, it is designed for daily use while still feeling premium.", createdAt: "2026-06-04T14:07:00.000Z" },
    { id: "msg-3", conversationId: "conv-2", author: "Ananya", direction: "inbound", content: "Which starter set would you suggest for a new kitchen?", createdAt: "2026-06-05T07:35:00.000Z" },
    { id: "msg-4", conversationId: "conv-2", author: "Sales Desk", direction: "outbound", content: "We recommend the Everyday Cookware Starter Set with essential utensils for your setup.", createdAt: "2026-06-05T08:20:00.000Z" },
    { id: "msg-5", conversationId: "conv-3", author: "Rahul", direction: "inbound", content: "Do you have a cookware and utensil combination for a family of four?", createdAt: "2026-06-04T10:05:00.000Z" },
    { id: "msg-6", conversationId: "conv-4", author: "Rahul", direction: "inbound", content: "I want to place an order today. What details do you need from me?", createdAt: "2026-06-05T06:00:00.000Z" },
    { id: "msg-7", conversationId: "conv-4", author: "Order Desk", direction: "outbound", content: "We need product choice, quantity, phone, email, and delivery details to create your order correctly.", createdAt: "2026-06-05T06:20:00.000Z" },
    { id: "msg-8", conversationId: "conv-5", author: "Megha", direction: "inbound", content: "Can you check my order status using my phone number?", createdAt: "2026-06-04T17:47:00.000Z" },
    { id: "msg-9", conversationId: "conv-5", author: "Support Desk", direction: "outbound", content: "Yes, we can track via phone, email, or username. Checking now.", createdAt: "2026-06-04T17:53:00.000Z" },
    { id: "msg-10", conversationId: "conv-6", author: "Megha", direction: "inbound", content: "Please confirm if the shipment has moved from processing to dispatch.", createdAt: "2026-06-04T18:15:00.000Z" },
    { id: "msg-11", conversationId: "conv-7", author: "Vivaan", direction: "inbound", content: "Can you share more posts around modern kitchen setups using your utensils and cookware?", createdAt: "2026-06-05T08:34:00.000Z" },
    { id: "msg-12", conversationId: "conv-7", author: "Content Team", direction: "outbound", content: "Absolutely. We create hooks, captions, and image prompts around premium daily-use kitchens.", createdAt: "2026-06-05T09:05:00.000Z" }
  ],
  orders: [
    { id: "ord-1", customerId: "cust-2", productSummary: "Everyday Cookware Starter Set + Modern Ladle & Spatula Pair", quantity: 1, status: "confirmed", trackingReference: "", channel: "WhatsApp", note: "Awaiting delivery address confirmation.", createdAt: "2026-06-05T06:30:00.000Z", updatedAt: "2026-06-05T06:45:00.000Z" },
    { id: "ord-2", customerId: "cust-3", productSummary: "Family Meal Pan", quantity: 1, status: "shipped", trackingReference: "NUV-TRK-88319", channel: "Marketplace", note: "Customer requested dispatch confirmation.", createdAt: "2026-06-01T10:00:00.000Z", updatedAt: "2026-06-04T17:50:00.000Z" }
  ],
  supportCases: [
    { id: "sup-1", customerId: "cust-3", topic: "Tracking not updated", status: "in_progress", priority: "high", resolutionNote: "Ops checking courier handoff against marketplace order reference.", createdAt: "2026-06-04T17:48:00.000Z", updatedAt: "2026-06-04T18:10:00.000Z" }
  ],
  contentRequests: [
    { id: "cnt-1", customerId: "cust-4", topic: "Modern kitchen setup content ideas", sourcePlatform: "Instagram", status: "reviewing", campaign: "Premium Everyday Cooking", note: "Strong lead for content-to-commerce conversion sequence.", createdAt: "2026-06-05T08:40:00.000Z", updatedAt: "2026-06-05T09:05:00.000Z" }
  ],
  campaigns: [
    {
      id: "camp-1",
      name: "Premium Cooking Launch",
      description: "Introduce the Everyday Cookware Starter Set to food bloggers and home chefs.",
      budget: 1500,
      telegramChatId: "-10022334455",
      status: "approved",
      createdAt: "2026-06-02T10:00:00.000Z",
      updatedAt: "2026-06-02T12:30:00.000Z"
    },
    {
      id: "camp-2",
      name: "Summer Cookware Fest",
      description: "Promote seasonal discount codes for the Everyday Cookware Starter Set.",
      budget: 800,
      telegramChatId: "-10022334455",
      status: "pending_approval",
      createdAt: "2026-06-08T09:00:00.000Z",
      updatedAt: "2026-06-08T09:00:00.000Z"
    }
  ],
  campaignDesigns: [
    {
      id: "dsg-1",
      campaignId: "camp-1",
      title: "Cookware Set Minimalist Counter",
      description: "Frying pan and ladle styled on a bright white marble kitchen counter.",
      imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
      status: "approved",
      createdAt: "2026-06-02T13:00:00.000Z",
      updatedAt: "2026-06-02T14:15:00.000Z"
    },
    {
      id: "dsg-2",
      campaignId: "camp-1",
      title: "Ladle & Spatula in action",
      description: "Stirring fresh vegetable soup in a boiling family meal pot.",
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
      status: "pending_approval",
      createdAt: "2026-06-08T10:15:00.000Z",
      updatedAt: "2026-06-08T10:15:00.000Z"
    }
  ]
};

export const seedData: NuvirraSeedData = createPersistentProxy(
  loadLocalDb(rawSeedData),
  () => saveLocalDb(seedData)
);
