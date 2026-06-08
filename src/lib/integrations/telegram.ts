import type { Campaign, CampaignDesign } from "@/types";

export async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log(`[Telegram Bot Mock] Outbound message to chatId ${chatId}: ${text}`);
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Telegram Bot Error Response]", err);
    } else {
      console.log(`[Telegram Bot] Outbound message sent successfully to chatId ${chatId}`);
    }
  } catch (error) {
    console.error("[Telegram Bot API Error]", error);
  }
}

export async function sendTelegramCampaignApproval(chatId: string, campaign: Campaign) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const messageText = `📢 *New Campaign Approval Request*\n\n*Campaign:* ${campaign.name}\n*Description:* ${campaign.description}\n*Budget:* $${campaign.budget ?? "N/A"}\n\nPlease approve or reject this campaign below:`;

  if (!token) {
    console.log(`[Telegram Bot Mock] Outbound Campaign Approval Request to chatId ${chatId}:\n${messageText}`);
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Approve Campaign ✅", callback_data: `approve_campaign:${campaign.id}` },
              { text: "Reject Campaign ❌", callback_data: `reject_campaign:${campaign.id}` }
            ]
          ]
        }
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Telegram Bot Error Response]", err);
    }
  } catch (error) {
    console.error("[Telegram Bot API Error]", error);
  }
}

export async function sendTelegramDesignApproval(chatId: string, design: CampaignDesign, campaignName: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const captionText = `🎨 *New Campaign Design Approval Request*\n\n*Campaign:* ${campaignName}\n*Design Title:* ${design.title}\n*Description:* ${design.description}\n\nPlease review the design image and approve or reject below:`;

  if (!token) {
    console.log(`[Telegram Bot Mock] Outbound Design Approval Request to chatId ${chatId} with photo ${design.imageUrl}:\n${captionText}`);
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        photo: design.imageUrl,
        caption: captionText,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Approve Design ✅", callback_data: `approve_design:${design.id}` },
              { text: "Reject Design ❌", callback_data: `reject_design:${design.id}` }
            ]
          ]
        }
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Telegram Bot Error Response]", err);
    }
  } catch (error) {
    console.error("[Telegram Bot API Error]", error);
  }
}

export async function editTelegramMessageText(chatId: string, messageId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
  } catch (error) {
    console.error("[Telegram Bot Edit Text Error]", error);
  }
}

export async function editTelegramMessageCaption(chatId: string, messageId: number, caption: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/editMessageCaption`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        caption: caption,
        parse_mode: "Markdown",
      }),
    });
  } catch (error) {
    console.error("[Telegram Bot Edit Caption Error]", error);
  }
}

export async function answerTelegramCallbackQuery(callbackQueryId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
      }),
    });
  } catch (error) {
    console.error("[Telegram Bot Answer Callback Error]", error);
  }
}
