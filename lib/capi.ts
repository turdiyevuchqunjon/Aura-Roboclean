import crypto from "crypto";

const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest("hex");

export function normalizePhone(raw: string): string {
  let d = (raw || "").replace(/\D/g, "");
  if (d.length === 9) d = "998" + d;
  return d;
}

type UserInput = {
  phone?: string;
  name?: string;
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
  externalId?: string;
};

function buildUserData(u: UserInput) {
  const data: Record<string, unknown> = { country: [sha256("uz")] };
  if (u.phone) data.ph = [sha256(normalizePhone(u.phone))];
  if (u.name) {
    const parts = u.name.trim().toLowerCase().split(/\s+/);
    if (parts[0]) data.fn = [sha256(parts[0])];
    if (parts.length > 1) data.ln = [sha256(parts.slice(1).join(" "))];
  }
  if (u.externalId) data.external_id = [sha256(u.externalId)];
  if (u.ip) data.client_ip_address = u.ip;
  if (u.ua) data.client_user_agent = u.ua;
  if (u.fbp) data.fbp = u.fbp;
  if (u.fbc) data.fbc = u.fbc;
  return data;
}

export async function sendCapiEvent(opts: {
  eventName: "Lead" | "Purchase" | string;
  eventId: string;
  sourceUrl?: string;
  actionSource?: string;
  user: UserInput;
  customData?: Record<string, unknown>;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) {
    console.warn("[CAPI] Pixel ID yoki token yo'q — event yuborilmadi");
    return { ok: false, skipped: true };
  }
  const version = process.env.META_API_VERSION || "v23.0";
  const event: Record<string, unknown> = {
    event_name: opts.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: opts.eventId,
    action_source: opts.actionSource || "website",
    user_data: buildUserData(opts.user),
  };
  if (opts.sourceUrl) event.event_source_url = opts.sourceUrl;
  if (opts.customData) event.custom_data = opts.customData;

  const body: Record<string, unknown> = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${version}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok) console.error("[CAPI] xato:", JSON.stringify(json));
    return { ok: res.ok, response: json };
  } catch (e) {
    console.error("[CAPI] tarmoq xatosi:", e);
    return { ok: false };
  }
}
