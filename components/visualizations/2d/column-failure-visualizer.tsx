'use client';

import { useEffect, useRef, useState } from 'react';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import { computeColumnFailure, generateColumnFailureCurve } from './column-failure-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Column Failure — plots crushing capacity (constant line) against Euler
 * buckling capacity (decreasing curve) across a slenderness range, with a
 * draggable marker showing which mode governs at the selected slenderness.
 * The crossover point — where the two lines meet — is the actual teaching
 * point: below it, a column fails by crushing regardless of how the
 * buckling formula reads; above it, buckling governs regardless of how
 * strong the material is.
 */

type JXGBoard = any;

const MIN_S = 20;
const MAX_S = 200;
const Y_MAX_KN = 5000; // clip the buckling curve's display range — it grows unboundedly as slenderness -> 0, which would otherwise dominate the chart

export function ColumnFailureComparator() {
  const dict = useDictionary();
  const t = dict.visualizations.columnFailure;
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoardRef = useRef<JXGBoard | null>(null);
  const [slenderness, setSlenderness] = useState(100);
  const [ready, setReady] = useState(false);

  const result = computeColumnFailure(slenderness);
  const curve = generateColumnFailureCurve(MIN_S, MAX_S, 60);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current) return;

      const board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [MIN_S - 5, Y_MAX_KN, MAX_S + 5, -200],
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
      });

      // Axis lines (manual, for control over styling consistent with the rest of the platform)
      board.create('line', [[MIN_S - 5, 0], [MAX_S + 5, 0]], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#C9C4B8',
        strokeWidth: 1,
        fixed: true,
        highlight: false,
      });

      // Crushing capacity — constant horizontal line
      const crushingKn = curve[0].crushingKn;
      board.create('line', [[MIN_S - 5, crushingKn], [MAX_S + 5, crushingKn]], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#4A7C82',
        strokeWidth: 2.5,
        fixed: true,
        highlight: false,
      });

      // Buckling capacity — the decreasing curve, clipped to the display range
      const bucklingPoints = curve
        .filter((p) => p.bucklingKn <= Y_MAX_KN)
        .map((p) => [p.slenderness, p.bucklingKn]);
      board.create(
        'curve',
        [bucklingPoints.map((p) => p[0]), bucklingPoints.map((p) => p[1])],
        {
          strokeColor: '#C4632F',
          strokeWidth: 2.5,
          fillColor: 'none',
        }
      );

      // Crossover marker (fixed — this doesn't move with the slider, it's a property of the column)
      const crossoverS = result.crossoverSlenderness;
      board.create('point', [crossoverS, crushingKn], {
        size: 3,
        fillColor: '#1F3350',
        strokeColor: '#1F3350',
        name: '',
        fixed: true,
        highlight: false,
      });
      board.create('line', [[crossoverS, -200], [crossoverS, Y_MAX_KN]], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#8B8478',
        strokeWidth: 1,
        dash: 2,
        fixed: true,
        highlight: false,
      });

      board.update();
      jxgBoardRef.current = board;
      setReady(true);
    }

    render();

    return () => {
      cancelled = true;
      if (jxgBoardRef.current) {
        try {
          const JXG = (window as any).JXG;
          JXG?.JSXGraph.freeBoard(jxgBoardRef.current);
        } catch {
          // already torn down
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draggable-marker equivalent: redraw the "current slenderness" indicator
  // whenever the slider moves, without rebuilding the whole board.
  useEffect(() => {
    const board = jxgBoardRef.current;
    if (!board || !ready) return;

    // Remove the previous marker (if any) before drawing a new one
    const existing = Object.values(board.objects).find(
      (o: any) => o.elType === 'point' && o.name === 'current'
    ) as any;
    if (existing) board.removeObject(existing);

    const yValue = Math.min(result.governingCapacityKn, Y_MAX_KN);
    board.create('point', [slenderness, yValue], {
      name: 'current',
      size: 5,
      fillColor: result.governingMode === 'crushing' ? '#4A7C82' : '#C4632F',
      strokeColor: result.governingMode === 'crushing' ? '#4A7C82' : '#C4632F',
      withLabel: false,
    });
    board.update();
  }, [slenderness, ready, result.governingCapacityKn, result.governingMode]);

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference(result.crossoverSlenderness.toString())}
      onReset={() => setSlenderness(100)}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.slendernessLabel}
            value={slenderness}
            displayValue={slenderness.toFixed(0)}
            min={MIN_S}
            max={MAX_S}
            step={1}
            onChange={setSlenderness}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              {t.crushingLabel} = <span className="text-steel-600 dark:text-steel-300">{result.crushingCapacityKn.toFixed(0)} kN</span>
            </span>
            <span>
              {t.bucklingLabel} ={' '}
              <span className="text-oxide-600 dark:text-oxide-400">
                {result.bucklingCapacityKn > Y_MAX_KN ? `>${Y_MAX_KN}` : result.bucklingCapacityKn.toFixed(0)} kN
              </span>
            </span>
            <span className="font-medium text-foreground">
              {t.governs(result.governingMode === 'crushing' ? t.crushingGoverns : t.bucklingGoverns)}
            </span>
          </div>
        </div>
      }
    >
      <div ref={boardRef} className="h-72 w-full" />
    </VisualizationFrame>
  );
}
