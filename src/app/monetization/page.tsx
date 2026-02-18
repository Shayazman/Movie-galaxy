"use client";

import { useEffect, useState } from "react";
import { enablePremium, isPremium } from "@/lib/premium";

export default function MonetizationPage() {
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPremium(isPremium());
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main style={{ padding: 60, color: "white", textAlign: "center" }}>
      <h1 style={{ fontSize: 40 }}>Galaxy Premium</h1>

      <p style={{ marginTop: 20 }}>
        Unlock:
        <br />
        • No Ads
        <br />
        • Elite AI Picks
        <br />
        • Advanced Recommendations
      </p>

      {!premium ? (
        <button
          onClick={() => {
            enablePremium();
            alert("Premium Activated (Demo Mode)");
            setPremium(true);
          }}
          style={{
            marginTop: 30,
            padding: "12px 30px",
            borderRadius: 20,
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
            border: "none",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Upgrade to Premium
        </button>
      ) : (
        <h2 style={{ marginTop: 30, color: "#7c3aed" }}>Premium Active ✔</h2>
      )}
    </main>
  );
}
