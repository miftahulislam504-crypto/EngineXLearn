import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving conflicts (e.g. `p-2` vs `p-4`)
 * in favor of the last one — the standard shadcn/ui-style helper used
 * throughout components/ui/* and beyond.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
