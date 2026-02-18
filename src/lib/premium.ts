export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  const values = new Set(["1", "true"]);
  return (
    values.has(localStorage.getItem("movie-galaxy-premium") || "") ||
    values.has(localStorage.getItem("mg_premium") || "") ||
    values.has(localStorage.getItem("premium") || "") ||
    values.has(localStorage.getItem("mg-premium") || "")
  );
}

export function setPremium(on: boolean) {
  if (typeof window === "undefined") return;
  const v = on ? "1" : "0";
  localStorage.setItem("movie-galaxy-premium", v);
  localStorage.setItem("mg_premium", v);
  localStorage.setItem("premium", v);
  localStorage.setItem("mg-premium", on ? "true" : "false");
}

export function enablePremium() {
  setPremium(true);
}

export function disablePremium() {
  setPremium(false);
}

export function buyPremium() {
  setPremium(true);
}

export function requirePremium(featureName: string): boolean {
  if (isPremium()) return true;
  alert(`Premium feature: ${featureName}\n\nOpen Premium page to unlock.`);
  window.location.href = "/premium";
  return false;
}
