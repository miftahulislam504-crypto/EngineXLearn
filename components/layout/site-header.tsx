'use client';

import { Link } from '@/components/i18n/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { SiteLogo } from '@/components/layout/site-logo';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const dict = useDictionary();

  const NAV_LINKS = [
    { href: '/learning', label: dict.nav.learning },
    { href: '/practical', label: dict.nav.practical },
    { href: '/tools', label: dict.nav.tools },
    { href: '/practice', label: dict.nav.practice },
    { href: '/ai', label: dict.nav.aiAssistant },
    { href: '/community', label: dict.nav.community },
  ];

  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <SiteLogo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/search"
            aria-label={dict.nav.search}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="h-4.5 w-4.5" strokeWidth={2} />
          </Link>
          <LanguageSwitcher />

          {loading ? null : user ? (
            <Link href="/dashboard">
              <Avatar className="h-9 w-9 ring-1 ring-border">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {dict.nav.login}
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="accent" size="sm">
                  {dict.nav.startLearning}
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? dict.nav.closeMenu : dict.nav.openMenu}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <nav className="container flex flex-col gap-1 py-3">
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Search className="h-4 w-4" strokeWidth={2} />
                {dict.nav.search}
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-3">
                <LanguageSwitcher />
              </div>

              <div className="mt-2 flex gap-2 border-t border-border pt-3">
                {user ? (
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full" variant="outline" size="sm">
                      {dict.nav.dashboard}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="flex-1">
                      <Button className="w-full" variant="outline" size="sm">
                        {dict.nav.login}
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full" variant="accent" size="sm">
                        {dict.nav.startLearning}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
