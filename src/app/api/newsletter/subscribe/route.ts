import * as fs from "fs";
import * as path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const file = path.join(process.cwd(), "data", "subscribers.json");

function readList(): string[] {
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeList(list: string[]) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const list = readList();
  if (!list.includes(email)) {
    list.push(email);
    writeList(list);
  }

  return NextResponse.json({ ok: true, count: list.length });
}
