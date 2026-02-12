"use client";

import { useEffect, useState } from "react";
import { IMG, Movie } from "@/lib/tmdb";

export default function ContinueRow() {
  const [list, setList] = useState<Movie[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("mg-history");
    const data: Movie[] = raw ? JSON.parse(raw) : [];
    setList(data);
  }, []);

  if (!list.length) return null;

  return (
    <section style={{ marginBottom: 60 }}>
      <h2>Continue Watching</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: 20,
        }}
      >
        {list.map((m) => (
          <img
            key={m.id}
            src={IMG + m.poster_path}
            style={{ width: "100%", borderRadius: 14, cursor: "pointer" }}
            onClick={() => {
              window.location.href = `/movie/${m.id}`;
            }}
            alt={m.title || m.name || "Movie"}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </section>
  );
}
