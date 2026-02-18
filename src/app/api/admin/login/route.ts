import { NextResponse } from "next/server";

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "ELVIS-GALAXY-2026").trim();

export async function POST(req: Request) {
  const { pw } = await req.json();
  const provided = typeof pw === "string" ? pw.trim() : "";

  if (provided !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("mg_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
