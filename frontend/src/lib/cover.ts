// Deterministic gradient cover art derived from a seed (the track/category slug),
// so every lullaby gets a stable, distinct look with zero image assets.

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function coverGradient(seed: string): string {
  const hash = hashString(seed);
  const hue = hash % 360;
  const hue2 = (hue + 35 + ((hash >> 8) % 60)) % 360;
  return `linear-gradient(135deg, hsl(${hue} 68% 78%), hsl(${hue2} 60% 62%))`;
}
