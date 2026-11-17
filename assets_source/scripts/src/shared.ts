export function tri(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

export function gri(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  if (minCeiled >= maxFloored) {
    throw new RangeError("min must be lower than max");
  }
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function rtd(r: number): number {
  return (r * 180) / Math.PI;
}

export function dtr(d: number): number {
  return (d / 180) * Math.PI;
}
