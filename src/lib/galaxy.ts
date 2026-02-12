import type { Movie } from "@/lib/tmdb";

const KEY_CONTINUE = "movie-galaxy-continue";
const KEY_XP = "movie-galaxy-xp";
const KEY_CINEMA = "movie-galaxy-cinema";
const KEY_STREAK = "movie-galaxy-streak";

type ContinueItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  ts: number;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function yearOf(movie?: { release_date?: string }) {
  if (!movie?.release_date) return 0;
  const y = new Date(movie.release_date).getFullYear();
  return Number.isFinite(y) ? y : 0;
}

/* ================= CONTINUE WATCHING ================= */

export function addToContinue(movie: Movie) {
  if (!canUseStorage()) return;
  try {
    const raw = localStorage.getItem(KEY_CONTINUE);
    const list: ContinueItem[] = raw ? JSON.parse(raw) : [];

    const item: ContinueItem = {
      id: movie.id,
      title: movie.title,
      name: movie.name,
      poster_path: movie.poster_path ?? null,
      backdrop_path: (movie as any).backdrop_path ?? null,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      ts: Date.now(),
    };

    const next = [item, ...list.filter((x) => x.id !== movie.id)].slice(0, 18);
    localStorage.setItem(KEY_CONTINUE, JSON.stringify(next));
  } catch {
    // no-op
  }
}

export function getContinue(): ContinueItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(KEY_CONTINUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ================= XP / LEVEL ================= */

export function addXP(amount: number) {
  if (!canUseStorage()) return;
  try {
    const xp = getXP() + amount;
    localStorage.setItem(KEY_XP, String(xp));
  } catch {
    // no-op
  }
}

export function getXP(): number {
  if (!canUseStorage()) return 0;
  try {
    return Number(localStorage.getItem(KEY_XP) || 0);
  } catch {
    return 0;
  }
}

// Simple leveling curve
export function levelFromXP(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 120)) + 1; // grows slowly
  const nextLevelXP = 120 * (level * level);
  const prevLevelXP = 120 * ((level - 1) * (level - 1));
  const progress =
    nextLevelXP === prevLevelXP ? 0 : (xp - prevLevelXP) / (nextLevelXP - prevLevelXP);

  return { level, progress: Math.min(1, Math.max(0, progress)), nextLevelXP };
}

/* ================= STREAK ================= */

export function touchStreak() {
  if (!canUseStorage()) return;
  try {
    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    const raw = localStorage.getItem(KEY_STREAK);
    const data = raw ? JSON.parse(raw) : { lastKey: "", count: 0 };

    if (data.lastKey === key) return;

    // if yesterday, +1 else reset
    const y = new Date(today);
    y.setDate(today.getDate() - 1);
    const yKey = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;

    const next = {
      lastKey: key,
      count: data.lastKey === yKey ? data.count + 1 : 1,
    };

    localStorage.setItem(KEY_STREAK, JSON.stringify(next));
  } catch {
    // no-op
  }
}

export function getStreak(): number {
  if (!canUseStorage()) return 0;
  try {
    const raw = localStorage.getItem(KEY_STREAK);
    return raw ? JSON.parse(raw).count || 0 : 0;
  } catch {
    return 0;
  }
}

/* ================= CINEMA MODE ================= */

export function setCinemaMode(on: boolean) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(KEY_CINEMA, on ? "1" : "0");
  } catch {
    // no-op
  }
}

export function getCinemaMode(): boolean {
  if (!canUseStorage()) return false;
  try {
    return localStorage.getItem(KEY_CINEMA) === "1";
  } catch {
    return false;
  }
}
