'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import { AppMenuSheet } from '@/components/dashboard/app-menu-sheet';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';

const DATE_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  bn: 'bn-BD',
};

export function DashboardTopbar() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const rawPathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = rawPathname.replace(new RegExp(`^/${locale}`), '') || '/';
  const isOverview = pathname === '/dashboard';

  const firstName = user?.displayName?.split(' ')[0] ?? 'Engineer';
  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6">
      <div>
        <p className="font-mono text-xs text-muted-foreground">
          {new Date().toLocaleDateString(DATE_LOCALE_MAP[locale] ?? 'en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="font-display text-lg font-semibold tracking-tight">
          {isOverview ? dict.dashboard.welcomeBackName(firstName) : 'EngineX Learn'}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher compact />
        <button
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={dict.dashboard.notificationsAria}
        >
          <Bell className="h-4.5 w-4.5" strokeWidth={1.9} />
        </button>
        <Avatar className="h-9 w-9 ring-1 ring-border">
          <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <button
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={dict.nav.openMenu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-5 w-5" strokeWidth={1.9} />
        </button>
      </div>

      <AppMenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
