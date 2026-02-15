import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);
const file = path.join(process.cwd(), "data", "subscribers.json");

export async function POST(req: Request) {
  const { subject, content } = await req.json();

  let list: string[] = [];
  try {
    list = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    list = [];
  }

  if (!list.length) {
    return NextResponse.json({ error: "No subscribers" }, { status: 400 });
  }

  await resend.emails.send({
    from: "Movie Galaxy <onboarding@resend.dev>",
    to: list,
    subject,
    html: `<div style="font-family:sans-serif"><h2>${subject}</h2><p>${String(content || "").replace(/\n/g, "<br/>")}</p></div>`,
  });

  return NextResponse.json({ ok: true, count: list.length });
}
