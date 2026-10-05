import type { Metadata } from "next";
import { verifyLead } from "@/lib/sign";
import { getRedis } from "@/lib/redis";
import PayForm from "@/components/PayForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "To'lov kiritish", robots: { index: false, follow: false } };

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t } = await searchParams;
  const lead = verifyLead(t);

  if (!lead || lead.id !== id) {
    return (
      <main className="pay-wrap">
        <div className="pay-card">
          <h1>Havola yaroqsiz</h1>
          <p className="muted">Bu havola noto'g'ri yoki o'zgartirilgan. Telegramdagi asl havoladan foydalaning.</p>
        </div>
      </main>
    );
  }

  let paid: { amount: number; method: string; at: number } | null = null;
  const redis = getRedis();
  if (redis) paid = await redis.get<{ amount: number; method: string; at: number }>(`paid:${lead.id}`).catch(() => null);

  const created = new Date(lead.ts * 1000).toLocaleString("ru-RU", { timeZone: "Asia/Samarkand" });

  return (
    <main className="pay-wrap">
      <div className="pay-card">
        <div className="pay-head">
          <span className="eyebrow">AURA RoboClean · Admin</span>
          <h1>To'lov kiritish</h1>
        </div>
        <dl className="pay-info">
          <div><dt>Mijoz</dt><dd>{lead.n}</dd></div>
          <div><dt>Telefon</dt><dd><a href={`tel:+${lead.p}`}>+{lead.p}</a></dd></div>
          <div><dt>Manzil</dt><dd>{lead.a}</dd></div>
          <div><dt>Ariza vaqti</dt><dd>{created}</dd></div>
          {lead.utm ? <div><dt>Manba</dt><dd>{lead.utm}</dd></div> : null}
        </dl>
        <PayForm token={t as string} paid={paid} />
      </div>
    </main>
  );
}
