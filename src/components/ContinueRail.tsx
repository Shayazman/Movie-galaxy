"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IMG } from "@/lib/tmdb";
import {
  readContinue,
  removeContinue,
  type ContinueItem,
} from "@/lib/continue";

export default function ContinueRail() {
  const [items, setItems] = useState<ContinueItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readContinue());

    const onStorage = () => setItems(readContinue());
    window.addEventListener("storage", onStorage);

    const onVis = () => {
      if (document.visibilityState === "visible") setItems(readContinue());
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const visible = useMemo(() => items.slice(0, 10), [items]);
  if (!visible.length) return null;

  return (
    <section style={{ marginBottom: 70 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ color: "white", fontSize: 22, marginBottom: 16 }}>
          Continue Watching
        </h2>
        <Link
          href="/continue"
          style={{ color: "#c4b5fd", textDecoration: "none", fontSize: 13 }}
        >
          View all -&gt;
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 6,
        }}
      >
        {visible.map((x) => {
          const pct = Math.min(
            100,
            Math.max(0, Math.round((x.progressSec / 3600) * 100))
          );
          const href = `/watch/${x.mediaType}/${x.id}${
            x.youtubeKey ? `?yt=${encodeURIComponent(x.youtubeKey)}` : ""
          }`;

          return (
            <div key={`${x.mediaType}-${x.id}`} style={{ minWidth: 160 }}>
              <Link href={href} style={{ textDecoration: "none", color: "white" }}>
                <div style={{ position: "relative" }}>
                  <img
                    src={
                      x.poster_path
                        ? IMG + x.poster_path
                        : "https://via.placeholder.com/300x450"
                    }
                    alt={x.title}
                    style={{
                      width: 160,
                      borderRadius: 14,
                      boxShadow: "0 0 30px rgba(0,0,0,.6)",
                      display: "block",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: 10,
                      right: 10,
                      bottom: 10,
                      height: 6,
                      borderRadius: 99,
                      background: "rgba(255,255,255,.18)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                      }}
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeContinue(x.id, x.mediaType);
                      setItems(readContinue());
                    }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      border: "none",
                      background: "rgba(0,0,0,.55)",
                      color: "white",
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      cursor: "pointer",
                    }}
                    title="Remove"
                  >
                    x
                  </button>
                </div>

                <div style={{ fontSize: 13, marginTop: 8 }}>{x.title}</div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
