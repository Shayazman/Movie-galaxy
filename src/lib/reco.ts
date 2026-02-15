import type { Movie } from "@/lib/tmdb";

export function getFavoriteGenreIds(): number[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem("movie-galaxy-list");
    const list: Array<Partial<Movie>> = raw ? JSON.parse(raw) : [];
    const ids: number[] = [];

    for (const movie of list) {
      const genres = Array.isArray(movie.genre_ids) ? movie.genre_ids : [];
      for (const genre of genres) ids.push(genre);
    }

    return ids;
  } catch {
    return [];
  }
}

export function boostByDNA<
  T extends { genre_ids?: number[]; vote_average?: number }
>(movies: T[], dna: number[]) {
  return [...movies].sort((a, b) => {
    const am = (a.genre_ids || []).filter((g) => dna.includes(g)).length;
    const bm = (b.genre_ids || []).filter((g) => dna.includes(g)).length;
    const as = (a.vote_average || 0) + am * 0.6;
    const bs = (b.vote_average || 0) + bm * 0.6;
    return bs - as;
  });
}
