'use client';

import { Link } from '@/components/i18n/link';
import { ChevronRight, Package } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { MATERIAL_CATALOG } from '@/lib/content/material-catalog';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export default function MaterialLibraryPage() {
  const dict = useDictionary();
  const t = dict.materialLibrary;

  return (
    <AppShell>
      <main className="container max-w-5xl py-12 md:py-16">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">{t.eyebrow}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">{t.pageTitle}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{t.pageDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MATERIAL_CATALOG.map((entry) => {
            const copy = t.materials[entry.slug as keyof typeof t.materials];
            return (
              <Link key={entry.slug} href={`/materials/${entry.slug}`}>
                <Card className="group h-full transition-colors hover:border-steel-400/60">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
                      <Package className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-semibold leading-snug">{copy.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy.summary}</p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
          {t.count(MATERIAL_CATALOG.length)}
        </p>
      </main>
    </AppShell>
  );
}
