import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuthProvider } from '@/lib/auth-context';
import { DictionaryProvider } from '@/lib/i18n/dictionary-context';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale, LOCALES, type Locale } from '@/lib/i18n/config';

/**
 * Locale boundary layout. Validates the [locale] segment (an unknown
 * locale like /fr/learning 404s rather than silently falling back to
 * English), resolves that locale's dictionary server-side, and provides
 * both the dictionary and Firebase auth context to everything beneath it.
 */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const isEnglish = locale === 'en';

  return {
    title: isEnglish
      ? 'CivilLearn — Civil Engineering Learning Platform'
      : 'CivilLearn — সিভিল ইঞ্জিনিয়ারিং লার্নিং প্ল্যাটফর্ম',
    description: isEnglish
      ? 'Learn, practice, and visualize civil engineering — from first-year mechanics to BNBC 2020-compliant structural design.'
      : 'সিভিল ইঞ্জিনিয়ারিং শিখুন, প্র্যাকটিস করুন, এবং ভিজ্যুয়ালাইজ করুন — ফার্স্ট-ইয়ার মেকানিক্স থেকে BNBC 2020-compliant স্ট্রাকচারাল ডিজাইন পর্যন্ত।',
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <DictionaryProvider dict={dict} locale={locale}>
      <AuthProvider>{children}</AuthProvider>
    </DictionaryProvider>
  );
}
