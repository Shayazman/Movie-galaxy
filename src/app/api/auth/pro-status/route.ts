import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ proActive: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { proActive: true },
  });

  return NextResponse.json({ proActive: Boolean(user?.proActive) });
}

