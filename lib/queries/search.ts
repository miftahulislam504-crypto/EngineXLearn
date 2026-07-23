import { prisma } from '@/lib/prisma';
import { scoreMatch } from '@/lib/search/scoring';
import { FORMULAS } from '@/lib/search/formulas';
import { TERMS } from '@/lib/search/terms';
import { TOOL_REGISTRY } from '@/components/tools/registry';
import type { Dictionary } from '@/lib/i18n/dictionary-type';

/**
 * Unified Search (Part 21) — combines Course Search, Topic Search
 * (courses/lessons filtered by subject), Formula Search, and
 * Engineering Term Search into one ranked result set, which is what
 * "Smart Search" actually means here: one relevance-ranked list merged
 * from every source, not a single extra feature layered on top. AI
 * Search is intentionally not implemented this way — see
 * `app/api/search/ai/route.ts` for why.
 *
 * Course/Lesson matching narrows candidates at the database level
 * (case-insensitive `contains`, in both English and Bengali fields —
 * PostgreSQL supports this directly) before the same `scoreMatch`
 * ranking used everywhere else re-sorts that smaller candidate set by
 * actual relevance. Tool/Formula/Term matching runs entirely in
 * application code since those sources are small, static datasets, not
 * database tables.
 */

export type SearchResultType = 'course' | 'lesson' | 'tool' | 'formula' | 'term';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  description: string;
  href: string;
  score: number;
  category?: string;
}

const MAX_RESULTS_PER_SOURCE = 8;

async function searchCourses(query: string): Promise<SearchResult[]> {
  const rows = await prisma.course.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { titleBn: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { subject: true },
    take: 30, // candidate pool for re-ranking, not the final result count
  });

  return rows
    .map((c) => ({
      type: 'course' as const,
      id: c.id,
      title: c.title,
      description: c.description ?? '',
      href: `/learning/${c.slug}`,
      score: scoreMatch(query, c.title, c.description ?? ''),
      category: c.subject.title,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS_PER_SOURCE);
}

async function searchLessons(query: string): Promise<SearchResult[]> {
  const rows = await prisma.lesson.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { titleBn: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { module: { include: { course: true } } },
    take: 30,
  });

  return rows
    .map((l) => ({
      type: 'lesson' as const,
      id: l.id,
      title: l.title,
      description: l.module.course.title,
      href: `/learning/${l.module.course.slug}/${l.id}`,
      score: scoreMatch(query, l.title, l.module.course.title),
      category: l.module.course.title,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS_PER_SOURCE);
}

function searchTools(query: string, dict: Dictionary): SearchResult[] {
  const categoryLabels: Record<string, string> = {
    basic: dict.tools.categoryBasic,
    civil: dict.tools.categoryCivil,
    advanced: dict.tools.categoryAdvanced,
  };
  return TOOL_REGISTRY.map((tool) => {
    const title = dict.tools.toolTitles[tool.slug as keyof typeof dict.tools.toolTitles];
    return {
      type: 'tool' as const,
      id: tool.slug,
      title,
      description: categoryLabels[tool.category] ?? '',
      href: `/tools/${tool.slug}`,
      score: scoreMatch(query, title),
      category: tool.category,
    };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS_PER_SOURCE);
}

function searchFormulaEntries(query: string, locale: string): SearchResult[] {
  return FORMULAS.map((f) => {
    const title = locale === 'bn' ? f.nameBn : f.name;
    const description = locale === 'bn' ? f.descriptionBn : f.description;
    return {
      type: 'formula' as const,
      id: f.id,
      title,
      description: `${f.formula} — ${description}`,
      href: `/search/formulas#${f.id}`,
      score: Math.max(scoreMatch(query, f.name, f.description), scoreMatch(query, f.nameBn, f.descriptionBn)),
      category: f.category,
    };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS_PER_SOURCE);
}

function searchTermEntries(query: string, locale: string): SearchResult[] {
  return TERMS.map((t) => {
    const title = locale === 'bn' ? t.termBn : t.term;
    const description = locale === 'bn' ? t.definitionBn : t.definition;
    return {
      type: 'term' as const,
      id: t.id,
      title,
      description,
      href: `/search/terms#${t.id}`,
      score: Math.max(scoreMatch(query, t.term, t.definition), scoreMatch(query, t.termBn, t.definitionBn)),
      category: t.category,
    };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS_PER_SOURCE);
}

export async function unifiedSearch(query: string, locale: string, dict: Dictionary): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const [courses, lessons] = await Promise.all([searchCourses(trimmed), searchLessons(trimmed)]);
  const tools = searchTools(trimmed, dict);
  const formulas = searchFormulaEntries(trimmed, locale);
  const terms = searchTermEntries(trimmed, locale);

  return [...courses, ...lessons, ...tools, ...formulas, ...terms].sort((a, b) => b.score - a.score);
}

/** Topic Search — courses filtered by subject, not a text query. A
 * distinct entry point from unifiedSearch because "browse everything
 * under Geotechnical Engineering" isn't a relevance-ranking problem,
 * it's a filter. */
export async function searchByTopic(subjectSlug: string) {
  return prisma.course.findMany({
    where: { published: true, subject: { slug: subjectSlug } },
    include: { subject: true },
    orderBy: { title: 'asc' },
  });
}
