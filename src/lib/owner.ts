const KEY = "OWNER";
const LEGACY_KEY = "galaxy-owner";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function isOwner() {
  if (!canUseStorage()) return false;
  return localStorage.getItem(KEY) === "1" || localStorage.getItem(LEGACY_KEY) === "true";
}

export function ownerLogin(pass: string) {
  if (!canUseStorage()) return false;
  const expected = process.env.NEXT_PUBLIC_OWNER_PASS || "1234";
  const ok = pass === expected;
  if (ok) {
    localStorage.setItem(KEY, "1");
    // keep legacy key in sync so old checks continue to work
    localStorage.setItem(LEGACY_KEY, "true");
  }
  return ok;
}

export function ownerLogout() {
  if (!canUseStorage()) return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(LEGACY_KEY);
}

// Backward-compatible names used by existing pages
export const loginOwner = ownerLogin;
export const logoutOwner = ownerLogout;
