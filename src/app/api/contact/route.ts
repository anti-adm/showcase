import {NextResponse} from "next/server";
import nodemailer from "nodemailer";

import {createHash} from "node:crypto";
import {CONTACT_LIMITS, validateContact} from "@/lib/contact-validation";
import {createContactLimiter} from "@/lib/contact-rate-limit";

export const runtime = "nodejs";
const consumeAttempt = createContactLimiter();
const error = (code: string, status: number, retryAfter?: number) => NextResponse.json(
  {ok: false, code}, {status, headers: retryAfter ? {"Retry-After": String(retryAfter)} : undefined}
);

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return error("invalid_fields", 415);
    const reader = request.body?.getReader();
    if (!reader) return error("invalid_fields", 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > CONTACT_LIMITS.bodyBytes) {await reader.cancel(); return error("too_long", 413);}
      chunks.push(value);
    }
    let body: unknown;
    try {body = JSON.parse(Buffer.concat(chunks).toString("utf8"));} catch {return error("invalid_fields", 400);}
    const result = validateContact(body);
    if (!result.ok) return error(result.code, 400);
    const {name, email, message, website} = result.data;
    if (website) return NextResponse.json({ok: true});
    const key = createHash("sha256").update(email.toLowerCase()).digest("hex");
    const retryAfter = consumeAttempt(key);
    if (retryAfter) return error("rate_limited", 429, retryAfter);

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_RECEIVER_EMAIL
    } = process.env;

    if (
      !SMTP_HOST ||
      !SMTP_PORT ||
      !SMTP_USER ||
      !SMTP_PASS ||
      !CONTACT_RECEIVER_EMAIL
    ) {
      return error("unavailable", 503);
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"SOFIN Website" <${SMTP_USER}>`,
      to: CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `SOFIN contact form — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 16px;">SOFIN contact form</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <div style="padding: 12px 14px; background: #f8fafc; border-radius: 12px; white-space: pre-wrap;">${escapeHtml(
            message
          )}</div>
        </div>
      `
    });

    return NextResponse.json({ok: true});
  } catch {
    return error("send_failed", 502);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}