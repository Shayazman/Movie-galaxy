"use client";

import { useEffect, useState } from "react";

export default function DemoWatchPage() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const demo = localStorage.getItem("mg_demo") === "1";
    const premium = localStorage.getItem("mg_premium") === "1";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOk(demo || premium);
  }, []);

  if (!ok) {
    return (
      <main
        style={{ minHeight: "100vh", padding: 32, background: "#05050a", color: "white" }}
      >
        <h1 style={{ fontSize: 44, fontWeight: 900 }}>Demo Player</h1>
        <p style={{ color: "#bbb" }}>
          Locked. Turn on Demo Mode from Admin or unlock Premium.
        </p>
        <a href="/admin" style={{ color: "#a78bfa" }}>
          Go to Admin -&gt;
        </a>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#05050a", color: "white" }}>
      <h1 style={{ fontSize: 34, fontWeight: 900 }}>Movie Galaxy - Investor Demo</h1>
      <p style={{ color: "#bbb" }}>
        This is a legal-safe demo player showing UI, not pirated content.
      </p>

      <section
        style={{
          marginTop: 18,
          borderRadius: 22,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.12)",
          boxShadow: "0 0 50px rgba(124,58,237,.25)",
        }}
      >
        <div
          style={{
            background: "black",
            aspectRatio: "16/9",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Demo Playback</div>
            <div style={{ color: "#bbb", marginTop: 6 }}>
              Replace this with licensed streams later.
            </div>

            <button
              onClick={() => alert("Demo playing...")}
              style={{
                marginTop: 16,
                padding: "12px 18px",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                color: "white",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Play Demo
            </button>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => alert("Demo: Quality switched to 1080p")}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.18)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            cursor: "pointer",
          }}
        >
          1080p
        </button>

        <button
          onClick={() => alert("Demo: Subtitles ON")}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.18)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            cursor: "pointer",
          }}
        >
          CC
        </button>

        <button
          onClick={() => alert("Demo: Continue Watching saved")}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.18)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Save Progress
        </button>
      </section>
    </main>
  );
}
