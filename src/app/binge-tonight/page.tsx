"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { tmdb, IMG, Movie } from "@/lib/tmdb";

type Res = { results: Movie[] };

const TV_VALID_GENRES = new Set([
  10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766,
  10767, 37,
]);

function normalizeTVGenres(raw: string, mood: string): string {
  const map: Record<number, number> = {
    12: 10759,
    14: 10765,
    27: 9648,
    28: 10759,
    53: 9648,
    878: 10765,
    10749: 10766,
  };

  const ids = raw
    .split(/[,\s|]+/)
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x))
    .map((x) => (TV_VALID_GENRES.has(x) ? x : map[x]))
    .filter((x): x is number => Boolean(x));

  const unique = Array.from(new Set(ids));
  if (unique.length) return unique.join("|");

  const m = mood.toLowerCase();
  if (m.includes("com")) return "35|18";
  if (m.includes("rom")) return "10766|18";
  if (m.includes("dark") || m.includes("horror")) return "9648|80";
  if (m.includes("sci") || m.includes("space")) return "10765|10759";
  if (m.includes("action") || m.includes("hype")) return "10759|80";
  return "18|10765|35";
}

function readTitlesFrom(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    const list: Array<{ title?: string; name?: string }> = raw
      ? JSON.parse(raw)
      : [];
    return list.map((x) => x.title || x.name).filter(Boolean);
  } catch {
    return [];
  }
}

export default function BingeTonightPage() {
  const sp = useSearchParams();
  const [mode, setMode] = useState<"movie" | "tv">("movie");
  const [mood, setMood] = useState("Surprise me");
  const [label, setLabel] = useState("Ready");
  const [reason, setReason] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const historyTitles = useMemo(() => readTitlesFrom("movie-galaxy-history"), []);
  const watchlistTitles = useMemo(() => readTitlesFrom("movie-galaxy-list"), []);

  useEffect(() => {
    const qMood = sp.get("mood");
    if (!qMood) return;
    setMood(qMood);
    if (qMood.toLowerCase() === "tv") setMode("tv");
  }, [sp]);

  async function run() {
    setLoading(true);
    setMovies([]);

    const r = await fetch("/api/ai/binge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, mood, historyTitles, watchlistTitles }),
    });

    const j = await r.json();
    setLabel(j.label || "Ready");
    setReason(j.reason || "");

    const movieGenres = String(j.genres || "");
    const tvGenres = normalizeTVGenres(String(j.genres || ""), mood);
    const discover =
      mode === "movie"
        ? `/discover/movie?sort_by=popularity.desc&with_genres=${encodeURIComponent(
            movieGenres
          )}&primary_release_date.gte=2020-01-01`
        : `/discover/tv?sort_by=popularity.desc&with_genres=${encodeURIComponent(
            tvGenres
          )}&first_air_date.gte=2015-01-01`;

    let data = await tmdb<Res>(discover);
    let results = data.results || [];

    if (mode === "tv" && results.length === 0) {
      data = await tmdb<Res>(
        "/discover/tv?sort_by=popularity.desc&first_air_date.gte=2015-01-01"
      );
      results = data.results || [];
    }

    setMovies(results.slice(0, 18));
    setLoading(false);
  }

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "radial-gradient(circle at top,#0b0b18 0%,#05050a 70%)",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 44,
          fontWeight: 900,
          textShadow: "0 0 40px rgba(124,58,237,1)",
        }}
      >
        Binge Tonight
      </h1>

      <div style={{ marginTop: 10, color: "#bbb", maxWidth: 760 }}>
        AI picks a vibe and fetches Movies from <b>2020+</b> and TV Shows from <b>2015+</b>. {reason ? `- ${reason}` : ""}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "movie" | "tv")}
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            background: "rgba(0,0,0,.6)",
            color: "white",
            border: "1px solid rgba(255,255,255,.14)",
          }}
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>

        <input
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Mood: sci-fi, romance, horror..."
          style={{
            flex: 1,
            minWidth: 220,
            padding: "10px 12px",
            borderRadius: 14,
            background: "rgba(0,0,0,.6)",
            color: "white",
            border: "1px solid rgba(255,255,255,.14)",
          }}
        />

        <button
          onClick={run}
          style={{
            padding: "10px 16px",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            color: "white",
            fontWeight: 900,
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
            boxShadow: "0 0 40px rgba(124,58,237,.35)",
          }}
        >
          {loading ? "Thinking..." : ` ${label}`}
        </button>
      </div>

      <div
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 22,
        }}
      >
        {movies.map((m) => (
          <div
            key={m.id}
            style={{ cursor: "pointer" }}
            onClick={() => {
              const isTv = !!m.first_air_date;
              window.location.href = isTv ? `/tv/${m.id}` : `/movie/${m.id}`;
            }}
          >
            <img
              src={
                m.poster_path
                  ? IMG + m.poster_path
                  : "https://via.placeholder.com/300x450"
              }
              style={{ width: "100%", borderRadius: 14 }}
              alt={m.title || m.name || "poster"}
            />
            <div style={{ fontSize: 13, marginTop: 8 }}>{m.title || m.name}</div>
            <div style={{ color: "#facc15", fontSize: 12 }}>
              ⭐ {m.vote_average?.toFixed?.(1) ?? "-"}
            </div>
          </div>
        ))}
      </div>

      {!loading && !movies.length && (
        <div style={{ marginTop: 16, color: "#aaa" }}>
          No results. Try another mood.
        </div>
      )}
    </main>
  );
}
