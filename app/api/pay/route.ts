import { NextRequest, NextResponse } from "next/server";
import { verifyLead } from "@/lib/sign";
import { sendCapiEvent } from "@/lib/capi";
import { sendTelegram, esc } from "@/lib/telegram";
import { getRedis } from "@/lib/redis";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const METHODS: Record<string, string> = {
  naqd: "Naqd",
  karta: "Karta / o'tkazma",
  muddatli: "Muddatli to'lov (foizsiz)",
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const lead = verifyLead(String(body.t || ""));
  if (!lead) return NextResponse.json({ ok: false, error: "Havola yaroqsiz" }, { status: 403 });

  const amount = Math.round(Number(String(body.amount || "").replace(/\D/g, "")));
  if (!amount || amount < 1000 || amount > 1_000_000_000)
    return NextResponse.json({ ok: false, error: "Summani to'g'ri kiriting" }, { status: 422 });

  const method = METHODS[String(body.method)] ? String(body.method) : "naqd";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 300) : "";
  const force = body.force === true;

  const redis = getRedis();
  if (redis) {
    const prev = await redis.get<{ amount: number }>(`paid:${lead.id}`).catch(() => null);
    if (prev && !force) {
      return NextResponse.json(
        { ok: false, already: true, error: `Bu mijozga to'lov allaqachon kiritilgan: ${prev.amount.toLocaleString("ru-RU")} so'm` },
        { status: 409 }
      );
    }
  }

  const capi = await sendCapiEvent({
    eventName: "Purchase",
    eventId: `purchase_${lead.id}`,
    sourceUrl: lead.url,
    actionSource: process.env.META_PURCHASE_ACTION_SOURCE || "website",
    user: {
      phone: lead.p,
      name: lead.n,
      ip: lead.ip,
      ua: lead.ua,
      fbp: lead.fbp,
      fbc: lead.fbc,
      externalId: lead.p,
    },
    customData: {
      currency: site.currency,
      value: amount,
      content_name: site.product,
      payment_method: method,
      lead_id: lead.id,
    },
  });

  if (redis) {
    await redis
      .set(`paid:${lead.id}`, { amount, method, note, at: Date.now() }, { ex: 60 * 60 * 24 * 365 })
      .catch(() => null);
  }

  const text = [
    `✅ <b>To'lov kiritildi</b>`,
    ``,
    `👤 ${esc(lead.n)} — +${lead.p}`,
    `💰 <b>${amount.toLocaleString("ru-RU")} so'm</b>`,
    `💳 ${METHODS[method]}`,
    note ? `📝 ${esc(note)}` : "",
    `📡 Meta Purchase: ${capi.ok ? "yuborildi ✅" : capi.skipped ? "sozlanmagan ⚠️" : "xato ❌"}`,
  ]
    .filter(Boolean)
    .join("\n");
  await sendTelegram(text);

  return NextResponse.json({ ok: true, capi: capi.ok });
}
