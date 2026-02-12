"use client";

import { useEffect, useState } from "react";
import { loginOwner, isOwner, logoutOwner } from "@/lib/owner";
import Link from "next/link";

export default function OwnerLogin() {
  const [mounted, setMounted] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isOwner()) {
    return (
      <main style={{ padding: 40, color: "white" }}>
        <h1>Owner Panel</h1>

        <Link href="/owner/dashboard">Go to Dashboard</Link>

        <button onClick={logoutOwner} style={{ marginLeft: 20 }}>
          Logout
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, color: "white" }}>
      <h1>Private Owner Login</h1>

      <input
        type="password"
        placeholder="Secret pass"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        style={{
          padding: 8,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.2)",
          background: "rgba(0,0,0,.6)",
          color: "white",
          marginRight: 10,
        }}
      />

      <button
        onClick={() => {
          if (loginOwner(pass)) window.location.href = "/owner/dashboard";
          else setErr("Wrong code");
        }}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "none",
          background: "#7c3aed",
          color: "white",
          cursor: "pointer",
        }}
      >
        Enter
      </button>

      <div style={{ color: "red", marginTop: 10 }}>{err}</div>
    </main>
  );
}
