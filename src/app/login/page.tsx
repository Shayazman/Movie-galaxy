"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function go() {
    await signIn("credentials", { email, password, callbackUrl: "/home" });
  }

  return (
    <main style={{ padding: 28, color: "white" }}>
      <h1 style={{ fontSize: 34, fontWeight: 900 }}>Login</h1>

      <div style={{ marginTop: 18, maxWidth: 420 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(0,0,0,.55)",
            color: "white",
            marginBottom: 10,
          }}
        />
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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
          onClick={go}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "12px 14px",
            borderRadius: 14,
            border: "none",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
          }}
        >
          Login
        </button>
      </div>
    </main>
  );
}
