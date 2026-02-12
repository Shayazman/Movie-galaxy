import { Movie } from "@/lib/tmdb";

export default function Affiliates({ movie }: { movie: Movie }) {
  const q = encodeURIComponent(movie.title || movie.name || "movie");

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Watch / Buy</h3>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.amazon.com/s?k=${q}`}
      >
        Amazon
      </a>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.netflix.com/search?q=${q}`}
        style={{ marginLeft: 12 }}
      >
        Netflix
      </a>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.youtube.com/results?search_query=${q}+movie`}
        style={{ marginLeft: 12 }}
      >
        YouTube
      </a>
    </div>
  );
}
