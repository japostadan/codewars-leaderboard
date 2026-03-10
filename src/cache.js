export function saveCache(users) {
  localStorage.setItem("cw-leaderboard", JSON.stringify(users));
}

export function loadCache() {
  const raw = localStorage.getItem("cw-leaderboard");
  if (!raw) return false;
  try {
    return JSON.parse(raw);
  } catch {
    return false;
  }
}
