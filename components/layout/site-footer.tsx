'use client';

import { Link } from '@/components/i18n/link';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { SiteLogo } from '@/components/layout/site-logo';

export function SiteFooter() {
  const dict = useDictionary();

  const FOOTER_SECTIONS = [
    {
      title: dict.footer.platformHeading,
      links: [
        { href: '/learning', label: dict.nav.learning },
        { href: '/practical', label: dict.nav.practical },
        { href: '/lab', label: dict.dashboard.labNav },
        { href: '/tools', label: dict.nav.tools },
      ],
    },
    {
      title: dict.footer.ecosystemHeading,
      links: [
        // Ecosystem app names are proper nouns — not translated, matching
        // how CivilDraw/CivilStruct/etc. are referred to throughout the
        // Master Blueprint in both languages.
        { href: '/ecosystem/civildraw', label: 'CivilDraw' },
        { href: '/ecosystem/civilstruct', label: 'CivilStruct' },
        { href: '/ecosystem/civilcost', label: 'CivilCost' },
        { href: '/ecosystem/civilmanage', label: 'CivilManage' },
      ],
    },
    {
      title: dict.footer.communityHeading,
      links: [
        { href: '/community', label: dict.footer.discussions },
        { href: '/community/projects', label: dict.footer.sharedProjects },
        { href: '/careers', label: dict.footer.careerHub },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-vellum-100 dark:bg-structural-900">
      <div className="container py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <SiteLogo />
            <p className="mt-3 max-w-xs font-mono text-xs leading-relaxed text-muted-foreground">
              {dict.footer.tagline}
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-sm font-semibold">{section.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="dim-divider my-8" />

        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {dict.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
