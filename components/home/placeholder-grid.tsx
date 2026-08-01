import { type LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
 *
 * Landing page always shows 2 cards per row on md+ screens — the
 * `columns` prop is kept for API compatibility but no longer changes
 * the grid, so every section reads consistently down the page.
 */
export function PlaceholderGrid({ items }: PlaceholderGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item, i) => (
        <Card
          key={i}
          className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-oxide-500/50 hover:shadow-md"
        >
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-muted text-steel-500 transition-colors duration-200 group-hover:bg-oxide-500/10 group-hover:text-oxide-500">
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <CardTitle className="text-base transition-colors duration-200 group-hover:text-oxide-500">
              {item.title}
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
