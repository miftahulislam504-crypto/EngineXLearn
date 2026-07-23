'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function MarkCompleteButton({
  lessonId,
  initiallyComplete,
  loggedIn,
}: {
  lessonId: string;
  initiallyComplete: boolean;
  loggedIn: boolean;
}) {
  const dict = useDictionary();
  const [complete, setComplete] = useState(initiallyComplete);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!loggedIn) {
    return (
      <p className="font-mono text-xs text-muted-foreground">{dict.lesson.loginToTrack}</p>
    );
  }

  const toggle = () => {
    startTransition(async () => {
      const nextState = !complete;
      setComplete(nextState); // optimistic

      const res = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextState }),
      });

      if (!res.ok) {
        setComplete(!nextState); // roll back on failure
        return;
      }

      router.refresh(); // pick up updated sidebar checkmarks / course % complete
    });
  };

  return (
    <Button
      variant={complete ? 'outline' : 'accent'}
      onClick={toggle}
      disabled={isPending}
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
