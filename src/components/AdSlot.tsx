"use client";

import { useEffect, useState } from "react";

const ADS = [
  { title: "Movie Galaxy Premium", body: "No ads + exclusive Galaxy Picks." },
  { title: "SnackVerse", body: "Order snacks while watching." },
  { title: "SoundWave", body: "Best headphones for cinema sound." },
];

function canUseStorage() {
  return typeof window !== "undefined";
}

function isPremium() {
  if (!canUseStorage()) return false;
  return localStorage.getItem("mg-premium") === "1";
}

export function PremiumToggle() {
  const [p, setP] = useState(false);

  useEffect(() => {
    setP(isPremium());
  }, []);

  return (
    <button
      onClick={() => {
        if (!canUseStorage()) return;
        const next = !isPremium();
        localStorage.setItem("mg-premium", next ? "1" : "0");
        setP(next);
      }}
      style={{
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,.16)",
        background: p
          ? "linear-gradient(135deg, rgba(255,200,0,.25), rgba(124,58,237,.25))"
          : "rgba(255,255,255,.06)",
        color: "white",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {p ? "Premium: ON" : "Premium: OFF"}
    </button>
  );
}

export default function AdSlot({ placement }: { placement: string }) {
  const [show, setShow] = useState(false);
  const [ad, setAd] = useState(ADS[0]);

  useEffect(() => {
    setAd(ADS[Math.floor(Math.random() * ADS.length)]);
  }, []);

  useEffect(() => {
    if (!canUseStorage() || isPremium()) return;

    const key = `ad-last-${placement}`;
    const last = Number(localStorage.getItem(key) || "0");
    const now = Date.now();

    if (now - last > 45_000) {
      setShow(true);
      localStorage.setItem(key, String(now));
    }
  }, [placement]);

  if (!show || isPremium()) return null;

  return (
    <div
      style={{
        marginTop: 18,
        padding: 16,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.10)",
        background:
          "linear-gradient(135deg, rgba(124,58,237,.14), rgba(0,0,0,.55))",
        boxShadow: "0 0 30px rgba(124,58,237,.15)",
      }}
    >
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>
        Sponsored • {placement}
      </div>

      <div style={{ fontWeight: 900, fontSize: 16 }}>{ad.title}</div>
      <div style={{ color: "#ccc", marginTop: 6 }}>{ad.body}</div>

      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <button
          onClick={() => alert("Demo click. Later: open sponsor link")}
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.12)",
            color: "white",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Learn more
        </button>

        <button
          onClick={() => setShow(false)}
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            background: "transparent",
            border: "1px solid rgba(255,255,255,.14)",
            color: "#ddd",
            cursor: "pointer",
          }}
        >
          Hide
        </button>
      </div>
    </div>
  );
}
