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
            width: 100,
            height: 100,
            borderRadius: 30,
            background: "linear-gradient(135deg,#7c3aed,#facc15)",
            display: "grid",
            placeItems: "center",
            fontSize: 40,
            boxShadow: "0 0 50px rgba(124,58,237,.5)",
          }}
        >
          🌌
        </div>

        <div style={{ marginTop: 14, color: "#ccc" }}>Movie Galaxy</div>
      </div>
    </div>
  );
}

