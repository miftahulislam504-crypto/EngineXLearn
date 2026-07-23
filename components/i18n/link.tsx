'use client';

import NextLink, { type LinkProps } from 'next/link';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { useLocale } from '@/lib/i18n/dictionary-context';

/**
 * Drop-in replacement for next/link that automatically prefixes internal
 * hrefs with the current locale segment — `<Link href="/learning">`
 * becomes a link to `/en/learning` or `/bn/learning` depending on which
 * locale is active, without every call site needing to know or care.
 *
 * External URLs (http/https/mailto/tel) and hrefs that are already
 * locale-prefixed pass through unchanged.
 */
type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, ...props },
  ref
) {
  const locale = useLocale();

  const localizedHref = localizeHref(href.toString(), locale);

  return <NextLink ref={ref} href={localizedHref} {...props} />;
});

function localizeHref(href: string, locale: string): string {
  // External links, mail/tel links, and hash-only anchors pass through untouched.
  if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return href;
  }

  // Already locale-prefixed (defensive — shouldn't normally happen given
  // every call site uses bare paths like "/learning") — don't double-prefix.
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) {
    return href;
  }

  if (href === '/') {
    return `/${locale}`;
  }

  return `/${locale}${href}`;
}
