export type Profile = {
  id: string;
  name: string;
  color: string;
  avatar: string;
};

export const defaultProfiles: Profile[] = [
  { id: "1", name: "Me", color: "#7c3aed", avatar: "🧑" },
  { id: "2", name: "Family", color: "#ff005a", avatar: "👨‍👩‍👧" },
  { id: "3", name: "Kids", color: "#00d4ff", avatar: "🧸" },
];

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getActiveProfile(): Profile {
  if (!canUseStorage()) return defaultProfiles[0];
  const p = localStorage.getItem("active-profile");
  return p ? JSON.parse(p) : defaultProfiles[0];
}

export function setActiveProfile(p: Profile) {
  if (!canUseStorage()) return;
  localStorage.setItem("active-profile", JSON.stringify(p));
}
