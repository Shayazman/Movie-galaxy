"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { tmdb, IMG, Movie, getProviders } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";
import { addToContinue, addXP } from "@/lib/galaxy";
import { addXP as addProfileXP } from "@/lib/profile";
import ShareBar from "@/components/ShareBar";
import WatchParty from "@/components/WatchParty";
import AdSlot from "@/components/AdSlot";
import SupportBox from "@/components/SupportBox";
import ShareCard from "@/components/ShareCard";
import FolderManager from "@/components/FolderManager";
import GalaxyComments from "@/components/GalaxyComments";
import { YoutubeGen } from "@/components/YoutubeGen";
import RealAds from "@/components/RealAds";
import Affiliates from "@/components/Affiliates";

type Video = {
  key: string;
  site: string;
  type: string;
  name: string;
};

type Credits = {
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
  crew: { id: number; name: string; job: string }[];
};

type Details = Movie & {
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  overview?: string;
  backdrop_path?: string | null;
};

function fmtRuntime(min?: number) {
  if (!min || min <= 0) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function yearOf(m?: { release_date?: string }) {
  if (!m?.release_date) return "";
  const y = new Date(m.release_date).getFullYear();
  return Number.isFinite(y) ? String(y) : "";
}

function pickTrailer(videos: Video[]) {
  const yt = videos.filter((v) => v.site === "YouTube");
  // prefer official trailer
  const official = yt.find((v) => v.type === "Trailer" && /official/i.test(v.name));
  if (official) return official.key;

  const trailer = yt.find((v) => v.type === "Trailer");
  if (trailer) return trailer.key;

  const teaser = yt.find((v) => v.type === "Teaser");
  if (teaser) return teaser.key;

  return null;
}

function labelVideo(v: Video) {
  const t = v.type || "Video";
  const n = v.name || "";
  if (/official/i.test(n) && t === "Trailer") return "Official Trailer";
  if (t === "Trailer") return "Trailer";
  if (t === "Teaser") return "Teaser";
  return `${t}: ${n}`.slice(0, 40);
}

function defaultTrailerKey(videos: Video[]) {
  return pickTrailer(videos);
}

/* ===== Trailer Modal ===== */
function TrailerModal({
  open,
  onClose,
  youtubeKey,
  title,
}: {
  open: boolean;
  onClose: () => void;
  youtubeKey: string | null;
  title: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.72)",
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 96vw)",
          borderRadius: 18,
          overflow: "hidden",
          background: "#070710",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 0 60px rgba(124,58,237,.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div style={{ fontWeight: 700 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "rgba(255,255,255,.08)",
              color: "white",
              cursor: "pointer",
              padding: "8px 10px",
              borderRadius: 10,
            }}
          >
            X
          </button>
        </div>

        <div style={{ background: "black" }}>
          {youtubeKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=0&controls=1&rel=0`}
              style={{
                width: "100%",
                aspectRatio: "16/9",
                border: "none",
              }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Trailer"
            />
          ) : (
            <div style={{ padding: 22, color: "#bbb" }}>
              No trailer found for this movie.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MoviePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [details, setDetails] = useState<Details | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<string[]>([]);
  const [aiReview, setAiReview] = useState("");

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const trailerKey = useMemo(() => {
    return selectedKey || defaultTrailerKey(videos);
  }, [selectedKey, videos]);

  useEffect(() => {
    if (!id) return;

    let alive = true;
    setLoading(true);

    Promise.all([
      tmdb<Details>(`/movie/${id}`),
      tmdb<Credits>(`/movie/${id}/credits`),
      tmdb<{ results: Video[] }>(`/movie/${id}/videos`),
      tmdb<{ results: Movie[] }>(`/movie/${id}/similar`),
    ])
      .then(([d, c, v, s]) => {
        if (!alive) return;
        setDetails(d);
        fetch("/api/ai/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: d.title || d.name,
            overview: d.overview,
            year: d.release_date?.slice(0, 4),
            rating: d.vote_average,
          }),
        })
          .then((r) => r.json())
          .then((x) => {
            if (!alive) return;
            setAiReview(x.review || "");
          })
          .catch(() => {
            if (!alive) return;
            setAiReview("");
          });
        addToContinue(d);
        addXP(25);
        addProfileXP(25);
        setCredits(c);
        setVideos(v.results || []);
        setSimilar((s.results || []).slice(0, 12));
      })
      .catch(() => {
        // if invalid id, go back safely
        router.push("/home");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    getProviders(Number(id)).then((r) => {
      const tz = r.results?.TZ?.flatrate || [];
      setProviders(tz.map((p: any) => p.provider_name));
    });
  }, [id]);

  useEffect(() => {
    if (!details || typeof window === "undefined") return;
    const raw = localStorage.getItem("mg-history");
    const h: Movie[] = raw ? JSON.parse(raw) : [];
    const next = [details, ...h.filter((m) => m.id !== details.id)].slice(0, 8);
    localStorage.setItem("mg-history", JSON.stringify(next));
  }, [details]);

  if (loading) {
    return (
      <main style={{ padding: 32, color: "white" }}>
        <div style={{ color: "#aaa" }}>Loading movie...</div>
      </main>
    );
  }

  if (!details) {
    return (
      <main style={{ padding: 32, color: "white" }}>
        <div style={{ color: "#aaa" }}>Movie not found.</div>
      </main>
    );
  }

  const title = details.title || details.name || "Movie";
  const year = yearOf(details);
  const genres = (details.genres || []).map((g) => g.name).join("  -  ");
  const runtime = fmtRuntime(details.runtime);

  const director =
    credits?.crew?.find((p) => p.job === "Director")?.name || "";

  const topCast = (credits?.cast || []).slice(0, 8);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background:
          "radial-gradient(circle at top,#0b0b18 0%,#05050a 70%)",
        color: "white",
      }}
    >
      {/* HERO */}
      <section
        style={{
          borderRadius: 26,
          overflow: "hidden",
          position: "relative",
          minHeight: 420,
          background: details.backdrop_path
            ? `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.92)),
               url(${IMG + details.backdrop_path}) center/cover`
            : "linear-gradient(135deg,#0b0b18,#05050a)",
          border: "1px solid rgba(255,255,255,.06)",
          boxShadow: "0 0 60px rgba(124,58,237,.18)",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            border: "none",
            background: "rgba(0,0,0,.45)",
            color: "white",
            padding: "10px 12px",
            borderRadius: 14,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          Back
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 24,
            padding: 26,
            alignItems: "end",
          }}
        >
          {/* Poster */}
          <div
            style={{
              width: 220,
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 0 40px rgba(0,0,0,.7)",
              border: "1px solid rgba(255,255,255,.06)",
            }}
          >
            <img
              src={
                details.poster_path
                  ? IMG + details.poster_path
                  : "https://via.placeholder.com/300x450"
              }
              alt={title}
              style={{ width: "100%", display: "block" }}
            />
          </div>

          {/* Info */}
          <div>
            <h1
              style={{
                fontSize: 46,
                fontWeight: 900,
                marginBottom: 8,
                textShadow: "0 0 35px rgba(124,58,237,.55)",
              }}
            >
              {title}
            </h1>

            <div style={{ color: "#ddd", marginBottom: 12 }}>
              <span style={{ color: "#facc15" }} className="icon-inline">
                <GlowIcon name="star" size={12} className="glow-icon" />
                Rating {details.vote_average?.toFixed?.(1) ?? "-"}
              </span>
              {"  "} - {"  "}
              {year || "-"}
              {"  "} - {"  "}
              {runtime || "-"}
              {genres ? (
                <>
                  {"  "} - {"  "}
                  {genres}
                </>
              ) : null}
            </div>

            {details.tagline ? (
              <div style={{ color: "#bbb", marginBottom: 10, fontStyle: "italic" }}>
                "{details.tagline}"
              </div>
            ) : null}

            {providers.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {providers.map((p) => (
                  <span
                    key={p}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,.1)",
                      fontSize: 12,
                    }}
                  >
                    📺 {p}
                  </span>
                ))}
              </div>
            )}

            <p style={{ color: "#ccc", maxWidth: 900, lineHeight: 1.6 }}>
              {details.overview || "No overview available."}
            </p>

            <Affiliates movie={details} />

            <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => setTrailerOpen(true)}
                style={{
                  padding: "12px 18px",
                  borderRadius: 18,
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                  boxShadow: "0 0 30px rgba(124,58,237,.35)",
                }}
              >
                <span className="icon-inline">
                  <GlowIcon name="play" size={14} className="glow-icon" />
                  Trailer
                </span>
              </button>

              <button
                onClick={() => {
                  localStorage.setItem("tonight", JSON.stringify(details));
                  router.push("/tonight");
                }}
                style={{
                  padding: "12px 18px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,.16)",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: 700,
                  background: "rgba(255,255,255,.06)",
                }}
              >
                <span className="icon-inline">
                  <GlowIcon name="moon" size={14} className="glow-icon" />
                  Save for Tonight
                </span>
              </button>

              <button
                onClick={() => {
                  const raw = localStorage.getItem("movie-galaxy-list");
                  const list: Movie[] = raw ? JSON.parse(raw) : [];
                  if (!list.find((m) => m.id === details.id)) {
                    list.push(details);
                    localStorage.setItem("movie-galaxy-list", JSON.stringify(list));
                  }
                }}
                style={{
                  padding: "12px 18px",
                  borderRadius: 18,
                  border: "1px solid rgba(255, 0, 90, .28)",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: 700,
                  background: "rgba(255, 0, 90, .14)",
                }}
              >
                <span className="icon-inline">
                  <GlowIcon name="heart" size={14} className="glow-icon" />
                  Add to My List
                </span>
              </button>
            </div>

            {videos.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ color: "#aaa", fontSize: 13, alignSelf: "center" }}>
                  Trailer:
                </div>

                <select
                  value={selectedKey || ""}
                  onChange={(e) => setSelectedKey(e.target.value || null)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: "rgba(0,0,0,.55)",
                    border: "1px solid rgba(255,255,255,.14)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Best (Auto)</option>
                  {videos
                    .filter((v) => v.site === "YouTube")
                    .map((v) => (
                      <option key={v.key} value={v.key}>
                        {labelVideo(v)}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {director ? (
              <div style={{ marginTop: 14, color: "#aaa", fontSize: 13 }}>
                Director: <span style={{ color: "#ddd" }}>{director}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {aiReview ? (
        <section
          style={{
            marginTop: 26,
            padding: 18,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(0,0,0,.35)",
            boxShadow: "0 0 40px rgba(124,58,237,.12)",
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>AI Review</h2>
          <p style={{ color: "#ddd", lineHeight: 1.6, margin: 0 }}>{aiReview}</p>
        </section>
      ) : null}

      <ShareBar title={title} />
      <WatchParty movie={details} />
      <ShareCard movie={details} />
      <FolderManager movie={details} />
      <YoutubeGen movie={details} />
      <GalaxyComments movie={details} />
      <AdSlot placement="Movie Details" />
      <SupportBox />

{/* ================= CAST CAROUSEL ================= */}
<section style={{ marginTop: 32 }}>
  <h2 style={{ fontSize: 22, marginBottom: 12 }}>Top Cast</h2>

  <div style={{ position: "relative" }}>
    {/* LEFT ARROW */}
    <button
      onClick={() => {
        const el = document.getElementById("cast-scroll");
        el?.scrollBy({ left: -260, behavior: "smooth" });
      }}
      style={{
        position: "absolute",
        left: -10,
        top: "40%",
        zIndex: 10,
        background: "rgba(0,0,0,.7)",
        border: "1px solid rgba(255,255,255,.1)",
        color: "white",
        borderRadius: "50%",
        width: 34,
        height: 34,
        cursor: "pointer",
      }}
      >
        {"<"}
      </button>

    {/* RIGHT ARROW */}
    <button
      onClick={() => {
        const el = document.getElementById("cast-scroll");
        el?.scrollBy({ left: 260, behavior: "smooth" });
      }}
      style={{
        position: "absolute",
        right: -10,
        top: "40%",
        zIndex: 10,
        background: "rgba(0,0,0,.7)",
        border: "1px solid rgba(255,255,255,.1)",
        color: "white",
        borderRadius: "50%",
        width: 34,
        height: 34,
        cursor: "pointer",
      }}
      >
        {">"}
      </button>

    {/* SCROLL CONTAINER */}
    <div
      id="cast-scroll"
      style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        padding: "12px 4px",
        scrollSnapType: "x mandatory",
      }}
    >
      {topCast.map((c) => (
        <div
          key={c.id}
          style={{
            minWidth: 130,
            scrollSnapAlign: "start",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 120,
              height: 170,
              margin: "0 auto",
              borderRadius: 14,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,.08)",
              background: "#111",
            }}
          >
            <img
              src={
                c.profile_path
                  ? IMG + c.profile_path
                  : "https://via.placeholder.com/300x450?text=No+Photo"
              }
              alt={c.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "all .3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.07)";
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(124,58,237,.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginTop: 8, fontWeight: 700, fontSize: 14 }}>
            {c.name}
          </div>

          <div style={{ color: "#bbb", fontSize: 12 }}>
            {c.character}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      <RealAds />

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 22, marginBottom: 14 }}>More Like This</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))",
              gap: 18,
            }}
          >
            {similar.map((m) => (
              <Link
                key={m.id}
                href={`/movie/${m.id}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                <img
                  src={
                    m.poster_path ? IMG + m.poster_path : "https://via.placeholder.com/300x450"
                  }
                  style={{ width: "100%", borderRadius: 14 }}
                  alt={m.title || m.name || "Movie"}
                />
                <div style={{ fontSize: 13, marginTop: 6 }}>
                  {m.title || m.name}
                </div>
                <div style={{ color: "#facc15", fontSize: 12 }}>
                  <span className="icon-inline">
                    <GlowIcon name="star" size={12} className="glow-icon" />
                    Rating {m.vote_average.toFixed(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        youtubeKey={trailerKey}
        title={title}
      />
    </main>
  );
}



