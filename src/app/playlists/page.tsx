"use client";

import Link from "next/link";

const playlists = [
  { title: "Dark Energy TV", href: "/binge-tonight?mood=dark" },
  { title: "Hype Mode TV", href: "/binge-tonight?mood=hype" },
  { title: "Mind Expanders TV", href: "/binge-tonight?mood=smart" },
  { title: "Heart Mode TV", href: "/binge-tonight?mood=romance" },
  { title: "Chill Picks", href: "/binge-tonight?mood=chill" },
];

export default function PlaylistsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "#05050a",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 44, fontWeight: 900 }}>Playlists</h1>

      <div style={{ marginTop: 20, display: "grid", gap: 14, maxWidth: 520 }}>
        {playlists.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              textDecoration: "none",
              color: "white",
              padding: 16,
              borderRadius: 18,
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.12)",
            }}
          >
            {p.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
