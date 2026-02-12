const KEY = "galaxy-owner";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function loginOwner(pass: string) {
  if (!canUseStorage()) return false;
  if (pass === "ELVIS-GALAXY-2026") {
    localStorage.setItem(KEY, "true");
    return true;
  }
  return false;
}

export function isOwner() {
  if (!canUseStorage()) return false;
  return localStorage.getItem(KEY) === "true";
}

export function logoutOwner() {
  if (!canUseStorage()) return;
  localStorage.removeItem(KEY);
}
