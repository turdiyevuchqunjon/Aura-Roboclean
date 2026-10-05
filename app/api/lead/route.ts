import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { signLead, type LeadPayload } from "@/lib/sign";
import { sendCapiEvent, normalizePhone } from "@/lib/capi";
import { sendTelegram, esc } from "@/lib/telegram";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  // Honeypot — botlar to'ldiradi, odamlar ko'rmaydi
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 80);
  const phone = normalizePhone(clean(body.phone, 30));
  const address = clean(body.address, 200);

  if (name.length < 2) return NextResponse.json({ ok: false, error: "Ismingizni kiriting" }, { status: 422 });
  if (!/^998\d{9}$/.test(phone))
    return NextResponse.json({ ok: false, error: "Telefon raqam noto'g'ri" }, { status: 422 });
  if (address.length < 3) return NextResponse.json({ ok: false, error: "Manzilni kiriting" }, { status: 422 });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const ua = req.headers.get("user-agent") || "";
  const eventId = clean(body.eventId, 80) || crypto.randomUUID();
  const sourceUrl = clean(body.sourceUrl, 500);
  const fbp = clean(body.fbp, 200);
  const fbc = clean(body.fbc, 300);
  const utm = clean(body.utm, 300);

  // Oddiy spam himoyasi: bitta raqamdan 2 daqiqada bir marta
  const redis = getRedis();
  if (redis) {
    const dup = await redis.set(`lead:lock:${phone}`, 1, { nx: true, ex: 120 }).catch(() => "OK");
    if (dup === null) return NextResponse.json({ ok: true, duplicate: true });
  }

  const id = crypto.randomBytes(6).toString("hex");
  const payload: LeadPayload = {
    id,
    n: name,
    p: phone,
    a: address,
    ts: Math.floor(Date.now() / 1000),
    fbp: fbp || undefined,
    fbc: fbc || undefined,
    ip: ip || undefined,
    ua: ua.slice(0, 220) || undefined,
    url: sourceUrl.split("?")[0] || undefined,
    utm: utm || undefined,
  };
  const token = signLead(payload);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
  const payUrl = `${siteUrl}/pay/${id}?t=${token}`;

  if (redis) {
    await redis.set(`lead:${id}`, { ...payload, status: "new" }, { ex: 60 * 60 * 24 * 180 }).catch(() => null);
  }

  const time = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Samarkand" });
  const lines: (string | null)[] = [
    `🧹 <b>Yangi ariza — RoboClean Pro</b>`,
    ``,
    `👤 <b>Ism:</b> ${esc(name)}`,
    `📞 <b>Tel:</b> +${phone}`,
    `📍 <b>Manzil:</b> ${esc(address)}`,
    utm ? `🏷 <b>UTM:</b> ${esc(utm)}` : null,
    ``,
    `🕒 ${time}`,
    ``,
    `💳 <a href="${esc(payUrl)}">To'lovni kiritish</a>`,
  ];
  const text = lines.filter((l) => l !== null).join("\n");

  const [tgOk] = await Promise.all([
    sendTelegram(text, [{ text: "💳 To'lov kiritish", url: payUrl }]),
    sendCapiEvent({
      eventName: "Lead",
      eventId,
      sourceUrl,
      user: { phone, name, ip, ua, fbp, fbc, externalId: phone },
      customData: { content_name: "RoboClean Pro — bepul demonstratsiya", lead_id: id },
    }),
  ]);

  if (process.env.NODE_ENV !== "production") console.log("[LEAD] to'lov havolasi:", payUrl);
  if (!tgOk) console.error("[LEAD] Telegramga yuborilmadi:", phone, name);
  return NextResponse.json({ ok: true });
}
