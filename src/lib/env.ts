function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAdminEmails(): string[] {
  const raw = requireEnv("ADMIN_EMAILS");
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminPassword(): string {
  return requireEnv("ADMIN_PASSWORD");
}

export function getSessionSecret(): string {
  return requireEnv("SESSION_SECRET");
}

export function getSupabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || "maid-cafe-uploads";
}
