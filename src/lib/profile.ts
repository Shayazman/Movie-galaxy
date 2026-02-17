export type Profile = {
  id: string;
  name: string;
  avatar: string;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getProfiles(): Profile[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem("mg-profiles");
  return raw ? JSON.parse(raw) : [];
}

export function saveProfiles(p: Profile[]) {
  if (!canUseStorage()) return;
  localStorage.setItem("mg-profiles", JSON.stringify(p));
}

export function getActiveProfile(): Profile | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem("mg-active-profile");
  if (raw) return JSON.parse(raw);

  // Backward compatibility with older profile storage.
  const legacy = localStorage.getItem("active-profile");
  return legacy ? JSON.parse(legacy) : null;
}

export function setActiveProfile(p: Profile) {
  if (!canUseStorage()) return;
  localStorage.setItem("mg-active-profile", JSON.stringify(p));
}

export function profileKey(key: string) {
  const active = getActiveProfile();
  return active?.id ? `${key}-${active.id}` : key;
}

export function getProfile() {
  if (!canUseStorage()) return { name: "Explorer", level: 1, xp: 0 };
  const raw = localStorage.getItem("galaxy-profile");
  return raw
    ? JSON.parse(raw)
    : { name: "Explorer", level: 1, xp: 0 };
}

export function addXP(amount: number) {
  if (!canUseStorage()) return;
  const p = getProfile();

  p.xp += amount;

  if (p.xp > p.level * 100) {
    p.level += 1;
    p.xp = 0;
  }

  localStorage.setItem("galaxy-profile", JSON.stringify(p));
}

export function tasteBadge(): string {
  if (!canUseStorage()) return "Movie Explorer";
  const raw = localStorage.getItem(profileKey("movie-galaxy-list"));
  const list = raw ? JSON.parse(raw) : [];

  const genres = list.flatMap((m: any) => m.genre_ids || []);

  if (genres.includes(27)) return "Horror Soul";
  if (genres.includes(35)) return "Comedy Spirit";
  if (genres.includes(878)) return "Sci-Fi Mind";
  if (genres.includes(10749)) return "Romance Heart";

  return "Movie Explorer";
}
