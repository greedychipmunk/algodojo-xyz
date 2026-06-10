import "server-only";

/**
 * Thin wrapper around the Telegram Bot API sendMessage endpoint.
 *
 * The bot token and chat id are read from environment variables and never
 * leave the server. Returns true on successful delivery, false otherwise.
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error(
      "Telegram is not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.",
    );
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    );

    if (!res.ok) {
      console.error(
        `Telegram sendMessage failed: ${res.status} ${res.statusText}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram sendMessage threw:", error);
    return false;
  }
}
