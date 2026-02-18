import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

let stripe: Stripe | null = null;

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) {
    stripe = new Stripe(key, {
      apiVersion: "2026-01-28.clover",
    });
  }
  return stripe;
}

export async function POST() {
  try {
    const stripeClient = getStripeClient();
    const price = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!stripeClient) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    if (!price) {
      return NextResponse.json({ error: "Missing STRIPE_PRICE_ID" }, { status: 400 });
    }

    const session = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/premium/success`,
      cancel_url: `${appUrl}/premium`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
