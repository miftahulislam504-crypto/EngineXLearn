import { Link } from '@/components/i18n/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarModule {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
  }[];
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  modules,
  currentLessonId,
  completedLessonIds,
}: {
  courseSlug: string;
  courseTitle: string;
  modules: SidebarModule[];
  currentLessonId: string;
  completedLessonIds: Set<string>;
}) {
  return (
    <nav className="w-full shrink-0 md:w-72">
      <Link
        href={`/learning/${courseSlug}`}
        className="block px-1 pb-4 font-display text-sm font-semibold tracking-tight hover:text-steel-500"
      >
        ← {courseTitle}
      </Link>

      <div className="space-y-5">
        {modules.map((module, mIdx) => (
          <div key={module.id}>
            <p className="mb-1.5 flex items-center gap-2 px-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>{String(mIdx + 1).padStart(2, '0')}</span>
              {module.title}
            </p>
            <ul className="space-y-0.5">
              {module.lessons.map((lesson) => {
                const isCurrent = lesson.id === currentLessonId;
                const isComplete = completedLessonIds.has(lesson.id);

                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/learning/${courseSlug}/${lesson.id}`}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                        isCurrent
                          ? 'bg-structural-900 text-vellum-100 dark:bg-vellum-100 dark:text-structural-900'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2
                          className={cn(
                            'h-3.5 w-3.5 shrink-0',
                            isCurrent ? 'text-vellum-100 dark:text-structural-900' : 'text-steel-500'
                          )}
                        />
                      ) : (
                        <Circle className="h-3.5 w-3.5 shrink-0 opacity-50" />
                      )}
                      <span className="line-clamp-1">{lesson.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
