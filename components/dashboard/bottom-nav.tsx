'use client';

import { Link } from '@/components/i18n/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, BookOpen, FlaskConical, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';

/**
 * Primary in-app navigation, always visible as a fixed bottom bar
 * (mobile-app style, used at every breakpoint per product decision —
 * this is a mobile-first product). Exactly 5 destinations:
 * Dashboard, Tools, Learn, Lab, Settings. Everything else in the app
 * (Practice, AI Assistant, Community, Certificates, Search) lives in
 * the hamburger menu opened from the topbar, not here — see
 * dashboard-topbar.tsx / app-menu-sheet.tsx.
 */
export function BottomNav() {
  const rawPathname = usePathname();
  const locale = useLocale();
  const dict = useDictionary();

  const pathname = rawPathname.replace(new RegExp(`^/${locale}`), '') || '/';

  const NAV_ITEMS = [
    { href: '/dashboard', label: dict.dashboard.overview, icon: LayoutDashboard },
    { href: '/tools', label: dict.dashboard.toolsNav, icon: Wrench },
    { href: '/learning', label: dict.nav.learning, icon: BookOpen },
    { href: '/lab', label: dict.dashboard.labNav, icon: FlaskConical },
    { href: '/settings', label: dict.dashboard.settings, icon: Settings },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md"
      aria-label={dict.dashboard.overview}
    >
      <div className="flex h-16 items-stretch justify-around">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                active ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon
                className="h-5 w-5"
                strokeWidth={active ? 2.25 : 1.9}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
