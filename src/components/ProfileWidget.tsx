"use client";

import { useEffect, useState } from "react";
import { getProfile, tasteBadge } from "@/lib/profile";
import GlowIcon from "@/components/GlowIcon";

export default function ProfileWidget() {
  const [p, setP] = useState({ name: "Explorer", level: 1, xp: 0 });
  const [badge, setBadge] = useState("Movie Explorer");

  useEffect(() => {
    setP(getProfile());
    setBadge(tasteBadge());
    const i = window.setInterval(() => {
      setP(getProfile());
      setBadge(tasteBadge());
    }, 1500);

    return () => window.clearInterval(i);
  }, []);

  return (
    <div
      className="card-glow"
      style={{
        padding: 14,
        borderRadius: 18,
        background: "rgba(0,0,0,.3)",
        marginBottom: 16,
      }}
    >
      <div style={{ fontWeight: 900 }}>
        <span className="icon-inline">
          <GlowIcon name="spark" size={14} className="glow-icon" />
          {p.name}
        </span>
      </div>

      <div style={{ fontSize: 13, color: "#bbb" }}>
        Level {p.level} - {badge}
      </div>

      <div
        style={{
          height: 6,
          background: "#222",
          borderRadius: 10,
          marginTop: 8,
        }}
      >
        <div
          style={{
            width: `${p.xp}%`,
            height: "100%",
            borderRadius: 10,
            background: "#7c3aed",
          }}
        />
      </div>
    </div>
  );
}
