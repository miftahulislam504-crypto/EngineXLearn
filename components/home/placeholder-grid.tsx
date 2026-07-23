import { type LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlaceholderCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PlaceholderGridProps {
  items: PlaceholderCard[];
  columns?: 2 | 3 | 4;
}

/**
 * Renders a grid of skeleton content cards. Used for Phase 1 home-page
 * sections (Featured Courses, Practical Highlights, etc.) where the
 * section structure exists but the underlying data doesn't yet.
 */
export function PlaceholderGrid({ items, columns = 3 }: PlaceholderGridProps) {
  const colClass =
    columns === 2
      ? 'md:grid-cols-2'
      : columns === 4
        ? 'md:grid-cols-4'
        : 'md:grid-cols-3';

  return (
    <div className={cn('grid grid-cols-1 gap-4', colClass)}>
      {items.map((item, i) => (
        <Card
          key={i}
          className="group transition-colors hover:border-steel-400/60"
        >
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-muted text-steel-500">
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
