export type Party = {
  id: string;
  movieId: number;
  time: number;
  name: string;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function createParty(movieId: number) {
  if (!canUseStorage()) {
    return { id: "", movieId, time: Date.now(), name: "Galaxy Room" };
  }

  const raw = localStorage.getItem("galaxy-parties");
  const all: Party[] = raw ? JSON.parse(raw) : [];

  const p: Party = {
    id: Math.random().toString(36).slice(2, 8),
    movieId,
    time: Date.now() + 5 * 60 * 1000,
    name: "Galaxy Room",
  };

  all.push(p);
  localStorage.setItem("galaxy-parties", JSON.stringify(all));

  return p;
}

export function getParties(movieId: number) {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem("galaxy-parties");
  const all: Party[] = raw ? JSON.parse(raw) : [];

  return all.filter((p) => p.movieId === movieId);
}
