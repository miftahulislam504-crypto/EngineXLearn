'use client';

import { useState, useMemo } from 'react';
import { Search as SearchIcon, ChevronLeft } from 'lucide-react';
import { Link } from '@/components/i18n/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { FORMULAS, type FormulaCategory } from '@/lib/search/formulas';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';

const CATEGORIES: FormulaCategory[] = ['structural', 'geotechnical', 'concrete', 'survey', 'general'];

export default function FormulaSearchPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.search;

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FormulaCategory | 'all'>('all');

  const categoryLabels: Record<FormulaCategory, string> = {
    structural: t.categoryStructural,
    geotechnical: t.categoryGeotechnical,
    concrete: t.categoryConcrete,
    survey: t.categorySurvey,
    general: t.categoryGeneral,
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FORMULAS.filter((f) => {
      const matchesCategory = category === 'all' || f.category === category;
      const matchesQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.nameBn.includes(query.trim()) ||
        f.formula.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <>
      <SiteHeader />
      <main className="container max-w-2xl py-10 md:py-14">
        <Link href="/search" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          {t.pageTitle}
        </Link>
        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">{t.browseFormulas}</h1>

        <div className="relative mb-3">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none ring-oxide-500 focus:ring-2"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory('all')}
            className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              category === 'all' ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400' : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {t.filterAll}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                category === c ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400' : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {categoryLabels[c]}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((f) => (
            <div key={f.id} id={f.id} className="rounded-lg border border-border p-4">
              <p className="font-display text-sm font-semibold">{locale === 'bn' ? f.nameBn : f.name}</p>
              <p className="mt-1 font-mono text-sm text-oxide-600 dark:text-oxide-400">{f.formula}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {locale === 'bn' ? f.descriptionBn : f.description}
              </p>
              {f.variables.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  {f.variables.map((v) => (
                    <p key={v.symbol} className="font-mono text-xs text-muted-foreground">
                      <span className="font-semibold">{v.symbol}</span> — {locale === 'bn' ? v.meaningBn : v.meaning}
                    </p>
                  ))}
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                {f.reference && <span>{f.reference}</span>}
                {f.relatedToolSlug && (
                  <Link href={`/tools/${f.relatedToolSlug}`} className="underline decoration-dotted underline-offset-2">
                    {t.openCalculator}
                  </Link>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">{t.noResults}</p>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
