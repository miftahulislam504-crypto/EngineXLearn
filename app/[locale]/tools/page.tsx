'use client';

import { Link } from '@/components/i18n/link';
import { ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { TOOL_REGISTRY, getToolsByCategory, type ToolCategory } from '@/components/tools/registry';
import { useDictionary } from '@/lib/i18n/dictionary-context';

const CATEGORIES: ToolCategory[] = ['basic', 'civil', 'advanced'];

export default function ToolsPage() {
  const dict = useDictionary();
  const t = dict.tools;

  const categoryLabels: Record<ToolCategory, string> = {
    basic: t.categoryBasic,
    civil: t.categoryCivil,
    advanced: t.categoryAdvanced,
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
            const tools = getToolsByCategory(category);
            return (
              <section key={category}>
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="font-display text-xl font-semibold tracking-tight">{categoryLabels[category]}</h2>
                  <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {t.toolCount(tools.length)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    const toolTitle = t.toolTitles[tool.slug as keyof typeof t.toolTitles];
                    return (
                      <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                        <Card className="group h-full transition-colors hover:border-steel-400/60">
                          <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
                              <Icon className="h-4 w-4" strokeWidth={1.75} />
                            </div>
                            <p className="min-w-0 flex-1 font-display text-sm font-semibold leading-snug">
                              {toolTitle}
                            </p>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                <div className="dim-divider mt-8" />
              </section>
            );
          })}
        </div>

        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
          {t.toolCount(TOOL_REGISTRY.length)}
        </p>
      </main>
    </AppShell>
  );
}
