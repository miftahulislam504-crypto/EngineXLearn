'use client';

import { useEffect, useRef, useState } from 'react';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import { generateCrackPattern } from './crack-formation-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Crack Formation / Shear Failure — a beam with a draggable load, showing
 * how crack angle rotates from vertical (flexural, near midspan) to
 * diagonal (shear, near supports) as you move along the span. Reuses the
 * same beam physics as the homepage hero and Moment Diagram Explorer, so
 * a student who's seen those already recognizes this beam.
 */

type JXGBoard = any;

const SPAN_M = 6;
const LOAD_KN = 10;

export function CrackFormationVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.crackFormation;

  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoardRef = useRef<JXGBoard | null>(null);
  const [loadPositionFraction, setLoadPositionFraction] = useState(0.35);
  const [inspectXFraction, setInspectXFraction] = useState(0.15);
  const [ready, setReady] = useState(false);

  const pattern = generateCrackPattern(SPAN_M, loadPositionFraction, LOAD_KN, 40);
  const nearestPoint = pattern.reduce((closest, p) =>
    Math.abs(p.xFraction - inspectXFraction) < Math.abs(closest.xFraction - inspectXFraction) ? p : closest
  );

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current) return;

      const board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [-0.5, 3, SPAN_M + 0.5, -2.5],
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
      });

      board.create('line', [[0, 0], [SPAN_M, 0]], {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 5,
        strokeColor: '#1F3350',
        fixed: true,
        highlight: false,
      });

      // Crack marks along the span — short diagonal lines whose angle
      // reflects generateCrackPattern's output at each point, alternating
      // above/below the beam axis for visual clarity (real diagonal
      // shear cracks in a beam web appear on both faces).
      pattern.forEach((p, i) => {
        if (i % 2 !== 0) return; // every other point, so marks aren't crowded
        const x = p.xFraction * SPAN_M;
        const angleRad = (p.crackAngleFromVerticalDeg * Math.PI) / 180;
        const len = 0.35;
        const dx = len * Math.sin(angleRad);
        const dy = len * Math.cos(angleRad);
        const side = p.shearKn >= 0 ? 1 : -1; // lean direction follows shear sign

        board.create(
          'line',
          [
            [x - dx * side * 0.3, 0.1],
            [x + dx * side * 0.7, 0.1 + dy],
          ],
          {
            straightFirst: false,
            straightLast: false,
            strokeColor: '#C4632F',
            strokeWidth: 1.5,
            fixed: true,
            highlight: false,
          }
        );
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
  }, [loadPositionFraction]);

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => {
        setLoadPositionFraction(0.35);
        setInspectXFraction(0.15);
      }}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.loadPositionLabel}
            value={loadPositionFraction}
            displayValue={`${(loadPositionFraction * SPAN_M).toFixed(1)} m`}
            min={0.05}
            max={0.95}
            step={0.05}
            onChange={setLoadPositionFraction}
          />
          <VizSlider
            label={t.inspectPositionLabel}
            value={inspectXFraction}
            displayValue={`${(inspectXFraction * SPAN_M).toFixed(1)} m`}
            min={0}
            max={1}
            step={0.025}
            onChange={setInspectXFraction}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              V = <span className="text-foreground">{Math.abs(nearestPoint.shearKn).toFixed(1)} kN</span>
            </span>
            <span>
              M = <span className="text-foreground">{nearestPoint.momentKnm.toFixed(1)} kN·m</span>
            </span>
            <span>
              {t.crackAngleLabel} ={' '}
              <span className="text-oxide-600 dark:text-oxide-400">
                {nearestPoint.crackAngleFromVerticalDeg.toFixed(0)}°
              </span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {nearestPoint.crackAngleFromVerticalDeg > 35 ? t.shearDominated : nearestPoint.crackAngleFromVerticalDeg < 15 ? t.flexureDominated : t.transitionZone}
          </p>
        </div>
      }
    >
      <div ref={boardRef} className="h-72 w-full" />
    </VisualizationFrame>
  );
}
