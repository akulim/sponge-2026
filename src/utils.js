// Logic for randomizing data and calculating risk
export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function seededValue(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

export function riskToLevel(score) {
  if (score >= 67) return "High";
  if (score >= 34) return "Medium";
  return "Low";
}

export function levelToStatus(level) {
  if (level === "High") return "elevated";
  if (level === "Medium") return "monitor";
  return "stable";
}