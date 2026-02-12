"use client";

import { useEffect, useState } from "react";
import { getXP, levelFromXP, getStreak } from "@/lib/galaxy";
import GlowIcon from "@/components/GlowIcon";

export default function GalaxyXPBar() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tick = () => {
      setXp(getXP());
      setStreak(getStreak());
    };
    tick();
    const id = window.setInterval(tick, 800);
    setReady(true);
    return () => window.clearInterval(id);
  }, []);

  if (!ready) return null;

  const { level, progress } = levelFromXP(xp);

  return (
    <div
      style={{
        borderRadius: 18,
        padding: 14,
        marginBottom: 18,
        border: "1px solid rgba(255,255,255,.08)",
        background: "rgba(0,0,0,.45)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontWeight: 900 }}>
        <span className="icon-inline">
          <GlowIcon name="spark" size={14} className="glow-icon" />
          Level <span style={{ color: "#facc15" }}>{level}</span>
        </span>
        <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>
          XP: {xp} - Streak: {streak} day{streak === 1 ? "" : "s"}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 160 }}>
        <div
          style={{
            height: 10,
            borderRadius: 999,
            background: "rgba(255,255,255,.08)",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(progress * 100)}%`,
              background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
              boxShadow: "0 0 20px rgba(124,58,237,.35)",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge label="Explorer" active={level >= 2} />
        <Badge label="Nebula" active={level >= 4} />
        <Badge label="Cosmic" active={level >= 7} />
      </div>
    </div>
  );
}

function Badge({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        border: "1px solid rgba(255,255,255,.12)",
        background: active ? "rgba(124,58,237,.20)" : "rgba(255,255,255,.06)",
        color: active ? "white" : "#bbb",
        boxShadow: active ? "0 0 18px rgba(124,58,237,.25)" : "none",
      }}
    >
      {active ? "Unlocked" : "Locked"} {label}
    </div>
  );
}

