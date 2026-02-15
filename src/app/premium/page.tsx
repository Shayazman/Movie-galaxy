"use client";

import { isPremium } from "@/lib/premium";

export default function PremiumPage() {
  async function goPay() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert(data?.error || "Checkout failed");
  }

  if (isPremium()) {
    return <div style={{ padding: 30, color: "white" }}>You are Premium</div>;
  }

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>Premium</h1>
      <p>Unlock HD + no ads + creator tools</p>

      <ul>
        <li>No ads</li>
        <li>HD trailers</li>
        <li>AI recommendations</li>
      </ul>

      <button
        onClick={goPay}
        style={{
          padding: "12px 18px",
          borderRadius: 18,
          border: "none",
          cursor: "pointer",
          color: "white",
          fontWeight: 800,
          background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
          boxShadow: "0 0 30px rgba(124,58,237,.35)",
        }}
      >
        Upgrade with Stripe
      </button>
    </main>
  );
}
