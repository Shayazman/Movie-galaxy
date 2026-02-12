"use client";

import { Movie } from "@/lib/tmdb";

export function YoutubeGen({ movie }: { movie: Movie }) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  const title =
    `${movie.title || movie.name} ${year ? "(" + year + ")" : ""} - Watch Tonight`;

  const desc = `
${movie.title || movie.name}
Rating: ${movie.vote_average}

${movie.overview || ""}

#movies #film #galaxypicks
  `;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>YouTube Kit</h3>

      <textarea value={title} style={{ width: "100%" }} readOnly />

      <textarea value={desc} rows={6} style={{ width: "100%" }} readOnly />
    </div>
  );
}
