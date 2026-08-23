import { cookies } from "next/headers";
import crypto from "crypto";
import { getAdminEmails, getAdminPassword, getSessionSecret } from "./env";

const SESSION_COOKIE = "maid_cafe_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

export function verifyCredentials(email: string, password: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  return (
    getAdminEmails().includes(normalizedEmail) &&
    password === getAdminPassword()
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
    if (!getAdminEmails().includes(payload.email)) return null;
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
