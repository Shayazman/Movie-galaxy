"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { tmdb, Movie } from "@/lib/tmdb";
import { addXP, touchStreak, yearOf } from "@/lib/galaxy";
import { addXP as addProfileXP } from "@/lib/profile";
import GlowIcon from "@/components/GlowIcon";

type Res = { results: Movie[] };

type Mood =
  | "Any"
  | "Action"
  | "Sci-Fi"
  | "Romance"
  | "Comedy"
  | "Horror"
  | "Anime"
  | "Thriller";

const moodToQuery: Record<Mood, string> = {
  Any: "",
  Action: "with_genres=28",
  "Sci-Fi": "with_genres=878",
  Romance: "with_genres=10749",
  Comedy: "with_genres=35",
  Horror: "with_genres=27",
  Anime: "with_genres=16",
  Thriller: "with_genres=53",
};

function why(mood: Mood, minYear: number) {
  if (mood === "Any") return `Because you asked for a fresh pick (>= ${minYear}).`;
  return `Because you chose ${mood} and you wanted newer movies (>= ${minYear}).`;
}

export default function GalaxyAssistant() {
  const [mood, setMood] = useState<Mood>("Sci-Fi");
  const [minYear, setMinYear] = useState(2020);
  const [loading, setLoading] = useState(false);
  const [pick, setPick] = useState<Movie | null>(null);
  const [open, setOpen] = useState(false);
  const [scrollNudge, setScrollNudge] = useState(0);
  const nudgeRef = useRef(0);

  useEffect(() => {
    touchStreak();
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const settle = () => {
      raf = 0;
      nudgeRef.current *= 0.84;
      if (Math.abs(nudgeRef.current) < 0.4) {
        nudgeRef.current = 0;
      }
      setScrollNudge(nudgeRef.current);
      if (nudgeRef.current !== 0) {
        raf = window.requestAnimationFrame(settle);
      }
    };

    const onScroll = () => {
      const nowY = window.scrollY;
      const delta = nowY - lastY;
      lastY = nowY;

      // Bigger reaction to real scroll direction/speed.
      nudgeRef.current = clamp(nudgeRef.current + delta * 0.55, -26, 26);
      setScrollNudge(nudgeRef.current);

      if (!raf) {
        raf = window.requestAnimationFrame(settle);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const subtitle = useMemo(() => why(mood, minYear), [mood, minYear]);

  async function surpriseMe() {
    setLoading(true);
    try {
      const q = moodToQuery[mood];
      const url =
        `/discover/movie?sort_by=popularity.desc&vote_count.gte=200&` +
        `primary_release_date.gte=${minYear}-01-01&` +
        (q ? `${q}&` : "");

      const r = await tmdb<Res>(url);
      const list = (r.results || []).filter((m) => yearOf(m) >= minYear);

      if (list.length) {
        const pool = list.slice(0, 18);
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        setPick(chosen);
        addXP(40);
        addProfileXP(40);
      } else {
        setPick(null);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <section
          style={{
            position: "fixed",
            right: 18,
            bottom: 92,
            zIndex: 120,
            width: "min(92vw, 420px)",
            borderRadius: 22,
            padding: 18,
            border: "1px solid rgba(255,255,255,.08)",
            background:
              "linear-gradient(135deg, rgba(124,58,237,.20), rgba(0,0,0,.55))",
            boxShadow: "0 0 55px rgba(124,58,237,.18)",
            overflow: "hidden",
            transform: `translateY(${scrollNudge}px)`,
            transition: "transform .08s linear",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -80,
              background:
                "radial-gradient(circle at 20% 30%, rgba(124,58,237,.18), transparent 60%)," +
                "radial-gradient(circle at 75% 70%, rgba(34,211,238,.10), transparent 55%)",
              filter: "blur(12px)",
              animation: "galaxyFloat 10s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: 18, fontWeight: 900 }}>
                <span className="icon-inline">
                  <GlowIcon name="spark" size={16} className="glow-icon" />
                  Galaxy Assistant
                </span>
              </div>

              <span
                style={{
                  fontSize: 12,
                  color: "#a5f3fc",
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(34,211,238,.25)",
                  background: "rgba(34,211,238,.08)",
                }}
              >
                Smart Picks
              </span>

              <button
                onClick={() => setOpen(false)}
                style={{
                  marginLeft: "auto",
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "rgba(0,0,0,.4)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                x
              </button>
            </div>

            <div style={{ color: "#cfcfcf", fontSize: 13, marginTop: 6, lineHeight: 1.35 }}>
              Tell me your mood and year. I will pick a strong movie for tonight.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(0,0,0,.55)",
                  color: "white",
                  outline: "none",
                }}
              >
                {Object.keys(moodToQuery).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(0,0,0,.55)",
                }}
              >
                <span style={{ fontSize: 12, color: "#ddd" }}>From</span>
                <input
                  type="number"
                  value={minYear}
                  min={2000}
                  max={2026}
                  onChange={(e) => setMinYear(Number(e.target.value || 2020))}
                  style={{
                    width: 88,
                    padding: "8px 10px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,.14)",
                    background: "rgba(0,0,0,.55)",
                    color: "white",
                    outline: "none",
                  }}
                />
              </div>

              <button
                onClick={surpriseMe}
                disabled={loading}
                style={{
                  padding: "10px 16px",
                  borderRadius: 16,
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: 900,
                  letterSpacing: 0.3,
                  background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                  boxShadow: "0 0 30px rgba(124,58,237,.35)",
                  transform: "translateY(0)",
                  transition: "transform .15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <span className="icon-inline">
                  <GlowIcon name="spark" size={14} className="glow-icon" />
                  {loading ? "Scanning the galaxy..." : "Surprise Me"}
                </span>
              </button>
            </div>

            <div style={{ marginTop: 12, color: "#bbb", fontSize: 13 }}>{subtitle}</div>

            {pick && (
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,.08)",
                  background: "rgba(0,0,0,.45)",
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 14 }}>
                  Pick:
                  <div style={{ fontWeight: 800, marginTop: 4 }}>
                    {pick.title || pick.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#facc15", marginTop: 4 }}>
                    Rating {pick.vote_average?.toFixed?.(1) ?? "-"} {yearOf(pick) || "-"}
                  </div>
                </div>

                <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => (window.location.href = `/movie/${pick.id}`)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,.14)",
                      background: "rgba(255,255,255,.06)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("tonight", JSON.stringify(pick));
                      window.location.href = "/tonight";
                    }}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 16,
                      border: "none",
                      background: "rgba(124,58,237,.75)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: 900,
                    }}
                  >
                    Tonight
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 18,
          bottom: 22,
          zIndex: 121,
          border: "1px solid rgba(255,255,255,.14)",
          background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
          color: "white",
          borderRadius: 999,
          padding: "12px 14px",
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 0 30px rgba(124,58,237,.35)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          animation: "assistantPulse 2.8s ease-in-out infinite",
          transform: `translateY(${scrollNudge}px)`,
          transition: "transform .08s linear",
        }}
      >
        <GlowIcon name="spark" size={14} className="glow-icon" />
        {open ? "Close" : "Assistant"}
      </button>

      <style jsx>{`
        @keyframes galaxyFloat {
          0% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(18px,-10px,0) scale(1.03); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes assistantPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
