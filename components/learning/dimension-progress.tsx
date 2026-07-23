'use client';

import { Link } from '@/components/i18n/link';
import { cn } from '@/lib/utils';

interface LessonTick {
  id: string;
  title: string;
  complete: boolean;
  current: boolean;
}

/**
 * A dimension line with tick marks — one per lesson in the module — styled
 * after a drafting sheet's measurement convention. This isn't decoration:
 * lessons within a module genuinely are a measured, ordered sequence, so
 * the "tick marks along a line" visual encodes something true about the
 * content (unlike a generic 01/02/03 numbered list, which the design brief
 * warns against using when order isn't actually load-bearing information).
 */
export function DimensionProgress({
  courseSlug,
  lessons,
}: {
  courseSlug: string;
  lessons: LessonTick[];
}) {
  return (
    <div className="w-full py-1">
      <div className="relative flex items-center">
        <div className="absolute left-0 right-0 h-px bg-border" />
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/learning/${courseSlug}/${lesson.id}`}
            className="group relative flex flex-1 justify-center"
            style={{ zIndex: 1 }}
          >
            <span
              className={cn(
                'h-2.5 w-0.5 -translate-y-0.5 bg-border transition-colors',
                lesson.complete && 'bg-steel-500',
                lesson.current && 'bg-oxide-500'
              )}
            />
            <span
              className={cn(
                'absolute top-3 whitespace-nowrap font-mono text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100',
                lesson.current && 'opacity-100 text-oxide-600 dark:text-oxide-400'
              )}
            >
              {i + 1}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
