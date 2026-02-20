import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (!stripe) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const price = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!price || !appUrl) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID or NEXT_PUBLIC_APP_URL" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripeCustomerId || undefined,
      customer_email: user.stripeCustomerId ? undefined : email,
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/billing/success`,
      cancel_url: `${appUrl}/pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
