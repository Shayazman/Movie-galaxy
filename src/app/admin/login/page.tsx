"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const ok =
      localStorage.getItem("mg_admin") === "1" ||
      localStorage.getItem("movie-galaxy-admin") === "1";
    if (ok) {
      router.replace("/admin");
    }
  }, [router]);

  async function login() {
    setErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pw }),
    });
    if (!r.ok) return setErr("Wrong password.");
    localStorage.setItem("mg_admin", "1");
    router.replace("/admin");
  }

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 110px)",
        padding: "16px clamp(12px, 3vw, 24px)",
        display: "grid",
        placeItems: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: "min(440px, 100%)",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,.1)",
          background: "rgba(10,10,20,.62)",
          backdropFilter: "blur(8px)",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "clamp(26px, 4vw, 32px)", fontWeight: 900, margin: 0 }}>
          Admin Login
        </h1>
        <p style={{ color: "#bbb", marginTop: 8, marginBottom: 16 }}>Only you can enter.</p>

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
