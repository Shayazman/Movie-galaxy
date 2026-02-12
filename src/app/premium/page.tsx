"use client";

import { buyPremium, isPremium } from "@/lib/premium";

export default function Premium() {
  if (isPremium())
    return <div style={{ padding: 30, color: "white" }}>You are Premium</div>;

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>Premium</h1>

      <ul>
        <li>No ads</li>
        <li>HD trailers</li>
        <li>AI recommendations</li>
      </ul>

      <button
        onClick={buyPremium}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "none",
          background: "#7c3aed",
          color: "white",
          cursor: "pointer",
        }}
      >
        Activate Premium
      </button>
    </main>
  );
}
