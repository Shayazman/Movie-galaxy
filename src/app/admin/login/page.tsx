"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function login() {
    setErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pw }),
    });
    if (!r.ok) return setErr("Wrong password.");
    window.location.href = "/admin";
  }

  return (
    <main style={{ padding: 28, color: "white" }}>
      <h1 style={{ fontSize: 30, fontWeight: 900 }}>Admin Login</h1>
      <p style={{ color: "#bbb", marginTop: 6 }}>
        Only you can enter.
      </p>

      <div style={{ marginTop: 18, maxWidth: 420 }}>
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Admin password"
          type="password"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(0,0,0,.55)",
            color: "white",
          }}
        />
        <button
          onClick={login}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "12px 14px",
            borderRadius: 14,
            border: "none",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
          }}
        >
          Enter Admin
        </button>

        {err ? <div style={{ color: "#fca5a5", marginTop: 10 }}>{err}</div> : null}
      </div>
    </main>
  );
}

