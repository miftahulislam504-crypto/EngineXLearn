'use client';

import {
  FileText,
  PenLine,
  Ruler,
  Table2,
  LayoutTemplate,
  ListChecks,
  ClipboardList,
  BookOpen,
  BookMarked,
  Download,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { RESOURCE_CATALOG, type ResourceCategory } from '@/lib/content/resource-catalog';
import { useDictionary } from '@/lib/i18n/dictionary-context';

const CATEGORIES: ResourceCategory[] = [
  'checklists',
  'site-formats',
  'templates',
  'pdf-notes',
  'hand-notes',
  'cad-files',
  'excel-sheets',
  'engineering-books',
  'code-books',
];

const CATEGORY_ICONS: Record<ResourceCategory, typeof FileText> = {
  'pdf-notes': FileText,
  'hand-notes': PenLine,
  'cad-files': Ruler,
  'excel-sheets': Table2,
  templates: LayoutTemplate,
  checklists: ListChecks,
  'site-formats': ClipboardList,
  'engineering-books': BookOpen,
  'code-books': BookMarked,
};

export default function ResourceLibraryPage() {
  const dict = useDictionary();
  const t = dict.resourceLibrary;

  const categoryLabels: Record<ResourceCategory, string> = {
    'pdf-notes': t.categoryPdfNotes,
    'hand-notes': t.categoryHandNotes,
    'cad-files': t.categoryCadFiles,
    'excel-sheets': t.categoryExcelSheets,
    templates: t.categoryTemplates,
    checklists: t.categoryChecklists,
    'site-formats': t.categorySiteFormats,
    'engineering-books': t.categoryEngineeringBooks,
    'code-books': t.categoryCodeBooks,
  };

  return (
    <AppShell>
      <main className="container max-w-5xl py-12 md:py-16">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">{t.eyebrow}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">{t.pageTitle}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{t.pageDescription}</p>
        </div>

        <div className="space-y-12">
          {CATEGORIES.map((category) => {
            const entries = RESOURCE_CATALOG.filter((e) => e.category === category);
            const Icon = CATEGORY_ICONS[category];
            return (
              <section key={category}>
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="font-display text-xl font-semibold tracking-tight">{categoryLabels[category]}</h2>
                  <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {t.count(entries.length)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {entries.map((entry) => {
                    const copy = t.items[entry.id as keyof typeof t.items];
                    return (
                      <Card key={entry.id} className="h-full">
                        <CardContent className="flex items-start gap-3 p-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
                            <Icon className="h-4 w-4" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-semibold leading-snug">{copy.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy.description}</p>

                            {entry.filePath ? (
                              <a
                                href={entry.filePath}
                                download
                                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-steel-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-steel-600"
                              >
                                <Download className="h-3.5 w-3.5" />
                                {t.downloadButton}
                              </a>
                            ) : entry.isReference ? (
                              <p className="mt-3 text-xs italic text-muted-foreground">{t.referenceOnlyNote}</p>
                            ) : (
                              <p className="mt-3 text-xs italic text-muted-foreground">{t.notAvailableYet}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="dim-divider mt-8" />
              </section>
            );
          })}
        </div>

        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">{t.count(RESOURCE_CATALOG.length)}</p>
      </main>
    </AppShell>
  );
}
