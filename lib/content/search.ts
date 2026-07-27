import { ALL_COURSES, ALL_LESSONS } from './index';
import { scoreMatch } from '@/lib/search/scoring';
import { FORMULAS } from '@/lib/search/formulas';
import { TERMS } from '@/lib/search/terms';
import { TOOL_REGISTRY } from '@/components/tools/registry';
import type { Dictionary } from '@/lib/i18n/dictionary-type';
import type { Locale } from '@/lib/i18n/config';

/**
 * Unified Search (Part 21) — runs entirely client-side now that every
 * source it searches (courses, lessons, tools, formulas, terms) is
 * static, hardcoded data instead of a database query. There's no API
 * route anymore: the search page calls `unifiedSearch` directly, the
 * same function a server route used to wrap.
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

function searchCourses(query: string): SearchResult[] {
  return ALL_COURSES.filter((c) => c.published)
    .map((c) => ({
      type: 'course' as const,
      id: c.id,
      title: c.title,
      description: c.description,
      href: `/learning/${c.slug}`,
      score: scoreMatch(query, c.title, c.description),
      category: c.subjectId,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS_PER_SOURCE);
}

function searchLessons(query: string): SearchResult[] {
  return ALL_LESSONS.map((l) => ({
    type: 'lesson' as const,
    id: l.id,
    title: l.title,
    description: l.courseTitle,
    href: `/learning/${l.courseSlug}/${l.id}`,
    score: scoreMatch(query, l.title, l.courseTitle),
    category: l.courseTitle,
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

export function unifiedSearch(query: string, locale: Locale, dict: Dictionary): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const courses = searchCourses(trimmed);
  const lessons = searchLessons(trimmed);
  const tools = searchTools(trimmed, dict);
  const formulas = searchFormulaEntries(trimmed, locale);
  const terms = searchTermEntries(trimmed, locale);

  return [...courses, ...lessons, ...tools, ...formulas, ...terms].sort((a, b) => b.score - a.score);
}
