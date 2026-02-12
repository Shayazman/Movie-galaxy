"use client";

import { Movie } from "@/lib/tmdb";

export default function ShareCard({ movie }: { movie: Movie }) {
  const share = () => {
    const title = movie.title || movie.name || "Movie";
    const text =
      `Watching tonight: ${title}\n` +
      `Rating ${movie.vote_average}\n` +
      `From Movie Galaxy`;

    navigator.clipboard.writeText(text);
    alert("Copied for Instagram caption!");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button
        onClick={share}
        style={{
          padding: 10,
          borderRadius: 12,
          background: "#e1306c",
          color: "white",
          border: "none",
        }}
      >
        Share to Instagram
      </button>
    </div>
  );
}
