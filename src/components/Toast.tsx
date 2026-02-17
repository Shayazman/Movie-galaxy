"use client";

import { useEffect, useRef, useState } from "react";

let pushToast: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  pushToast?.(msg);
}

export default function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    pushToast = (m: string) => {
      setMsg(m);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setMsg(null), 2200);
    };

    return () => {
      pushToast = null;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!msg) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 14px",
        borderRadius: 14,
        background: "rgba(0,0,0,.75)",
        border: "1px solid rgba(255,255,255,.12)",
        color: "white",
        zIndex: 9999,
        boxShadow: "0 0 30px rgba(124,58,237,.25)",
      }}
    >
      {msg}
    </div>
  );
}
