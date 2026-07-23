import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { getToolBySlug } from '@/components/tools/registry';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getCurrentUser } from '@/lib/current-user';

export default async function ToolDetailPage({
  params,
}: {
  params: { toolSlug: string; locale: string };
}) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const tool = getToolBySlug(params.toolSlug);
  if (!tool) notFound();

  const currentUser = await getCurrentUser();
  const toolTitle = dict.tools.toolTitles[tool.slug as keyof typeof dict.tools.toolTitles];
  const ToolComponent = tool.component;

  return (
    <>
      <SiteHeader />
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {dict.tools.backToTools}
        </Link>

        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">{toolTitle}</h1>

        <ToolComponent loggedIn={!!currentUser} />
      </main>
      <SiteFooter />
    </>
  );
}
