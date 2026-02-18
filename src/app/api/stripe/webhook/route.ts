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

export async function POST(req: Request) {
  const stripeClient = getStripeClient();
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!stripeClient) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  }

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook signature config" }, { status: 400 });
  }

  try {
    const event = stripeClient.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      // Temporary local unlock hook point. Replace with DB update in production.
      console.log("Premium unlocked for:", session.customer_email);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
