'use client';

import { useEffect, useRef } from 'react';
import type { GradationPoint } from './sieve-analysis-logic';

/**
 * Particle-size distribution curve — percent passing (linear y-axis) vs.
 * sieve opening size (LOG x-axis). The log x-axis isn't a style choice:
 * it's the standard convention (ASTM D6913 / BNBC 2020) because particle
 * sizes span several orders of magnitude (19mm down to 0.075mm here), and
 * D10/D30/D60 are conventionally read directly off this semi-log plot —
 * the same interpolation the calculation logic performs internally.
 */
export function GradationCurve({ points }: { points: GradationPoint[] }) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let board: any = null;

    async function render() {
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current) return;

      // JSXGraph doesn't have a built-in log-axis mode for cartesian boards,
      // so we plot in log10(size) space directly and custom-format the tick
      // labels back to their real mm values — this is the standard
      // workaround for semi-log plots in JSXGraph.
      const sortedBySize = [...points].sort((a, b) => a.sizeMm - b.sizeMm); // fine to coarse for left-to-right log axis
      const minLog = Math.log10(Math.min(...points.map((p) => p.sizeMm))) - 0.15;
      const maxLog = Math.log10(Math.max(...points.map((p) => p.sizeMm))) + 0.15;

      board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [minLog, 105, maxLog, -8],
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
      });

      // Manual gridlines at each whole-mm-decade + the tested sieve sizes,
      // labeled with their real (non-log) values, so the chart reads like
      // an actual lab report rather than an abstract log-space plot.
      for (const p of points) {
        const x = Math.log10(p.sizeMm);
        board.create('line', [[x, -8], [x, 105]], {
          straightFirst: false,
          straightLast: false,
          strokeColor: '#C9C4B8',
          strokeWidth: 1,
          dash: 2,
          fixed: true,
          highlight: false,
        });
        board.create('text', [x, -5, p.sizeMm.toString()], {
          fontSize: 10,
          anchorX: 'middle',
          color: '#8B8478',
          fixed: true,
          highlight: false,
        });
      }

      // Horizontal reference lines at 10/30/60% (the D-values read off this chart)
      for (const pct of [10, 30, 60]) {
        board.create('line', [[minLog, pct], [maxLog, pct]], {
          straightFirst: false,
          straightLast: false,
          strokeColor: '#4A7C82',
          strokeWidth: 1,
          dash: 2,
          fixed: true,
          highlight: false,
          opacity: 0.4,
        });
      }

      // The gradation curve itself
      const curvePoints = sortedBySize.map((p) => [Math.log10(p.sizeMm), p.percentPassing]);
      board.create('curve', [curvePoints.map((c) => c[0]), curvePoints.map((c) => c[1])], {
        strokeColor: '#1F3350',
        strokeWidth: 2.5,
        fillColor: 'none',
      });

      // Data point markers
      for (const p of points) {
        board.create('point', [Math.log10(p.sizeMm), p.percentPassing], {
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
  }, [points]);

  return <div ref={boardRef} className="h-64 w-full" />;
}
