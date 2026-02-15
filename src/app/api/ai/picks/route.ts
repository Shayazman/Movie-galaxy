import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { favorites } = await req.json();
  const picks = Array.isArray(favorites) ? favorites.slice(0, 5) : [];
  return NextResponse.json({ picks });
}
