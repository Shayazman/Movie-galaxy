"use client";

import { useState } from "react";
import { Movie } from "@/lib/tmdb";
import { aiSuggest } from "@/lib/ai";
import GlowIcon from "@/components/GlowIcon";

export default function AISuggester({ movies }: { movies: Movie[] }) {
  const [pick, setPick] = useState<Movie | null>(null);

  return (
    <div className="card-glow" style={{ padding: 16, marginTop: 20 }}>
      <h3>
        <span className="icon-inline">
          <GlowIcon name="spark" size={14} className="glow-icon" />
          AI Choose For Me
        </span>
      </h3>

      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {["parents", "girlfriend", "friends"].map((m) => (
          <button
            key={m}
            onClick={() => setPick(aiSuggest(movies, m) || null)}
            style={{
              padding: 8,
              borderRadius: 10,
              border: "1px solid #7c3aed",
              background: "black",
              color: "white",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {pick && (
        <div style={{ marginTop: 12 }}>
          AI Pick: <b>{pick.title || pick.name}</b>
        </div>
      )}
    </div>
  );
}
