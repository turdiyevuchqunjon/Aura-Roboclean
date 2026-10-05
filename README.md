# AURA RoboClean Pro — landing (Next.js App Router)

Vision Group tomonidan @robaclean_aura Instagram tahlili asosida ishlab chiqildi.

## Imkoniyatlar
- Landing: hero, suv filtri, funksiyalar, foizsiz muddatli to'lov, 4 qadam, FAQ, mobil sticky CTA
- Forma: **ism, telefon (+998 maska), manzil** → `/api/lead`
- **Meta Pixel** (PageView + Lead) va **Conversions API** (Lead) — bir xil `event_id` bilan dedublikatsiya; SHA-256 ph/fn/ln/external_id, fbp/fbc, IP, user-agent
- **Telegram bot**: har bir arizada xabar + "💳 To'lov kiritish" havolasi (HMAC bilan imzolangan, har bir lid uchun alohida)
- `/pay/[id]?t=...` sahifasi: summa, to'lov turi (naqd/karta/muddatli), izoh → **CAPI Purchase** (UZS, `purchase_{id}` event_id) + Telegramga tasdiq
- Upstash Redis (ixtiyoriy): to'lov ikki marta kiritilishidan himoya + 2 daqiqalik takroriy ariza bloki

## Ishga tushirish
```bash
npm install
cp .env.example .env.local   # qiymatlarni to'ldiring
npm run dev
```

## Vercel
1. GitHub'ga push → Vercel'da import
2. Environment Variables: `.env.example` dagilarning hammasi
3. (Ixtiyoriy) Storage → Upstash Redis ulang — `KV_REST_API_URL/TOKEN` avtomatik o'qiladi
4. `NEXT_PUBLIC_SITE_URL` ni haqiqiy domen bilan yozing (TG havolasi shundan quriladi)

## Mahsulot rasmi
Haqiqiy rasmni `public/images/product.png` ga qo'ying (fon shaffof bo'lsa yaxshi) va `lib/site.ts` da
`productImage: "/images/product.png"` qiling. Bo'sh bo'lsa SVG ko'rinish chiqadi.

## Test
Events Manager → Test events kodini `META_TEST_EVENT_CODE` ga yozing, arizani yuboring — Lead (Browser + Server, "Deduplicated") ko'rinishini tekshiring. Keyin TG'dagi havoladan to'lov kiriting — Purchase keladi. Ishga tushirishda test kodini o'chiring.
