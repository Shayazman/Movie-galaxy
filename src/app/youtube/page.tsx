"use client";

import { useState } from "react";

function slug(s: string) {
  return s.trim().replace(/\s+/g, " ").slice(0, 120);
}

export default function YouTubePage() {
  const [title, setTitle] = useState("Galaxy Picks - Episode 1");
  const [mood, setMood] = useState("Sci-Fi / Thriller");
  const [tags, setTags] = useState(
    "movie galaxy, galaxy picks, tmdb, movies 2026, netflix style"
  );
  const [out, setOut] = useState("");

  function generate() {
    const t = slug(title);
    const desc =
      ` ${t}\n\n` +
      `Mood: ${mood}\n` +
      `Made with Movie Galaxy\n\n` +
      ` Chapters:\n` +
      `00:00 Intro\n00:20 Picks\n02:40 Final pick\n\n` +
      `#movie #movies #galaxypicks`;

    setOut(`TITLE:\n${t}\n\nDESCRIPTION:\n${desc}\n\nTAGS:\n${tags}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "#05050a",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 46, fontWeight: 900 }}>
        YouTube Upload Generator
      </h1>
      <p style={{ color: "#bbb" }}>
        Instant title + description + tags for your channel.
      </p>

      <div style={{ marginTop: 18, display: "grid", gap: 12, maxWidth: 760 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 14,
            background: "rgba(0,0,0,.6)",
            color: "white",
            border: "1px solid rgba(255,255,255,.14)",
          }}
        />
        <input
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 14,
            background: "rgba(0,0,0,.6)",
            color: "white",
            border: "1px solid rgba(255,255,255,.14)",
          }}
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 14,
            background: "rgba(0,0,0,.6)",
            color: "white",
            border: "1px solid rgba(255,255,255,.14)",
          }}
        />

        <button
          onClick={generate}
          style={{
            padding: "12px 16px",
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
            color: "white",
            fontWeight: 900,
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
            boxShadow: "0 0 40px rgba(124,58,237,.35)",
            width: 240,
          }}
        >
          Generate
        </button>

        {out && (
          <textarea
            value={out}
            readOnly
            style={{
              marginTop: 10,
              minHeight: 220,
              padding: 12,
              borderRadius: 16,
              background: "rgba(0,0,0,.6)",
              color: "white",
              border: "1px solid rgba(255,255,255,.14)",
            }}
          />
        )}
      </div>
    </main>
  );
}
