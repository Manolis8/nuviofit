// Shared server-side config. Files under api/_lib are not exposed as routes by Vercel.

// Public URL of the deployed app, used for links inside emails.
// Falls back to the Vercel deployment URL, then localhost.
export const APP_URL = (
  process.env.APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3001"
).replace(/\/$/, "");

// Sender for transactional emails. Must be a verified sender in Brevo.
export const EMAIL_FROM = process.env.EMAIL_FROM || "";
export const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "NuvioFit";
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || EMAIL_FROM;

export const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function missingEnv(names: Record<string, string | undefined>): string[] {
  return Object.entries(names)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}
