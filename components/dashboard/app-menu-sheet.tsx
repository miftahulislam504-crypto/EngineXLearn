'use client';

import { Link } from '@/components/i18n/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Sigma,
  BookMarked,
  ClipboardCheck,
  Box,
  FolderOpen,
  Package,
  Building2,
  HardHat,
  Crown,
  Sparkles,
  Users,
  Award,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';

interface AppMenuSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Everything that isn't one of the 5 bottom-nav destinations lives
 * here: Search, Formulas, Glossary, Practice, Visualizations,
 * Resources, Materials, Projects, Practical Hub, AI Assistant,
 * Community, Certificates, Premium, plus the language switcher and
 * sign-out. Formulas and Glossary are also reachable as sub-links
 * from inside the Search page itself, but are listed here directly
 * too so they're one tap away without going through Search first.
 * Opened from the hamburger icon in DashboardTopbar.
 */
export function AppMenuSheet({ open, onClose }: AppMenuSheetProps) {
  const { signOut } = useAuth();
  const dict = useDictionary();

  const MENU_ITEMS = [
    { href: '/search', label: dict.nav.search, icon: Search },
    { href: '/search/formulas', label: dict.search.browseFormulas, icon: Sigma },
    { href: '/search/terms', label: dict.search.browseTerms, icon: BookMarked },
    { href: '/practice', label: dict.nav.practice, icon: ClipboardCheck },
    { href: '/visualizations', label: dict.nav.visualizations, icon: Box },
    { href: '/resources', label: dict.nav.resources, icon: FolderOpen },
    { href: '/materials', label: dict.nav.materials, icon: Package },
    { href: '/projects', label: dict.nav.projects, icon: Building2 },
    { href: '/practical', label: dict.nav.practical, icon: HardHat },
    { href: '/dashboard/ai', label: dict.dashboard.aiNav, icon: Sparkles },
    { href: '/dashboard/community', label: dict.dashboard.communityNav, icon: Users },
    { href: '/certificates', label: dict.dashboard.certificates, icon: Award },
    { href: '/premium', label: dict.nav.premium, icon: Crown },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-structural-950/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.openMenu}
            className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border bg-background"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="font-display text-sm font-semibold tracking-tight">
                {dict.nav.openMenu}
              </span>
              <button
                onClick={onClose}
                aria-label={dict.nav.closeMenu}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              <ul className="space-y-0.5">
                {MENU_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <item.icon className="h-4.5 w-4.5" strokeWidth={1.9} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border p-3">
              <div className="px-1 pb-2">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.9} />
                {dict.dashboard.logOut}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
