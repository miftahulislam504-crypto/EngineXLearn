import type { Locale } from './config';

/**
 * Picks the right-language version of a piece of database content —
 * `title` vs `titleBn`, `description` vs `descriptionBn`, `body` vs
 * `bodyBn`. When locale is 'bn' but the Bengali field is null (content
 * not translated yet — the same "structure now, content later" pattern
 * used throughout lib/content/course-data.ts), this silently falls back to the
 * English value rather than showing nothing or an error. A missing
 * translation should degrade to "this one lesson is in English," not
 * "this lesson is broken."
 */
export function localize(
  locale: Locale,
  englishValue: string | null | undefined,
  bengaliValue: string | null | undefined
): string {
  if (locale === 'bn' && bengaliValue) {
    return bengaliValue;
  }
  return englishValue ?? '';
}
