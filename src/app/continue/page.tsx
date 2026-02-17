"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IMG } from "@/lib/tmdb";
import {
  readContinue,
  clearContinue,
  type ContinueItem,
} from "@/lib/continue";

export default function ContinuePage() {
  const [items, setItems] = useState<ContinueItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readContinue());
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "radial-gradient(circle at top,#0b0b18 0%,#05050a 70%)",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 40, fontWeight: 900 }}>Continue Watching</h1>
        <button
          onClick={() => {
            clearContinue();
            setItems([]);
          }}
          style={{
            border: "1px solid rgba(255,255,255,.16)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            padding: "10px 14px",
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          Clear all
        </button>
      </div>

      <div
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 20,
        }}
      >
        {items.map((x) => {
          const href = `/watch/${x.mediaType}/${x.id}${
            x.youtubeKey ? `?yt=${encodeURIComponent(x.youtubeKey)}` : ""
          }`;
          return (
            <Link
              key={`${x.mediaType}-${x.id}`}
              href={href}
              style={{ textDecoration: "none", color: "white" }}
            >
              <img
                src={
                  x.poster_path
                    ? IMG + x.poster_path
                    : "https://via.placeholder.com/300x450"
                }
                style={{ width: "100%", borderRadius: 14 }}
                alt={x.title}
              />
              <div style={{ fontSize: 13, marginTop: 8 }}>{x.title}</div>
              <div style={{ color: "#c4b5fd", fontSize: 12 }}>Continue -&gt;</div>
            </Link>
          );
        })}
      </div>

      {!items.length && (
        <div style={{ marginTop: 18, color: "#aaa" }}>
          Nothing here yet. Play a trailer or watch something.
        </div>
      )}
    </main>
  );
}
