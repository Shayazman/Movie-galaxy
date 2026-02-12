import { Movie } from "@/lib/tmdb";

export type Comment = {
  id: string;
  movieId: number;
  user: string;
  text: string;
  rating: number;
  time: number;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getComments(movieId: number): Comment[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem("galaxy-comments");
    const all: Comment[] = raw ? JSON.parse(raw) : [];
    return all.filter((c) => c.movieId === movieId);
  } catch {
    return [];
  }
}

export function addComment(
  movie: Movie,
  user: string,
  text: string,
  rating: number
) {
  if (!canUseStorage()) return;
  try {
    const raw = localStorage.getItem("galaxy-comments");
    const all: Comment[] = raw ? JSON.parse(raw) : [];

    all.push({
      id: Math.random().toString(36).slice(2),
      movieId: movie.id,
      user,
      text,
      rating,
      time: Date.now(),
    });

    localStorage.setItem("galaxy-comments", JSON.stringify(all));
  } catch {
    // no-op
  }
}
