'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';

/**
 * One-time splash screen. Shows only on the first page load of a
 * browser session (sessionStorage flag, not localStorage — a fresh
 * splash every new tab/session, but not on every internal navigation).
 *
 * The centered logo+name mark animates up into the exact position it
 * occupies inside SiteHeader (h-16 bar, left-aligned, same icon/text
 * sizing) so the transition reads as "the mark settles into the
 * navbar" rather than a generic fade. SiteHeader mounts underneath
 * this overlay the whole time; the splash just covers it and clears.
 */

const SESSION_KEY = 'civillearn-splash-shown';

export function SiteSplash() {
  const [phase, setPhase] = useState<'hidden' | 'center' | 'rising' | 'done'>('hidden');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const alreadyShown = window.sessionStorage.getItem(SESSION_KEY);
    if (alreadyShown) {
      setPhase('done');
      return;
    }

    window.sessionStorage.setItem(SESSION_KEY, '1');
    setPhase('center');

    const riseTimer = setTimeout(() => setPhase('rising'), 900);
    const doneTimer = setTimeout(() => setPhase('done'), 1450);

    return () => {
      clearTimeout(riseTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done' || phase === 'hidden') return null;

  const rising = phase === 'rising';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-start justify-center bg-background md:justify-start"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        onAnimationComplete={() => {
          if (rising) setPhase('done');
        }}
        aria-hidden="true"
      >
        <motion.div
          className="container flex h-16 items-center"
          initial={false}
        >
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ y: '45vh', scale: 1.35 }}
            animate={rising ? { y: 0, scale: 1 } : { y: '45vh', scale: 1.35 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-structural-900 text-vellum-100 dark:bg-vellum-100 dark:text-structural-900">
              <Compass className="h-4.5 w-4.5" strokeWidth={2.25} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              CivilLearn
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
