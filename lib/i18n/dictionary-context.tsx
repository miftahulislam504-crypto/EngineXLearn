'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary-type';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface DictionaryContextValue {
  dict: Dictionary;
  locale: Locale;
}

const DictionaryContext = createContext<DictionaryContextValue | undefined>(undefined);

/**
 * Provides the current locale's dictionary to every Client Component
 * beneath it. Only `locale` (a plain string) crosses the Server → Client
 * boundary as a prop; the dictionary itself — which includes function-
 * valued entries like `welcomeBackName: (name) => ...` for pluralized/
 * interpolated strings — is resolved right here, client-side, via
 * getDictionary(). Passing the whole dict object as a prop from the
 * Server Component in app/[locale]/layout.tsx doesn't work: React can't
 * serialize functions across that boundary ("Functions cannot be passed
 * directly to Client Components").
 *
 * Server Components don't use this at all; they call getDictionary(locale)
 * directly since they already receive `params.locale` from Next.js routing.
 */
export function DictionaryProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const dict = useMemo(() => getDictionary(locale), [locale]);

  return (
    <DictionaryContext.Provider value={{ dict, locale }}>{children}</DictionaryContext.Provider>
  );
}

export function useDictionary(): Dictionary {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context.dict;
}

export function useLocale(): Locale {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useLocale must be used within a DictionaryProvider');
  }
  return context.locale;
}
