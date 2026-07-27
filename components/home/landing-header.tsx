'use client';

import { Compass } from 'lucide-react';

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
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-structural-900 text-vellum-100 dark:bg-vellum-100 dark:text-structural-900">
            <Compass className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            CivilLearn
          </span>
        </span>
      </div>
    </header>
  );
}
