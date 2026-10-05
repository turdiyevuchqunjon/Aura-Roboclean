export const esc = (s: string) =>
  (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Button = { text: string; url: string };

async function sendOne(chatId: string, text: string, buttons?: Button[]) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  if (buttons?.length) payload.reply_markup = { inline_keyboard: buttons.map((b) => [b]) };
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json().catch(() => ({ ok: false }));
}

export async function sendTelegram(text: string, buttons?: Button[]) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = (process.env.TELEGRAM_CHAT_ID || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || !chats.length) {
    console.warn("[TG] Bot token yoki chat ID yo'q");
    return false;
  }
  const results = await Promise.all(
    chats.map(async (chatId) => {
      let r = await sendOne(chatId, text, buttons);
      // URL tugma rad etilsa (masalan, localhost), tugmasiz qayta yuboramiz — havola matnda bor
      if (!r.ok && buttons?.length) r = await sendOne(chatId, text);
      if (!r.ok) console.error("[TG] xato:", JSON.stringify(r));
      return r.ok;
    })
  );
  return results.some(Boolean);
}
