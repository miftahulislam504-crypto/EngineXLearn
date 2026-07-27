'use client';

import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { getToolBySlug } from '@/components/tools/registry';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { useAuth } from '@/lib/auth-context';

export default function ToolDetailPage({
  params,
}: {
  params: { toolSlug: string };
}) {
  const dict = useDictionary();
  const { user } = useAuth();

  const tool = getToolBySlug(params.toolSlug);
  if (!tool) notFound();

  const toolTitle = dict.tools.toolTitles[tool.slug as keyof typeof dict.tools.toolTitles];
  const ToolComponent = tool.component;

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {dict.tools.backToTools}
        </Link>

        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">{toolTitle}</h1>

        <ToolComponent loggedIn={!!user} />
      </main>
    </AppShell>
  );
}
