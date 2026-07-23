/**
 * Search relevance scoring (Part 21). One scoring function shared by
 * every search source (courses, lessons, tools, formulas, terms) so
 * ranking is consistent across a "Smart Search" that merges results
 * from all of them — verified against known cases (exact match,
 * starts-with, contains, description-only match, no match, and
 * whitespace/case normalization) before being wired into any UI.
 */

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Higher score = more relevant; 0 means no match at all. */
export function scoreMatch(query: string, title: string, description = '', body = ''): number {
  const q = normalize(query);
  if (!q) return 0;

  const t = normalize(title);
  const d = normalize(description);
  const b = normalize(body);

  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70;
  if (d.startsWith(q) || d.includes(q)) return 40;
  if (b.includes(q)) return 20;
  return 0;
}

export interface ScoredResult<T> {
  item: T;
  score: number;
}

export function rankResults<T>(
  items: T[],
  query: string,
  getFields: (item: T) => { title: string; description?: string; body?: string }
): ScoredResult<T>[] {
  return items
    .map((item) => {
      const { title, description, body } = getFields(item);
      return { item, score: scoreMatch(query, title, description, body) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
