'use client';

import { useEffect, useRef } from 'react';
import type { ShearTrial, ShearEnvelopeFit } from './direct-shear-logic';

/** Mohr-Coulomb failure envelope — shear stress vs. normal stress, trial
 * points plus the fitted line (using the raw, unclamped intercept so the
 * line actually passes through the plotted points even when the clamped
 * reported cohesion differs slightly). */
export function ShearEnvelopeChart({ trials, fit }: { trials: ShearTrial[]; fit: ShearEnvelopeFit }) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let board: any = null;

    async function render() {
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current) return;

      const valid = trials.filter((t) => t.normalStressKpa >= 0 && t.shearStressKpa >= 0);
      const xs = valid.map((t) => t.normalStressKpa);
      const ys = valid.map((t) => t.shearStressKpa);

      const maxX = Math.max(...xs) * 1.15;
      const maxY = Math.max(...ys, fit.rawCohesionKpa) * 1.2;
      const minY = Math.min(0, fit.rawCohesionKpa) - maxY * 0.05;

      board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [0, maxY, maxX, minY],
        axis: true,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
        defaultAxes: {
          x: { name: 'σ (kPa)', withLabel: true },
          y: { name: 'τ (kPa)', withLabel: true },
        },
      } as any);

      const yAt0 = fit.rawCohesionKpa;
      const yAtMax = fit.slope * maxX + fit.rawCohesionKpa;
      board.create('line', [[0, yAt0], [maxX, yAtMax]], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#1F3350',
        strokeWidth: 2.5,
        fixed: true,
        highlight: false,
      });

      for (let i = 0; i < xs.length; i++) {
        board.create('point', [xs[i], ys[i]], {
          size: 3,
          fillColor: '#C4632F',
          strokeColor: '#C4632F',
          name: '',
          fixed: true,
          highlight: false,
        });
      }

      board.update();
    }

    render();

    return () => {
      cancelled = true;
      if (board) {
        try {
          const JXG = (window as any).JXG;
          JXG?.JSXGraph.freeBoard(board);
        } catch {
          // already torn down
        }
      }
    };
  }, [trials, fit]);

  return <div ref={boardRef} className="h-56 w-full" />;
}
