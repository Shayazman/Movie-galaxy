export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem("movie-galaxy-premium") === "1" ||
    localStorage.getItem("mg_premium") === "1" ||
    localStorage.getItem("premium") === "1" ||
    localStorage.getItem("mg-premium") === "1"
  );
}

export function setPremium(on: boolean) {
  if (typeof window === "undefined") return;
  const v = on ? "1" : "0";
  localStorage.setItem("movie-galaxy-premium", v);
  localStorage.setItem("mg_premium", v);
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
