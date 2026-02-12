function canUseStorage() {
  return typeof window !== "undefined";
}

export function isPremium() {
  if (!canUseStorage()) return false;
  return localStorage.getItem("premium") === "1";
}

export function buyPremium() {
  if (!canUseStorage()) return;
  localStorage.setItem("premium", "1");
}
