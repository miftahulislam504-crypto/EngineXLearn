'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search as SearchIcon,
  BookOpen,
  FileText,
  Wrench,
  Sigma,
  BookMarked,
  Sparkles,
} from 'lucide-react';
import { Link } from '@/components/i18n/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import type { SearchResult, SearchResultType } from '@/lib/queries/search';

const TYPE_ICONS: Record<SearchResultType, typeof BookOpen> = {
  course: BookOpen,
  lesson: FileText,
  tool: Wrench,
  formula: Sigma,
  term: BookMarked,
};

export default function SearchPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.search;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<SearchResultType | 'all'>('all');

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setResults(data.results ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, locale]);

  const typeLabels: Record<SearchResultType, string> = {
    course: t.typeCourse,
    lesson: t.typeLesson,
    tool: t.typeTool,
    formula: t.typeFormula,
    term: t.typeTerm,
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: results.length };
    for (const r of results) c[r.type] = (c[r.type] ?? 0) + 1;
    return c;
  }, [results]);

  const filteredResults = activeType === 'all' ? results : results.filter((r) => r.type === activeType);

  const presentTypes = useMemo(
    () => (Object.keys(typeLabels) as SearchResultType[]).filter((ty) => counts[ty] > 0),
    [counts, typeLabels]
  );

  return (
    <>
      <SiteHeader />
      <main className="container max-w-3xl py-10 md:py-14">
        <h1 className="mb-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">{t.pageTitle}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{t.pageDescription}</p>

        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none ring-oxide-500 focus:ring-2"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveType('all')}
              className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                activeType === 'all'
                  ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {t.filterAll} ({counts.all ?? 0})
            </button>
            {presentTypes.map((ty) => (
              <button
                key={ty}
                onClick={() => setActiveType(ty)}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  activeType === ty
                    ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {typeLabels[ty]} ({counts[ty]})
              </button>
            ))}
          </div>
          <div className="flex shrink-0 gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Link href="/search/formulas" className="underline decoration-dotted underline-offset-2">
              {t.browseFormulas}
            </Link>
            <span>·</span>
            <Link href="/search/terms" className="underline decoration-dotted underline-offset-2">
              {t.browseTerms}
            </Link>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-dashed border-border p-3">
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            {t.aiSearchNotConfigured}
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {loading && <p className="text-sm text-muted-foreground">{dict.common.loading}</p>}

          {!loading && debouncedQuery.trim() && filteredResults.length === 0 && (
            <p className="text-sm text-muted-foreground">{t.noResults}</p>
          )}

          {!loading &&
            filteredResults.map((r) => {
              const Icon = TYPE_ICONS[r.type];
              return (
                <Link key={`${r.type}-${r.id}`} href={r.href} className="block">
                  <div className="flex items-start gap-3 rounded-lg border border-border p-3.5 transition-colors hover:border-steel-400/60 hover:bg-muted/40">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-display text-sm font-semibold">{r.title}</p>
                        <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {typeLabels[r.type]}
                        </span>
                      </div>
                      {r.description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
