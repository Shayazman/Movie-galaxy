import { Movie } from "@/lib/tmdb";

export function getUserDNA(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("movie-galaxy-list");
    const list: Movie[] = raw ? JSON.parse(raw) : [];
    return list.flatMap((m: any) => m?.genre_ids ?? []);
  } catch {
    return [];
  }
}

export function scoreMovieToDNA(movie: any, dna: number[]) {
  const g: number[] = movie?.genre_ids ?? [];
  let match = 0;
  for (const id of g) if (dna.includes(id)) match++;
  return match;
}

export function aiSuggest(movies: Movie[], mood: string) {
  if (mood === "parents")
    return movies.find(
      (m) => m.genre_ids?.includes(18) || m.genre_ids?.includes(35)
    );

  if (mood === "girlfriend")
    return movies.find((m) => m.genre_ids?.includes(10749));

  if (mood === "friends")
    return movies.find(
      (m) => m.genre_ids?.includes(28) || m.genre_ids?.includes(35)
    );

  return movies[0];
}
