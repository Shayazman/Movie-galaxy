import { Movie } from "@/lib/tmdb";

export default function Affiliates({ movie }: { movie: Movie }) {
  const q = encodeURIComponent(movie.title || movie.name || "movie");

  return (
    <section
      className="card-glow"
      style={{
        marginTop: 20,
        padding: 14,
        borderRadius: 18,
        background: "rgba(0,0,0,.35)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 10 }}>Watch / Buy</h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://www.amazon.com/s?k=${q}`}
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.14)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Amazon
        </a>

        <a
          target="_blank"
          rel="noreferrer"
          href={`https://www.netflix.com/search?q=${q}`}
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid rgba(229,9,20,.45)",
            background: "rgba(229,9,20,.16)",
            color: "white",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Netflix
        </a>

        <a
          target="_blank"
          rel="noreferrer"
          href={`https://www.youtube.com/results?search_query=${q}+movie`}
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.14)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          YouTube
        </a>
      </div>
    </section>
  );
}
