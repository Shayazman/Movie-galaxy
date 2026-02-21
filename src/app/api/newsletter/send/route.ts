import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

export const runtime = "nodejs";

const file = path.join(process.cwd(), "data", "subscribers.json");

export async function POST(req: Request) {
  const { subject, content } = await req.json();
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured (RESEND_API_KEY missing)." },
      { status: 503 },
    );
  }

  let list: string[] = [];
  try {
    list = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    list = [];
  }

  if (!list.length) {
    return NextResponse.json({ error: "No subscribers" }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "Movie Galaxy <onboarding@resend.dev>",
    to: list,
    subject,
    html: `<div style="font-family:sans-serif"><h2>${subject}</h2><p>${String(content || "").replace(/\n/g, "<br/>")}</p></div>`,
  });

  return NextResponse.json({ ok: true, count: list.length });
}
