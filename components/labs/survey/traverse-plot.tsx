'use client';

import { useEffect, useRef } from 'react';
import type { AdjustedLeg } from './traverse-logic';

/** Plan view of the adjusted closed traverse — station points connected in
 * order, closing back to the start, so the "closed loop" the whole
 * calculation is about is actually visible, not just implied by numbers. */
export function TraversePlot({
  adjustedLegs,
  startNorthing,
  startEasting,
}: {
  adjustedLegs: AdjustedLeg[];
  startNorthing: number;
  startEasting: number;
}) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let board: any = null;

    async function render() {
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current || adjustedLegs.length === 0) return;

      const eastings = [startEasting, ...adjustedLegs.map((l) => l.adjustedEasting)];
      const northings = [startNorthing, ...adjustedLegs.map((l) => l.adjustedNorthing)];
      const padX = (Math.max(...eastings) - Math.min(...eastings)) * 0.15 + 5;
      const padY = (Math.max(...northings) - Math.min(...northings)) * 0.15 + 5;

      board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [
          Math.min(...eastings) - padX,
          Math.max(...northings) + padY,
          Math.max(...eastings) + padX,
          Math.min(...northings) - padY,
        ],
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
        keepAspectRatio: true,
      });

      const allPoints = [
        { n: startNorthing, e: startEasting, label: 'Start' },
        ...adjustedLegs.map((l, i) => ({ n: l.adjustedNorthing, e: l.adjustedEasting, label: `${i + 1}` })),
      ];

      for (let i = 0; i < allPoints.length - 1; i++) {
        board.create('segment', [
          [allPoints[i].e, allPoints[i].n],
          [allPoints[i + 1].e, allPoints[i + 1].n],
        ], {
          strokeColor: '#1F3350',
          strokeWidth: 2,
          fixed: true,
          highlight: false,
        });
      }

      for (const p of allPoints) {
        board.create('point', [p.e, p.n], {
          size: 3,
          fillColor: p.label === 'Start' ? '#C4632F' : '#4A7C82',
          strokeColor: p.label === 'Start' ? '#C4632F' : '#4A7C82',
          name: p.label,
          label: { offset: [6, 6], fontSize: 11 },
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
  }, [adjustedLegs, startNorthing, startEasting]);

  return <div ref={boardRef} className="h-64 w-full" />;
}
