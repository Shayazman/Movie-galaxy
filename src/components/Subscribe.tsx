"use client";

import { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");

  async function join() {
    if (!email.includes("@")) return alert("Enter a valid email");

    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Failed");

    alert("Subscribed");
    setEmail("");
  }

  return (
    <div
      style={{
        margin: "30px 0",
        padding: 18,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.1)",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Get weekly movie drops</h3>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 14 }}
        />
        <button onClick={join} style={{ padding: "10px 14px", borderRadius: 14, cursor: "pointer" }}>
          Join
        </button>
      </div>
    </div>
  );
}
