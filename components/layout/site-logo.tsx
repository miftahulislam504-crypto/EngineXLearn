import { cn } from '@/lib/utils';

/**
 * EngineX Learn wordmark + mark. Single source of truth for the brand
 * so header, footer, splash screen, and auth shell never drift from
 * each other again. The mark is a stylized "X" — distinct from generic
 * compass/education iconography, ties directly to the "EngineX" name.
 */
export function SiteLogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md bg-structural-900 text-vellum-100 dark:bg-vellum-100 dark:text-structural-900',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4.5 w-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 5l14 14" />
        <path d="M19 5L5 19" />
        <path d="M12 3v4" />
      </svg>
    </span>
  );
}

export function SiteLogo({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <SiteLogoMark />
      <span
        className={cn(
          'font-display text-lg font-semibold tracking-tight',
          textClassName,
        )}
      >
        EngineX Learn
      </span>
    </span>
  );
}
