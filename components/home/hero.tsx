'use client';

import { Link } from '@/components/i18n/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BeamDiagram } from '@/components/visuals/beam-diagram';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function Hero() {
  const dict = useDictionary();

  return (
    <section className="relative overflow-hidden">
      {/* Grid-paper backdrop + blueprint radial fade — structural, not decorative */}
      <div
        className="absolute inset-0 bg-grid-sm opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)',
        }}
      />
      <div className="absolute inset-0 bg-blueprint-fade" />

      <div className="container relative py-20 md:py-28">
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
              {dict.hero.badge}
            </span>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
              {dict.hero.titleLine1}
              <br />
              <span className="text-steel-500">{dict.hero.titleLine2}</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {dict.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button size="lg" variant="accent">
                  {dict.hero.startLearning}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/learning">
                <Button size="lg" variant="outline">
                  {dict.hero.browseCurriculum}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8"
          >
            <BeamDiagram />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
