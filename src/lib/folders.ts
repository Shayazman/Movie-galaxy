export type Folder = {
  name: string;
  movies: number[];
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getFolders(): Folder[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem("galaxy-folders");
  return raw ? JSON.parse(raw) : [];
}

export function addToFolder(folder: string, movieId: number) {
  if (!canUseStorage()) return;
  const all = getFolders();

  let f = all.find((x) => x.name === folder);

  if (!f) {
    f = { name: folder, movies: [] };
    all.push(f);
  }

  if (!f.movies.includes(movieId)) f.movies.push(movieId);

  localStorage.setItem("galaxy-folders", JSON.stringify(all));
}
