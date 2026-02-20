"use client";

import { useEffect, useState } from "react";

export default function BootSplash() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at top,#0b0b18,#05050a)",
        opacity: hide ? 0 : 1,
        pointerEvents: hide ? "none" : "all",
        transition: "opacity .6s ease",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 32,
            padding: 8,
            background: "rgba(255,255,255,.06)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 0 50px rgba(124,58,237,.45)",
            border: "1px solid rgba(255,255,255,.14)",
          }}
        >
          <img
            src="/icon.svg"
            alt="Movie Galaxy"
            style={{
              width: 94,
              height: 94,
              borderRadius: 24,
              filter: "drop-shadow(0 0 18px rgba(124,58,237,.7))",
            }}
          />
        </div>

        <div style={{ marginTop: 14, color: "#ccc", letterSpacing: ".02em" }}>Movie Galaxy</div>
      </div>
    </div>
  );
}
