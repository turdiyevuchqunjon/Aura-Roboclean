"use client";

import { useState } from "react";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("998")) d = d.slice(3);
  d = d.slice(0, 9);
  const p = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  let out = "+998";
  if (p[0]) out += " (" + p[0] + (p[0].length === 2 ? ")" : "");
  if (p[1]) out += " " + p[1];
  if (p[2]) out += "-" + p[2];
  if (p[3]) out += "-" + p[3];
  return out;
}

export default function LeadForm({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [address, setAddress] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) return setError("Ismingizni kiriting");
    if (digits.length !== 12) return setError("Telefon raqamni to'liq kiriting");
    if (address.trim().length < 3) return setError("Manzilingizni kiriting");

    setState("loading");
    const eventId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random();

    let fbc = getCookie("_fbc");
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get("fbclid");
    if (!fbc && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
      .map((k) => params.get(k))
      .filter(Boolean)
      .join(" / ");

    // Pixel (brauzer) — CAPI bilan bir xil eventID, Meta dublikatni o'zi birlashtiradi
    window.fbq?.("track", "Lead", { content_name: "RoboClean Pro — bepul demonstratsiya" }, { eventID: eventId });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: digits,
          address,
          website: hp,
          eventId,
          fbp: getCookie("_fbp"),
          fbc,
          utm,
          sourceUrl: window.location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Xatolik");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error && err.message !== "Xatolik" ? err.message : "Yuborishda xatolik. Qayta urinib ko'ring yoki qo'ng'iroq qiling.");
    }
  }

  if (state === "done") {
    return (
      <div className="form-success">
        <div className="check">✓</div>
        <h3>Arizangiz qabul qilindi!</h3>
        <p>Mutaxassisimiz tez orada qo'ng'iroq qilib, bepul demonstratsiya vaqtini kelishib oladi.</p>
      </div>
    );
  }

  return (
    <form className={`lead-form${compact ? " compact" : ""}`} onSubmit={onSubmit} noValidate>
      <label className="field">
        <span>Ismingiz</span>
        <input autoComplete="name" placeholder="Masalan: Dilnoza" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="field">
        <span>Telefon raqamingiz</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+998 (90) 000-00-00"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
        />
      </label>
      <label className="field">
        <span>Manzilingiz</span>
        <input
          autoComplete="street-address"
          placeholder="Shahar, tuman, ko'cha"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <input
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        name="website"
      />
      {error ? <p className="form-error">{error}</p> : null}
      <button className="btn btn-primary btn-block" disabled={state === "loading"}>
        {state === "loading" ? "Yuborilmoqda..." : "Bepul konsultatsiya olish"}
      </button>
      <p className="form-note">🔒 Ma'lumotlaringiz faqat siz bilan bog'lanish uchun ishlatiladi</p>
    </form>
  );
}
