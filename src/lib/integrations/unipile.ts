export async function sendUnipileMessage(chatId: string, text: string) {
  const token = process.env.UNIPILE_API_TOKEN;
  const baseUrl = process.env.UNIPILE_BASE_URL || "https://api.unipile.com";

  if (!token) {
    console.log(`[Unipile Mock] Outbound message to chat ${chatId}: ${text}`);
    return;
  }

  try {
    const url = `${baseUrl.replace(/\/$/, "")}/api/v1/chats/${chatId}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-KEY": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Unipile Error Response]", err);
    } else {
      console.log(`[Unipile] Outbound message sent successfully to chat ${chatId}`);
    }
  } catch (error) {
    console.error("[Unipile API Error]", error);
  }
}
