'use client';

import { ProtectedRoute } from '@/components/layout/protected-route';
import { DashboardTopbar } from '@/components/dashboard/dashboard-topbar';
import { BottomNav } from '@/components/dashboard/bottom-nav';

/**
 * Wraps every post-login page (Dashboard, Tools, Learn, Lab, Settings,
 * plus hamburger-menu destinations like Practice/Search/AI/Community).
 * Deliberately does NOT move those pages under /dashboard — their URLs
 * stay exactly where they are (/tools, /learning, ...); this shell is
 * just mounted inside each of those page trees.
 *
 * Provides:
 * - ProtectedRoute: redirects to /login if signed out
 * - DashboardTopbar: page context + hamburger menu (secondary features)
 * - BottomNav: the 5 primary destinations, fixed to the bottom
 *
 * pb-20 on <main> keeps content clear of the fixed bottom nav (h-16 +
 * safe margin) — don't drop it when using this shell.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <DashboardTopbar />
        <main className="flex-1 bg-vellum-50 pb-20 dark:bg-structural-950">
          {children}
        </main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
