"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { tmdb, IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import VoiceSearch from "@/components/VoiceSearch";
import AdSlot from "@/components/AdSlot";
import ContinueRow from "@/components/ContinueRow";
import ContinueRail from "@/components/ContinueRail";
import RealAds from "@/components/RealAds";
import { toast } from "@/components/Toast";
import { addToContinue, addXP } from "@/lib/galaxy";
import { addXP as addProfileXP } from "@/lib/profile";

type Res = { results: Movie[] };

const from2015 = (m: Movie) =>
  m.release_date && new Date(m.release_date).getFullYear() >= 2015;

/* ================= SAVE ================= */
function saveTonight(m: Movie) {
  localStorage.setItem("tonight", JSON.stringify(m));
  window.location.href = "/tonight";
}

function saveToList(movie: Movie) {
  const raw = localStorage.getItem("movie-galaxy-list");
  const list: Movie[] = raw ? JSON.parse(raw) : [];

  // prevent duplicates
  if (!list.find((m) => m.id === movie.id)) {
    list.push(movie);
    localStorage.setItem("movie-galaxy-list", JSON.stringify(list));
    toast("Added to My List ❤️");
    return;
  }

  toast("Already in My List");
}

/* ================= POSTER (ADDED FEATURE) ================= */
function Poster({ movie }: { movie: Movie }) {
  const [trailer, setTrailer] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [hover, setHover] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTV = !!movie.first_air_date;
  const mediaType = isTV ? "tv" : "movie";

  const loadTrailer = async () => {
    try {
      const r = await tmdb<{ results: { site?: string; type?: string; key?: string }[] }>(
        `/${mediaType}/${movie.id}/videos`
      );
      const t = r.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      if (t?.key) {
        setTrailer(t.key);
        return;
      }
      setTrailer("");
    } catch {
      // Ignore transient network/API failures; keep poster image instead of crashing.
      setTrailer("");
    }
  };

  const startHold = () => {
    holdTimer.current = setTimeout(() => {
      loadTrailer();
      setPreview(true);
    }, 700);
  };

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setPreview(false);
  };

  const startHover = () => {
    setHover(true);
    startHold();
  };

  const endHover = () => {
    setHover(false);
    cancelHold();
  };

  const openDetails = () => {
    addToContinue(movie);
    addXP(15);
    addProfileXP(15);
    window.location.href = isTV
      ? `/tv/${movie.id}`
      : `/movie/${movie.id}`;
  };

  const onTouchStart = () => startHold();
  const onTouchEnd = () => cancelHold();

  return (
    <div
      style={{
        position: "relative",
        cursor: "pointer",
        transition: "transform .3s ease",
      }}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      onClick={openDetails}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 16,
          transform: hover ? "scale(1.05) translateY(-3px)" : "scale(1)",
          transition: "transform .35s ease, box-shadow .35s ease",
          boxShadow: hover
            ? "0 0 65px rgba(124,58,237,.75), 0 0 24px rgba(6,182,212,.28)"
            : "0 0 28px rgba(0,0,0,.55)",
        }}
      >
        {preview && trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0`}
            style={{
              width: "100%",
              aspectRatio: "2/3",
              border: "none",
              background: "black",
              pointerEvents: "none",
            }}
          />
        ) : (
          <img
            src={
              movie.poster_path
                ? IMG + movie.poster_path
                : "https://via.placeholder.com/300x450"
            }
            style={{
              width: "100%",
              display: "block",
            }}
            loading="lazy"
            decoding="async"
            alt={movie.title || movie.name || "Movie"}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hover
              ? "linear-gradient(to top, rgba(4,6,16,.92) 0%, rgba(4,6,16,.15) 55%, rgba(4,6,16,.36) 100%)"
              : "linear-gradient(to top, rgba(0,0,0,.35) 0%, transparent 55%)",
            transition: "all .25s ease",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".04em",
            color: "white",
            border: "1px solid rgba(255,255,255,.3)",
            background: preview
              ? "linear-gradient(135deg, rgba(34,197,94,.65), rgba(6,182,212,.65))"
              : "rgba(124,58,237,.55)",
            boxShadow: "0 0 22px rgba(124,58,237,.45)",
            pointerEvents: "none",
          }}
        >
          {preview ? "LIVE TRAILER" : "GALAXY PICK"}
        </div>

        {hover && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: 12,
              color: "white",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 13 }}>
              {movie.title || movie.name}
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: "#facc15", fontWeight: 700 }}>
              ⭐ {(movie.vote_average || 0).toFixed(1)} • {isTV ? "TV Series" : "Movie"}
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: "#d1d5db", opacity: 0.95 }}>
              {movie.overview?.slice(0, 76) || "Top pick with cinematic vibe."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ================= ROW ================= */
function Row({
  title,
  url,
}: {
  title: ReactNode;
  url: string;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    tmdb<Res>(url).then((r) =>
      setMovies(
        r.results
          .filter((m) => {
            const date = m.release_date || m.first_air_date;
            return !!date && new Date(date).getFullYear() >= 2015;
          })
          .slice(0, 12)
      )
    );
  }, [url]);

  return (
    <section style={{ marginBottom: 70 }}>
      <h2 style={{ color: "white", fontSize: 22, marginBottom: 16 }}>
        {title}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 24,
        }}
      >
        {movies.map((m) => (
          <div key={m.id}>
            {/*  poster now has hover trailer preview */}
            <Poster
              movie={m}
            />

            {/*  KEEP your name + rating exactly */}
            <div style={{ color: "white", fontSize: 13, marginTop: 6 }}>
              {m.title || m.name}
            </div>
            <div style={{ color: "#facc15", fontSize: 12 }}>
              <span className="icon-inline">
                <GlowIcon name="star" size={12} className="glow-icon" />
                Rating {m.vote_average.toFixed(1)}
              </span>
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: "#cfcfcf" }}>
              Hold to preview - Tap to open
            </div>

            {/*  KEEP your button exactly */}
            <button
              onClick={() => saveTonight(m)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "6px 0",
                borderRadius: 12,
                background: "rgba(124,58,237,.25)",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <span className="icon-inline">
                <GlowIcon name="moon" size={14} className="glow-icon" />
                Save for tonight
              </span>
            </button>

            {/*  ADDED: LOVE BUTTON (My List) */}
            <button
              onClick={() => saveToList(m)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "6px 0",
                borderRadius: 12,
                background: "rgba(255, 0, 90, .18)",
                border: "1px solid rgba(255, 0, 90, .25)",
                color: "white",
                cursor: "pointer",
              }}
            >
              <span className="icon-inline">
                <GlowIcon name="heart" size={14} className="glow-icon" />
                Add to My List
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= CONTINUE WATCHING TV ================= */
type ContinueTVItem = {
  id: number;
  name: string;
  poster: string | null;
  season: number;
  episode: number;
};

function ContinueWatchingTV() {
  const [shows, setShows] = useState<ContinueTVItem[]>([]);

  useEffect(() => {
    const profileRaw = localStorage.getItem("active-profile");
    let profile = "default";

    if (profileRaw) {
      try {
        profile = JSON.parse(profileRaw)?.id || "default";
      } catch {
        profile = profileRaw;
      }
    }

    const raw =
      localStorage.getItem(`continue-tv-${profile}`) ||
      localStorage.getItem("continue-tv");

    if (!raw) return;
    setShows(JSON.parse(raw));
  }, []);

  if (!shows.length) return null;

  return (
    <section style={{ marginBottom: 70 }}>
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>
        Continue Watching (TV)
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 24,
        }}
      >
        {shows.map((s) => (
          <div
            key={s.id}
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.location.href = `/tv/${s.id}`;
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${s.poster}`}
              style={{ width: "100%", borderRadius: 14 }}
              alt={s.name || "TV show"}
            />
            <div style={{ fontSize: 13, marginTop: 6 }}>
              {s.name}
            </div>
            <div style={{ color: "#aaa", fontSize: 12 }}>
              S{s.season} - E{s.episode}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= TOP BAR ================= */
function TopBar() {
  const [pick, setPick] = useState<Movie | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    tmdb<Res>("/movie/now_playing").then((r) => {
      const recent = r.results.filter(from2015);
      setPick(recent.sort((a, b) => b.vote_average - a.vote_average)[0]);
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        marginBottom: 30,
      }}
    >
      {pick && (
        <button
          onClick={() => saveTonight(pick)}
          style={{
            padding: "10px 18px",
            borderRadius: 20,
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
            border: "none",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span className="icon-inline">
            <GlowIcon name="moon" size={14} className="glow-icon" />
            Tonight's Pick
          </span>
        </button>
      )}

      <div style={{ display: "flex", gap: 12, flex: 1 }}>
        <input
          placeholder="Search the galaxy..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && q.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(q)}`;
            }
          }}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,.2)",
            background: "rgba(0,0,0,.6)",
            color: "white",
            height: 44,
          }}
        />
        <VoiceSearch
          value={q}
          onChange={setQ}
          onSubmit={() => {
            if (q.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(q)}`;
            }
          }}
        />
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function HomePage() {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "o" && e.ctrlKey) {
        window.location.href = "/surprise";
      }
    };

    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "radial-gradient(circle at top,#0b0b18 0%,#05050a 70%)",
      }}
    >
      <TopBar />
      <ContinueRail />
      <AdSlot placement="Home Top" />
      <ContinueWatchingRow />

      {/* ===== GALAXY ORACLE PROMO ===== */}
      <section
        style={{
          marginBottom: 60,
          padding: 24,
          borderRadius: 22,
          background:
            "linear-gradient(135deg, rgba(124,58,237,.22), rgba(236,72,153,.12))",
          border: "1px solid rgba(255,255,255,.1)",
          boxShadow: "0 0 40px rgba(124,58,237,.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            <span className="icon-inline">
              <GlowIcon name="shuffle" size={18} className="glow-icon" />
              Galaxy Oracle
            </span>
          </h2>
          <p style={{ color: "#bbb", marginTop: 4 }}>
            Don't scroll. Let destiny choose a 2020+ movie based on your taste.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => (window.location.href = "/surprise")}
            style={{
              padding: "12px 18px",
              borderRadius: 18,
              background: "linear-gradient(135deg,#7c3aed,#ec4899)",
              border: "none",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="spark" size={16} className="glow-icon" />
              Open Oracle
            </span>
          </button>
          <button
            onClick={() => (window.location.href = "/binge-tonight?mood=tv")}
            style={{
              padding: "12px 18px",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,.2)",
              background: "rgba(255,255,255,.08)",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            TV Mode
          </button>
        </div>
      </section>

      <ContinueRow />

      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="flame" size={16} className="glow-icon" />
            Trending Now
          </span>
        }
        url="/trending/movie/week"
      />
      <RealAds />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="film" size={16} className="glow-icon" />
            Popular Movies
          </span>
        }
        url="/movie/popular"
      />
      <AdSlot />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="star" size={16} className="glow-icon" />
            Top Rated
          </span>
        }
        url="/movie/top_rated"
      />
      <AdSlot placement="Home Mid" />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="rocket" size={16} className="glow-icon" />
            Sci-Fi
          </span>
        }
        url="/discover/movie?with_genres=878"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="mask" size={16} className="glow-icon" />
            Comedy
          </span>
        }
        url="/discover/movie?with_genres=35"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="skull" size={16} className="glow-icon" />
            Horror
          </span>
        }
        url="/discover/movie?with_genres=27"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="spark" size={16} className="glow-icon" />
            Anime
          </span>
        }
        url="/discover/movie?with_genres=16"
      />
      <ContinueWatchingTV />
      <Row title="Trending TV Shows" url="/trending/tv/week" />
      <Row title="Popular TV" url="/tv/popular" />
      <Row title="Sci-Fi TV" url="/discover/tv?with_genres=10765" />
    </main>
  );
}



