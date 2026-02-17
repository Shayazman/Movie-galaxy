"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { tmdb, IMG, Movie } from "@/lib/tmdb";
import { upsertContinue } from "@/lib/continue";

type Details = Movie & {
  name?: string;
  first_air_date?: string;
  backdrop_path?: string | null;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYT(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if (window.YT && window.YT.Player) return resolve();

    const existing = document.getElementById("yt-iframe-api");
    if (existing) return resolve();

    const tag = document.createElement("script");
    tag.id = "yt-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => resolve();
  });
}

export default function WatchPage() {
  const router = useRouter();
  const params = useParams<{ type: string; id: string }>();
  const sp = useSearchParams();

  const type = (params?.type as "movie" | "tv") || "movie";
  const id = params?.id;
  const yt = sp.get("yt");

  const [details, setDetails] = useState<Details | null>(null);
  const [progress, setProgress] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const lastSaveRef = useRef(0);

  useEffect(() => {
    if (!id) return;

    tmdb<Details>(`/${type}/${id}`)
      .then((d) => setDetails(d))
      .catch(() => router.push("/home"));
  }, [id, type, router]);

  const title = useMemo(() => {
    if (!details) return "Watch";
    return details.title || details.name || "Watch";
  }, [details]);

  useEffect(() => {
    if (!yt || !details) return;

    let alive = true;
    let tick: ReturnType<typeof setInterval> | null = null;

    (async () => {
      await loadYT();
      if (!alive) return;

      playerRef.current = new window.YT.Player("yt-player", {
        videoId: yt,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
      });

      tick = setInterval(() => {
        try {
          const t = Math.floor(playerRef.current?.getCurrentTime?.() || 0);
          setProgress(t);

          const now = Date.now();
          if (now - lastSaveRef.current > 2500) {
            lastSaveRef.current = now;
            upsertContinue({
              id: Number(details.id),
              mediaType: type,
              title,
              poster_path: details.poster_path || null,
              backdrop_path: details.backdrop_path || null,
              youtubeKey: yt,
              progressSec: t,
              updatedAt: Date.now(),
            });
          }
        } catch {}
      }, 1000);
    })();

    return () => {
      alive = false;
      if (tick) clearInterval(tick);
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [yt, details, title, type]);

  if (!details) {
    return (
      <main style={{ padding: 32, color: "white" }}>
        <div style={{ color: "#aaa" }}>Loading...</div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "radial-gradient(circle at top,#0b0b18 0%,#05050a 70%)",
        color: "white",
      }}
    >
      <button
        onClick={() => router.back()}
        style={{
          border: "none",
          background: "rgba(0,0,0,.45)",
          color: "white",
          padding: "10px 12px",
          borderRadius: 14,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          marginBottom: 14,
        }}
      >
        Back
      </button>

      <div
        style={{
          borderRadius: 22,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 0 70px rgba(124,58,237,.18)",
          background: "#070710",
        }}
      >
        <div
          style={{
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
          <div style={{ color: "#c4b5fd", fontSize: 13 }}>{progress}s</div>
        </div>

        {yt ? (
          <div style={{ background: "black" }}>
            <div id="yt-player" style={{ width: "100%", aspectRatio: "16/9" }} />
          </div>
        ) : (
          <div style={{ padding: 18, color: "#bbb" }}>
            No YouTube key was provided. Open a movie page and click Trailer.
          </div>
        )}

        <div style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <img
            src={
              details.poster_path
                ? IMG + details.poster_path
                : "https://via.placeholder.com/300x450"
            }
            alt={title}
            style={{ width: 70, borderRadius: 14 }}
          />
          <div style={{ color: "#bbb", fontSize: 13 }}>
            This page saves progress automatically.
          </div>
        </div>
      </div>
    </main>
  );
}
