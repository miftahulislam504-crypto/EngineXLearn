import type { Locale } from '../config';
import type { Dictionary } from '../dictionary-type';
import en from './en';
import bn from './bn';

/**
 * Both en and bn are typed against the same `Dictionary` interface at their
 * own definition sites (see en.ts / bn.ts) — if bn.ts is missing a key that
 * en.ts has, or has one with the wrong shape (e.g. a plain string where
 * `Dictionary` expects a function), that's a compile error there, not
 * something that surfaces later as a runtime `undefined` in the Bengali UI.
 */
const dictionaries: Record<Locale, Dictionary> = { en, bn };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
