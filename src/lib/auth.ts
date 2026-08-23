import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_EMAILS = [
  "emmaliz.star@gmail.com",
  "tav.chan.ferzig@gmail.com",
  "uniquemaidcafe@gmail.com",
];

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "maidcafe1234";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "unique-maid-cafe-session-secret-2026";
const SESSION_COOKIE = "maid_cafe_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function verifyCredentials(email: string, password: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  return (
    ADMIN_EMAILS.includes(normalizedEmail) && password === ADMIN_PASSWORD
  );
}

export async function createSession(email: string): Promise<void> {
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = sign(encoded);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${encoded}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  if (sign(encoded) !== signature) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8"),
    ) as { email: string; exp: number };
    if (Date.now() > payload.exp) return null;
    if (!ADMIN_EMAILS.includes(payload.email)) return null;
    return payload.email;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<string> {
  const email = await getSessionEmail();
  if (!email) {
    throw new Error("Unauthorized");
  }
  return email;
}
