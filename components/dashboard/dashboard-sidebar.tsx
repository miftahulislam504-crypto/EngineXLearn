'use client';

import { Link } from '@/components/i18n/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  HardHat,
  FlaskConical,
  Wrench,
  Sparkles,
  Users,
  Award,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';

export function DashboardSidebar() {
  const rawPathname = usePathname();
  const { signOut } = useAuth();
  const locale = useLocale();
  const dict = useDictionary();

  // usePathname() returns the full path including the /en or /bn prefix
  // (e.g. "/en/dashboard/learning") — strip it before comparing against
  // the bare hrefs below, or active-link highlighting would never match.
  const pathname = rawPathname.replace(new RegExp(`^/${locale}`), '') || '/';

  const NAV_ITEMS = [
    { href: '/dashboard', label: dict.dashboard.overview, icon: LayoutDashboard },
    { href: '/dashboard/learning', label: dict.nav.learning, icon: BookOpen },
    { href: '/dashboard/practical', label: dict.dashboard.practical, icon: HardHat },
    { href: '/dashboard/lab', label: dict.dashboard.labNav, icon: FlaskConical },
    { href: '/dashboard/tools', label: dict.dashboard.toolsNav, icon: Wrench },
    { href: '/dashboard/ai', label: dict.dashboard.aiNav, icon: Sparkles },
    { href: '/dashboard/community', label: dict.dashboard.communityNav, icon: Users },
    { href: '/dashboard/certificates', label: dict.dashboard.certificates, icon: Award },
  ];

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-vellum-100 dark:bg-structural-900 md:flex">
      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-structural-900 text-vellum-100 dark:bg-vellum-100 dark:text-structural-900'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.9} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4" strokeWidth={1.9} />
          {dict.dashboard.settings}
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.9} />
          {dict.dashboard.logOut}
        </button>
      </div>
    </aside>
  );
}
