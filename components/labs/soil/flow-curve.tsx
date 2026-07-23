'use client';

import { useEffect, useRef } from 'react';
import type { LiquidLimitTrial, FlowCurveFit } from './atterberg-limits-logic';

/**
 * Flow curve — moisture content (linear y-axis) vs. blow count (LOG
 * x-axis), the standard Casagrande semi-log plot. Same log-space technique
 * as the Gradation Curve (`gradation-curve.tsx`): JSXGraph has no built-in
 * log-axis mode, so points are plotted in log10(N) space directly with
 * tick labels custom-formatted back to real blow-count values. Unlike the
 * gradation curve — which draws a curve through the exact data points —
 * this draws the best-fit straight line from the regression, with the raw
 * trial points shown as separate markers, since the flow curve's whole
 * purpose is showing that a straight line through scattered real trials is
 * what gets read at N=25, not a curve forced through every point exactly.
 */
export function FlowCurve({ trials, fit }: { trials: LiquidLimitTrial[]; fit: FlowCurveFit | null }) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let board: any = null;

    async function render() {
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current || !fit) return;

      const validTrials = trials.filter((t) => t.blows > 0 && t.moisturePercent > 0);
      if (validTrials.length < 2) return;

      const blowCounts = validTrials.map((t) => t.blows);
      const moistures = validTrials.map((t) => t.moisturePercent);
      const minLog = Math.log10(Math.min(...blowCounts, 25)) - 0.08;
      const maxLog = Math.log10(Math.max(...blowCounts, 25)) + 0.08;
      const minY = Math.min(...moistures, fit.liquidLimitPercent) - 3;
      const maxY = Math.max(...moistures, fit.liquidLimitPercent) + 3;

      board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [minLog, maxY, maxLog, minY],
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
      });

      // Gridlines at each tested blow count plus the N=25 reference line,
      // labeled with real (non-log) blow-count values.
      const tickValues = Array.from(new Set([...blowCounts, 25])).sort((a, b) => a - b);
      for (const n of tickValues) {
        const x = Math.log10(n);
        board.create('line', [[x, minY], [x, maxY]], {
          straightFirst: false,
          straightLast: false,
          strokeColor: n === 25 ? '#4A7C82' : '#C9C4B8',
          strokeWidth: n === 25 ? 1.5 : 1,
          dash: n === 25 ? 0 : 2,
          fixed: true,
          highlight: false,
          opacity: n === 25 ? 0.6 : 1,
        });
        board.create('text', [x, minY + (maxY - minY) * 0.04, n.toString()], {
          fontSize: 10,
          anchorX: 'middle',
          color: n === 25 ? '#4A7C82' : '#8B8478',
          fixed: true,
          highlight: false,
        });
      }

      // Best-fit flow line across the full plotted range
      const yAtMin = fit.slope * minLog + fit.intercept;
      const yAtMax = fit.slope * maxLog + fit.intercept;
      board.create('line', [[minLog, yAtMin], [maxLog, yAtMax]], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#1F3350',
        strokeWidth: 2.5,
        fixed: true,
        highlight: false,
      });

      // Trial data points
      for (const t of validTrials) {
        board.create('point', [Math.log10(t.blows), t.moisturePercent], {
          size: 3,
          fillColor: '#C4632F',
          strokeColor: '#C4632F',
          name: '',
          fixed: true,
          highlight: false,
        });
      }

      // The LL read-off point at N=25
      board.create('point', [Math.log10(25), fit.liquidLimitPercent], {
        size: 4,
        face: 'diamond',
        fillColor: '#4A7C82',
        strokeColor: '#4A7C82',
        name: '',
        fixed: true,
        highlight: false,
      });

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

  if (!fit) {
    return null;
  }

  return <div ref={boardRef} className="h-56 w-full" />;
}
