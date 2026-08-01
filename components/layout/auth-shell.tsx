import { Link } from '@/components/i18n/link';
import { SiteLogo } from '@/components/layout/site-logo';

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="absolute inset-0 bg-grid-lg opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)',
        }}
      />

      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 flex justify-center">
          <SiteLogo />
        </Link>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}
