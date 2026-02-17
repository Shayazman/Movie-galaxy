"use client";

import { useEffect, useState } from "react";

const PREMIUM_KEY = "mg-premium";
const PREMIUM_EVENT = "mg-premium-change";

function canUseStorage() {
  return typeof window !== "undefined";
}

function isPremium() {
  if (!canUseStorage()) return false;
  return localStorage.getItem(PREMIUM_KEY) === "1";
}

function setPremium(next: boolean) {
  if (!canUseStorage()) return;
  localStorage.setItem(PREMIUM_KEY, next ? "1" : "0");
  window.dispatchEvent(new Event(PREMIUM_EVENT));
}

export function PremiumToggle() {
  const [p, setP] = useState(false);

  useEffect(() => {
    const sync = () => setP(isPremium());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(PREMIUM_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PREMIUM_EVENT, sync);
    };
  }, []);

  return (
    <button
      onClick={() => {
        if (!canUseStorage()) return;
        const next = !p;
        setPremium(next);
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

export default function AdSlot({ placement }: { placement?: string }) {
  const [ready, setReady] = useState(false);
  const [premium, setPremiumState] = useState(false);

  useEffect(() => {
    const sync = () => {
      setPremiumState(isPremium());
      setReady(true);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(PREMIUM_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PREMIUM_EVENT, sync);
    };
  }, []);

  if (!ready || premium) return null;

  return (
    <div
      style={{
        margin: "30px 0",
        padding: 20,
        borderRadius: 18,
        textAlign: "center",
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.6 }}>
        Advertisement{placement ? ` - ${placement}` : ""}
      </div>
      <div style={{ marginTop: 10 }}>
        <p>Ad Space</p>
      </div>
    </div>
  );
}
