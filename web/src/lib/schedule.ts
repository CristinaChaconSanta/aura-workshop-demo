export function parseGaps(text: string): number[] {
  return (text.match(/\d+/g) ?? [])
    .map((n) => Number(n))
    .filter((n) => n > 0 && n < 24 * 60)
}

export function formatGaps(gaps: number[]) {
  return gaps.map((n) => (n >= 60 ? `${n} min` : `${n} min`)).join(" → ")
}
