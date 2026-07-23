'use client';

import { useEffect, useRef } from 'react';
import type { CompactionTrial } from './compaction-test-logic';
import { dryDensity, zeroAirVoidsDensity } from './compaction-test-logic';

/**
 * Compaction curve — dry density vs. moisture content, with the fitted
 * parabola peak marked and the theoretical zero-air-voids line shown as
 * a reference ceiling the real curve should never cross.
 */
export function CompactionCurve({
  trials,
  omcPercent,
  mddGPerCm3,
}: {
  trials: CompactionTrial[];
  omcPercent: number;
  mddGPerCm3: number;
}) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let board: any = null;

    async function render() {
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current) return;

      const valid = trials.filter((t) => t.moisturePercent >= 0 && t.wetMassG > 0);
      const xs = valid.map((t) => t.moisturePercent);
      const ys = valid.map((t) => dryDensity(t.wetMassG, t.moisturePercent));

      const minX = Math.min(...xs, omcPercent) - 2;
      const maxX = Math.max(...xs, omcPercent) + 2;
      const zavYs = xs.map((x) => zeroAirVoidsDensity(x));
      const maxY = Math.max(...ys, mddGPerCm3, ...zavYs) + 0.1;
      const minY = Math.min(...ys, mddGPerCm3) - 0.15;

      board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [minX, maxY, maxX, minY],
        axis: true,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
        defaultAxes: {
          x: { name: 'w (%)', withLabel: true, ticks: { insertTicks: true } },
          y: { name: 'γd (g/cm³)', withLabel: true, ticks: { insertTicks: true } },
        },
      });

      // Zero-air-voids reference line
      const zavPoints = [];
      for (let x = minX; x <= maxX; x += (maxX - minX) / 20) {
        zavPoints.push([x, zeroAirVoidsDensity(x)]);
      }
      board.create('curve', [zavPoints.map((p) => p[0]), zavPoints.map((p) => p[1])], {
        strokeColor: '#C4632F',
        strokeWidth: 1.5,
        dash: 2,
        fixed: true,
        highlight: false,
      });

      // Trial points
      for (let i = 0; i < xs.length; i++) {
        board.create('point', [xs[i], ys[i]], {
          size: 3,
          fillColor: '#1F3350',
          strokeColor: '#1F3350',
          name: '',
          fixed: true,
          highlight: false,
        });
      }

      // Smooth curve through the fitted parabola near the peak (visual aid)
      const curvePoints: number[][] = [];
      const n = xs.length;
      let sx = 0, sx2 = 0, sx3 = 0, sx4 = 0, sy = 0, sxy = 0, sx2y = 0;
      for (let i = 0; i < n; i++) {
        const x = xs[i], y = ys[i], x2 = x * x;
        sx += x; sx2 += x2; sx3 += x2 * x; sx4 += x2 * x2;
        sy += y; sxy += x * y; sx2y += x2 * y;
      }
      const det = (m: number[][]) =>
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      const M = [[sx4, sx3, sx2], [sx3, sx2, sx], [sx2, sx, n]];
      const D = det(M);
      if (Math.abs(D) > 1e-10) {
        const a = det([[sx2y, sx3, sx2], [sxy, sx2, sx], [sy, sx, n]]) / D;
        const b = det([[sx4, sx2y, sx2], [sx3, sxy, sx], [sx2, sy, n]]) / D;
        const c = det([[sx4, sx3, sx2y], [sx3, sx2, sxy], [sx2, sx, sy]]) / D;
        for (let x = minX; x <= maxX; x += (maxX - minX) / 30) {
          curvePoints.push([x, a * x * x + b * x + c]);
        }
        board.create('curve', [curvePoints.map((p) => p[0]), curvePoints.map((p) => p[1])], {
          strokeColor: '#4A7C82',
          strokeWidth: 2,
          fixed: true,
          highlight: false,
        });
      }

      // Peak marker (OMC, MDD)
      board.create('point', [omcPercent, mddGPerCm3], {
        size: 4,
        face: 'diamond',
        fillColor: '#C4632F',
        strokeColor: '#C4632F',
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
  }, [trials, omcPercent, mddGPerCm3]);

  return <div ref={boardRef} className="h-56 w-full" />;
}
