'use client';

import { SiteLogo } from '@/components/layout/site-logo';

/**
 * Landing-page-only header. Deliberately has no nav links, no
 * login/signup buttons, no language switcher — just the mark. The
 * landing page is a single non-interactive summary screen; every
 * actual entry point into the app is the one "Start learning" CTA
 * further down the page. This is a separate component from
 * SiteHeader (used everywhere post-login) so the two can't drift
 * into each other by accident.
 */
export function LandingHeader() {
  return (
    <header className="border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        <SiteLogo />
      </div>
    </header>
  );
}
