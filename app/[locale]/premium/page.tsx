'use client';

import { Link } from '@/components/i18n/link';
import { Sparkles, GraduationCap, FolderOpen, Bot, Users, Download, Info } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export default function PremiumPage() {
  const dict = useDictionary();
  const t = dict.premium;

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">{t.eyebrow}</span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">{t.pageTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.pageDescription}</p>
        </div>

        <Card className="mb-8 border-oxide-400/40 bg-oxide-400/5">
          <CardContent className="flex gap-3 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-oxide-500" />
            <p className="text-xs leading-relaxed text-muted-foreground">{t.noBackendNote}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <FeatureRow
            icon={GraduationCap}
            heading={t.advancedCoursesHeading}
            description={t.advancedCoursesDescription}
            status={t.previewAvailableLabel}
            statusAvailable
            actionHref="/learning"
            actionLabel={t.viewAdvancedCourses}
          />
          <FeatureRow
            icon={Download}
            heading={t.downloadAccessHeading}
            description={t.downloadAccessDescription}
            status={t.previewAvailableLabel}
            statusAvailable
            actionHref="/resources"
            actionLabel={t.viewResources}
          />
          <FeatureRow
            icon={FolderOpen}
            heading={t.exclusiveProjectsHeading}
            description={t.exclusiveProjectsDescription}
            status={t.dependsOnUnbuiltLabel('Part 11 — Real Project Experience')}
            statusAvailable={false}
          />
          <FeatureRow
            icon={Bot}
            heading={t.aiPremiumToolsHeading}
            description={t.aiPremiumToolsDescription}
            status={t.dependsOnUnbuiltLabel('Part 13 — AI Assistant')}
            statusAvailable={false}
          />
          <FeatureRow
            icon={Users}
            heading={t.liveMentorshipHeading}
            description={t.liveMentorshipDescription}
            status={t.dependsOnUnbuiltLabel('Part 17 — Live Learning')}
            statusAvailable={false}
          />
        </div>
      </main>
    </AppShell>
  );
}

function FeatureRow({
  icon: Icon,
  heading,
  description,
  status,
  statusAvailable,
  actionHref,
  actionLabel,
}: {
  icon: typeof Sparkles;
  heading: string;
  description: string;
  status: string;
  statusAvailable: boolean;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold leading-snug">{heading}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          <p className={`mt-2 text-[11px] font-medium ${statusAvailable ? 'text-steel-500' : 'text-muted-foreground'}`}>
            {status}
          </p>
          {actionHref && actionLabel && (
            <Link href={actionHref} className="mt-1 inline-block text-xs text-steel-500 underline-offset-2 hover:underline">
              {actionLabel}
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
