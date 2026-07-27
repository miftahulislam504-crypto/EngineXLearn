'use client';

import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { useAuth } from '@/lib/auth-context';
import { setLessonComplete } from '@/lib/progress/store';

export function MarkCompleteButton({
  lessonId,
  initiallyComplete,
  loggedIn,
  onToggle,
}: {
  lessonId: string;
  initiallyComplete: boolean;
  loggedIn: boolean;
  /** Called after a successful toggle so the parent page (sidebar
   * checkmarks, module progress bar) can update without a full reload —
   * there's no server round trip to refresh from anymore, just this
   * component's own localStorage write. */
  onToggle?: (nextState: boolean) => void;
}) {
  const dict = useDictionary();
  const { user } = useAuth();
  const [complete, setComplete] = useState(initiallyComplete);

  if (!loggedIn || !user) {
    return (
      <p className="font-mono text-xs text-muted-foreground">{dict.lesson.loginToTrack}</p>
    );
  }

  const toggle = () => {
    const nextState = !complete;
    setComplete(nextState);
    setLessonComplete(user.uid, lessonId, nextState);
    onToggle?.(nextState);
  };

  return (
    <Button
      variant={complete ? 'outline' : 'accent'}
      onClick={toggle}
      className="gap-2"
    >
      {complete ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          {dict.lesson.completed}
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          {dict.lesson.markComplete}
        </>
      )}
    </Button>
  );
}
