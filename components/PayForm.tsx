"use client";

import { useState } from "react";

const fmt = (v: string) => v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function PayForm({
  token,
  paid,
}: {
  token: string;
  paid: { amount: number; method: string; at: number } | null;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("naqd");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [already, setAlready] = useState(!!paid);

  async function submit(force = false) {
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, amount, method, note, force }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState("done");
        setMsg(data.capi ? "Saqlandi va Meta'ga Purchase yuborildi." : "Saqlandi. Meta CAPI sozlanmagan yoki xato berdi.");
      } else {
        if (data.already) setAlready(true);
        setState("error");
        setMsg(data.error || "Xatolik yuz berdi");
      }
    } catch {
      setState("error");
      setMsg("Tarmoq xatosi, qayta urinib ko'ring");
    }
  }

  if (state === "done") {
    return (
      <div className="pay-success">
        <div className="check">✓</div>
        <h2>{fmt(amount)} so'm kiritildi</h2>
        <p className="muted">{msg}</p>
      </div>
    );
  }

  return (
    <form
      className="pay-form"
      onSubmit={(e) => {
        e.preventDefault();
        submit(false);
      }}
    >
      {already && paid ? (
        <div className="notice">
          Avval kiritilgan: <b>{paid.amount.toLocaleString("ru-RU")} so'm</b> (
          {new Date(paid.at).toLocaleDateString("ru-RU")})
        </div>
      ) : null}

      <label className="field">
        <span>To'lov summasi (so'm)</span>
        <input
          inputMode="numeric"
          placeholder="Masalan: 975 000"
          value={amount}
          onChange={(e) => setAmount(fmt(e.target.value))}
          required
        />
      </label>

      <div className="field">
        <span>To'lov turi</span>
        <div className="seg">
          {[
            ["naqd", "Naqd"],
            ["karta", "Karta"],
            ["muddatli", "Muddatli"],
          ].map(([v, l]) => (
            <button type="button" key={v} className={method === v ? "on" : ""} onClick={() => setMethod(v)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>Izoh (ixtiyoriy)</span>
        <input placeholder="Masalan: 24 oyga, 1-to'lov" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>

      {msg ? <p className="form-error">{msg}</p> : null}

      <button className="btn btn-primary btn-block" disabled={state === "loading"}>
        {state === "loading" ? "Yuborilmoqda..." : "To'lovni tasdiqlash"}
      </button>
      {already ? (
        <button
          type="button"
          className="btn btn-ghost btn-block"
          disabled={state === "loading" || !amount}
          onClick={() => submit(true)}
        >
          Baribir qayta kiritish
        </button>
      ) : null}
    </form>
  );
}
