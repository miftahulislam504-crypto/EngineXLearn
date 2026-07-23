'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Moment Diagram Explorer — a simply-supported beam with a draggable point
 * load, rendered via JSXGraph. This is a JSXGraph re-implementation of the
 * same physics as the homepage hero's beam-diagram.tsx (M(x) for a simply
 * supported beam under a single point load), built as a lesson-embeddable
 * component: it takes a span/load as configurable inputs rather than owning
 * fixed layout, and exposes the reaction/moment math through the shared
 * VisualizationFrame controls panel instead of hand-drawn SVG labels.
 *
 * Why JSXGraph here and hand-rolled SVG on the homepage: the homepage hero
 * needed one fixed, highly art-directed moment (exact colors, exact
 * micro-interactions) as the page's single signature element. This
 * component needs to be one of many interchangeable lesson visualizations
 * driven by the same engine — JSXGraph's board/graph primitives are what
 * make that registry pattern viable without hand-building a renderer for
 * every future diagram.
 */

// JSXGraph attaches to `window.JXG` once its script loads. We type it loosely
// since @types/jsxgraph doesn't ship board method signatures in enough detail
// for this use, and the actual npm `jsxgraph` package exports the same global.
type JXGBoard = any;

const SPAN_M = 6; // beam span in meters, fixed for this lesson's worked example
const LOAD_KN = 10; // point load magnitude in kN, fixed for this lesson's worked example

export function MomentDiagramExplorer() {
  const dict = useDictionary();
  const t = dict.visualizations.momentDiagram;
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoardRef = useRef<JXGBoard | null>(null);
  const [loadPosition, setLoadPosition] = useState(2); // meters from left support
  const [ready, setReady] = useState(false);

  const a = loadPosition;
  const L = SPAN_M;
  const P = LOAD_KN;
  const r1 = (P * (L - a)) / L;
  const r2 = (P * a) / L;
  const mMax = r1 * a;

  useEffect(() => {
    let cancelled = false;

    async function loadJSXGraph() {
      // jsxgraph's default export attaches JXG to the module namespace;
      // importing it client-side only (this file is 'use client') avoids
      // pulling a DOM-dependent library into the server render.
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current) return;

      const board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [-0.5, 4.5, SPAN_M + 0.5, -3.5],
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
      });

      // Beam line
      board.create('line', [[0, 0], [SPAN_M, 0]], {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 5,
        strokeColor: '#1F3350',
        fixed: true,
        highlight: false,
      });

      // Supports (triangles approximated with polygons)
      board.create('polygon', [[0, 0], [-0.2, -0.4], [0.2, -0.4]], {
        fillColor: '#4A7C82',
        fillOpacity: 1,
        borders: { strokeColor: '#4A7C82' },
        vertices: { visible: false },
        fixed: true,
        highlight: false,
      });
      board.create('polygon', [[SPAN_M, 0], [SPAN_M - 0.2, -0.4], [SPAN_M + 0.2, -0.4]], {
        fillColor: '#4A7C82',
        fillOpacity: 1,
        borders: { strokeColor: '#4A7C82' },
        vertices: { visible: false },
        fixed: true,
        highlight: false,
      });

      // Draggable load point (constrained to the beam, y fixed at load arrow tip)
      const loadPoint = board.create(
        'point',
        [a, 1.6],
        {
          name: 'P',
          size: 5,
          fillColor: '#C4632F',
          strokeColor: '#C4632F',
          label: { offset: [8, 8], fontSize: 13, color: '#A54F24' },
          snapToGrid: false,
        }
      );

      // Constrain drag to stay within the span and update React state
      loadPoint.on('drag', () => {
        const x = Math.min(Math.max(loadPoint.X(), 0.2), SPAN_M - 0.2);
        loadPoint.moveTo([x, 1.6]);
        setLoadPosition(Math.round(x * 10) / 10);
      });

      // Load arrow (from point down to the beam)
      board.create('arrow', [[() => loadPoint.X(), 1.6], [() => loadPoint.X(), 0.1]], {
        strokeColor: '#C4632F',
        strokeWidth: 3,
        fixed: true,
        highlight: false,
      });

      // Moment diagram — piecewise linear function of x, drawn beneath the beam
      const momentCurve = board.create(
        'functiongraph',
        [
          (x: number) => {
            const P_ = LOAD_KN;
            const R1_ = (P_ * (SPAN_M - loadPoint.X())) / SPAN_M;
            const R2_ = (P_ * loadPoint.X()) / SPAN_M;
            if (x < 0 || x > SPAN_M) return 0;
            const m = x <= loadPoint.X() ? R1_ * x : R2_ * (SPAN_M - x);
            return -m / 4; // scaled + flipped so the diagram reads "below the beam"
          },
          0,
          SPAN_M,
        ],
        {
          strokeColor: '#4A7C82',
          strokeWidth: 2,
          fillColor: '#4A7C82',
          fillOpacity: 0.15,
          fillBetween: [() => 0],
        } as any
      );

      board.update();
      jxgBoardRef.current = board;
      setReady(true);
    }

    loadJSXGraph();

    return () => {
      cancelled = true;
      if (jxgBoardRef.current && boardRef.current) {
        try {
          const JXG = (window as any).JXG;
          JXG?.JSXGraph.freeBoard(jxgBoardRef.current);
        } catch {
          // board already torn down
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync slider-driven position changes back into the JSXGraph point
  useEffect(() => {
    const board = jxgBoardRef.current;
    if (!board || !ready) return;
    const point = Object.values(board.objects).find(
      (o: any) => o.elType === 'point' && o.name === 'P'
    ) as any;
    if (point && Math.abs(point.X() - a) > 0.01) {
      point.moveTo([a, 1.6]);
      board.update();
    }
  }, [a, ready]);

  const handleReset = useCallback(() => {
    setLoadPosition(2);
  }, []);

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={handleReset}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.loadPositionLabel}
            value={loadPosition}
            displayValue={`${loadPosition.toFixed(1)} m`}
            min={0.2}
            max={SPAN_M - 0.2}
            step={0.1}
            onChange={setLoadPosition}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              R₁ = <span className="text-foreground">{r1.toFixed(2)} kN</span>
            </span>
            <span>
              R₂ = <span className="text-foreground">{r2.toFixed(2)} kN</span>
            </span>
            <span>
              M_max = <span className="text-steel-600 dark:text-steel-300">{mMax.toFixed(2)} kN·m</span>
            </span>
          </div>
        </div>
      }
    >
      <div ref={boardRef} className="h-72 w-full" />
    </VisualizationFrame>
  );
}
