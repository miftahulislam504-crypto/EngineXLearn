'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import { Compass } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const dict = useDictionary();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${locale}/login`);
    }
  }, [loading, user, router, locale]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-md bg-structural-900 text-vellum-100 dark:bg-vellum-100 dark:text-structural-900">
            <Compass className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <p className="font-mono text-xs text-muted-foreground">{dict.common.loading}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
