"use client";

import { useState } from "react";

function canUseStorage() {
  return typeof window !== "undefined";
}

function isPremium() {
  if (!canUseStorage()) return false;
  return localStorage.getItem("mg-premium") === "1";
}

export function PremiumToggle() {
  const [p, setP] = useState(() => isPremium());

  return (
    <button
      onClick={() => {
        if (!canUseStorage()) return;
        const next = !isPremium();
        localStorage.setItem("mg-premium", next ? "1" : "0");
        setP(next);
      }}
      style={{
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,.16)",
        background: p
          ? "linear-gradient(135deg, rgba(255,200,0,.25), rgba(124,58,237,.25))"
          : "rgba(255,255,255,.06)",
        color: "white",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {p ? "Premium: ON" : "Premium: OFF"}
    </button>
  );
}

export default function AdSlot({ placement }: { placement?: string }) {
  if (isPremium()) return null;

  return (
    <div
      style={{
        margin: "30px 0",
        padding: 20,
        borderRadius: 18,
        textAlign: "center",
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.6 }}>
        Advertisement{placement ? ` - ${placement}` : ""}
      </div>
      <div style={{ marginTop: 10 }}>
        <p>Ad Space</p>
      </div>
    </div>
  );
}
