import crypto from "crypto";

export type LeadPayload = {
  id: string;
  n: string; // ism
  p: string; // telefon
  a: string; // manzil
  ts: number; // unix soniya
  fbp?: string;
  fbc?: string;
  ip?: string;
  ua?: string;
  url?: string;
  utm?: string;
};

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET sozlanmagan");
  return s;
}

const b64u = (b: Buffer) => b.toString("base64url");

export function signLead(payload: LeadPayload): string {
  const body = b64u(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = b64u(crypto.createHmac("sha256", secret()).update(body).digest()).slice(0, 32);
  return `${body}.${sig}`;
}

export function verifyLead(token: string | undefined | null): LeadPayload | null {
  if (!token || typeof token !== "string") return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = b64u(crypto.createHmac("sha256", secret()).update(body).digest()).slice(0, 32);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as LeadPayload;
  } catch {
    return null;
  }
}
