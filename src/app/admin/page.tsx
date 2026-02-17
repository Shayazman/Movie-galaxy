"use client";

import { useEffect, useState } from "react";

function readJSON(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function AdminPage() {
  const [ok, setOk] = useState(false);
  const [pin, setPin] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOk(localStorage.getItem("movie-galaxy-admin") === "1");
  }, []);

  if (!ok) {
    return (
      <main style={{ minHeight: "100vh", padding: 32, background: "#05050a", color: "white" }}>
        <h1 style={{ fontSize: 44, fontWeight: 900 }}>Admin Login</h1>
        <p style={{ color: "#bbb" }}>Enter your PIN.</p>

        <div style={{ maxWidth: 340, marginTop: 14, display: "flex", gap: 10 }}>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN (set your own)"
            type="password"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 14,
              background: "rgba(0,0,0,.6)",
              color: "white",
              border: "1px solid rgba(255,255,255,.14)",
            }}
          />
          <button
            onClick={() => {
              if (pin === "2026") {
                localStorage.setItem("movie-galaxy-admin", "1");
                setOk(true);
              } else {
                alert("Wrong PIN");
              }
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              color: "white",
              fontWeight: 900,
              background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
            }}
          >
            Login
          </button>
        </div>

        <div style={{ marginTop: 10, color: "#aaa", fontSize: 13 }}>
          Change the PIN inside this file. Later we can replace with real auth.
        </div>
      </main>
    );
  }

  const watchlist = readJSON("movie-galaxy-list");
  const tonight = (() => {
    try {
      const raw = localStorage.getItem("tonight");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  return (
    <main style={{ minHeight: "100vh", padding: 32, background: "#05050a", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 46, fontWeight: 900 }}>Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("movie-galaxy-admin");
            window.location.href = "/home";
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.14)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
          }}
        >
          <div style={{ color: "#bbb" }}>My List Count</div>
          <div style={{ fontSize: 34, fontWeight: 900 }}>{watchlist.length}</div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
          }}
        >
          <div style={{ color: "#bbb" }}>Tonight</div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>
            {tonight?.title || tonight?.name || "-"}
          </div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
          }}
        >
          <div style={{ color: "#bbb" }}>Deploy Mode</div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>APP Router OK</div>
        </div>
      </div>
    </main>
  );
}
