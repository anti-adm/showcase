export const CONTACT_LIMITS = {name: 120, email: 254, message: 5000, bodyBytes: 24000} as const;
export type ContactData = {name: string; email: string; message: string; website?: string};
export type ContactValidation = {ok: true; data: ContactData} | {ok: false; code: "invalid_fields" | "invalid_email" | "too_long"};

export function validateContact(value: unknown): ContactValidation {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {ok: false, code: "invalid_fields"};
  const body = value as Record<string, unknown>;
  if (["name", "email", "message"].some((key) => typeof body[key] !== "string")) return {ok: false, code: "invalid_fields"};
  const data = {name: (body.name as string).trim(), email: (body.email as string).trim(), message: (body.message as string).trim(), website: typeof body.website === "string" ? body.website : ""};
  if (!data.name || !data.email || !data.message || /[\r\n\x00]/.test(data.name)) return {ok: false, code: "invalid_fields"};
  if (data.name.length > CONTACT_LIMITS.name || data.email.length > CONTACT_LIMITS.email || data.message.length > CONTACT_LIMITS.message) return {ok: false, code: "too_long"};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return {ok: false, code: "invalid_email"};
  return {ok: true, data};
}
