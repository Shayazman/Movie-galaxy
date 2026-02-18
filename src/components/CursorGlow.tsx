"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ x: -9999, y: -9999 });
  const targetRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const tick = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.14;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.14;
      el.style.transform = `translate(${posRef.current.x - 140}px, ${posRef.current.y - 140}px)`;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move);
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 280,
        height: 280,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1,
        background:
          "radial-gradient(circle at center, rgba(124,58,237,0.22), rgba(124,58,237,0.08), rgba(0,0,0,0) 70%)",
        filter: "blur(10px)",
        mixBlendMode: "screen",
        transform: "translate(-9999px,-9999px)",
      }}
    />
  );
}

