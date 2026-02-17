export type ContinueItem = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  youtubeKey?: string | null;
  progressSec: number;
  durationSec?: number;
  updatedAt: number;
};

const KEY = "movie-galaxy-continue";

export function readContinue(): ContinueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ContinueItem[]) : [];
  } catch {
    return [];
  }
}

export function upsertContinue(item: ContinueItem) {
  if (typeof window === "undefined") return;
  const list = readContinue();

  const idx = list.findIndex(
    (x) => x.id === item.id && x.mediaType === item.mediaType
  );

  if (idx >= 0) list[idx] = item;
  else list.unshift(item);

  const trimmed = list.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 24);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function removeContinue(id: number, mediaType: "movie" | "tv") {
  if (typeof window === "undefined") return;
  const list = readContinue().filter(
    (x) => !(x.id === id && x.mediaType === mediaType)
  );
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearContinue() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
