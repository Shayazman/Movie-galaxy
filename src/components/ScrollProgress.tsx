"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const val = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      setP(val);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: 3,
        width: "100%",
        zIndex: 9999,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${p * 100}%`,
          background: "linear-gradient(90deg,#7c3aed,#4c1d95,#facc15)",
          boxShadow: "0 0 18px rgba(124,58,237,0.8)",
          transition: "width .12s linear",
        }}
      />
    </div>
  );
}

