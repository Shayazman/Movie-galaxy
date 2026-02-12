"use client";

import { useEffect, useState } from "react";
import { IMG } from "@/lib/tmdb";
import { getContinue } from "@/lib/galaxy";
import GlowIcon from "@/components/GlowIcon";

export default function ContinueWatchingRow() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = () => setItems(getContinue() as any);
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  if (!items.length) return null;

  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>
        <span className="icon-inline">
          <GlowIcon name="play" size={14} className="glow-icon" />
          Continue Watching
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 6,
        }}
      >
        {items.slice(0, 12).map((m: any) => (
          <div
            key={m.id}
            onClick={() => (window.location.href = `/movie/${m.id}`)}
            style={{
              minWidth: 140,
              cursor: "pointer",
            }}
          >
            <img
              src={m.poster_path ? IMG + m.poster_path : "https://via.placeholder.com/300x450"}
              style={{
                width: 140,
                borderRadius: 14,
                boxShadow: "0 0 30px rgba(0,0,0,.55)",
              }}
              alt={m.title || m.name || "movie"}
            />
            <div style={{ fontSize: 12, color: "#ddd", marginTop: 6 }}>
              {m.title || m.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
