"use client";

import { isPremium, setPremium } from "@/lib/premium";
import { useEffect, useState } from "react";

export default function PremiumPage() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(isPremium());
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "radial-gradient(circle at top,#0b0b18 0%,#05050a 70%)",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 46, fontWeight: 900 }}>Movie Galaxy Premium</h1>
      <p style={{ color: "#bbb", maxWidth: 720 }}>
        Unlock Ultra Binge, Creator Tools, Admin insights, and advanced AI modes.
      </p>

      <div
        style={{
          marginTop: 22,
          padding: 22,
          borderRadius: 22,
          background: "rgba(255,255,255,.05)",
          border: "1px solid rgba(255,255,255,.10)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              setPremium(true);
              setOn(true);
            }}
            style={{
              padding: "12px 16px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              color: "white",
              fontWeight: 900,
              background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
              boxShadow: "0 0 40px rgba(124,58,237,.35)",
            }}
          >
            Enable Premium (Dev)
          </button>

          <button
            onClick={() => {
              setPremium(false);
              setOn(false);
            }}
            style={{
              padding: "12px 16px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,.14)",
              cursor: "pointer",
              color: "white",
              fontWeight: 800,
              background: "rgba(255,255,255,.06)",
            }}
          >
            Disable
          </button>

          <div style={{ color: on ? "#86efac" : "#fca5a5", fontWeight: 900 }}>
            Status: {on ? "ACTIVE" : "OFF"}
          </div>
        </div>

        <div style={{ marginTop: 14, color: "#bbb", fontSize: 13 }}>
          This is a dev toggle. Next step: connect Stripe checkout + webhook to set premium server-side.
        </div>
      </div>
    </main>
  );
}
