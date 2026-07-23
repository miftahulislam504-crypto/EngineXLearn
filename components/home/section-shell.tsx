import { cn } from '@/lib/utils';

interface SectionShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Phase 1 scope note: this renders section chrome (heading, spacing, dividers)
 * with placeholder content beneath. Real data (courses, progress, community
 * posts) plugs in via the `children` slot once the corresponding backend
 * work lands — the section shell itself doesn't change.
 */
export function SectionShell({
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionShellProps) {
  return (
    <section className={cn('container py-16 md:py-20', className)}>
      <div className="mb-8 flex flex-col gap-2 md:mb-10">
        {eyebrow && (
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        )}
      </div>
      {children}
      <div className="dim-divider mt-16 md:mt-20" />
    </section>
  );
}
