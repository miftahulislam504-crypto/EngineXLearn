import { NextRequest, NextResponse } from 'next/server';
import { unifiedSearch } from '@/lib/queries/search';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const localeParam = searchParams.get('locale') ?? '';
  const locale: Locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const dict = getDictionary(locale);
  const results = await unifiedSearch(query, locale, dict);

  return NextResponse.json({ results });
}
