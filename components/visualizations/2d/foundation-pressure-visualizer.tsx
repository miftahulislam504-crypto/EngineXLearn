'use client';

import { useEffect, useRef, useState } from 'react';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import {
  computeFoundationPressure,
  DEFAULT_FOUNDATION_PRESSURE_INPUTS,
} from './foundation-pressure-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Foundation Pressure Distribution — a footing cross-section with a
 * draggable load position, showing the resulting soil pressure diagram
 * beneath it: uniform when centered, trapezoidal when eccentric but
 * within the middle third, triangular with visible uplift when the
 * eccentricity pushes the resultant outside the middle third.
 */

type JXGBoard = any;

const FOOTING_WIDTH_UNITS = 6; // display units, independent of the real footingWidthM input

export function FoundationPressureVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.foundationPressure;
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoardRef = useRef<JXGBoard | null>(null);
  const [eccentricityM, setEccentricityM] = useState(
    DEFAULT_FOUNDATION_PRESSURE_INPUTS.eccentricityM
  );
  const [ready, setReady] = useState(false);

  const inputs = { ...DEFAULT_FOUNDATION_PRESSURE_INPUTS, eccentricityM };
  const result = computeFoundationPressure(inputs);

  const explanationText =
    result.distributionShape === 'uniform'
      ? t.uniformDesc
      : result.distributionShape === 'trapezoidal'
        ? t.trapezoidalDesc(result.middleThirdLimitM.toFixed(3))
        : result.overturns
          ? t.overturns
          : t.uplift(result.contactWidthM.toFixed(2), inputs.footingWidthM.toString());

  // Map the real eccentricity (meters) onto display units, keeping the
  // footing's real width-to-eccentricity ratio visually accurate rather
  // than an arbitrary rescale — a viewer should be able to see e getting
  // close to B/6 or B/2, not just watch an abstract slider number change.
  const scale = FOOTING_WIDTH_UNITS / inputs.footingWidthM;
  const eDisplay = eccentricityM * scale;
  const halfWidthDisplay = FOOTING_WIDTH_UNITS / 2;

  const maxPressureForScale = 500; // kPa -> display height scale reference
  const pressureScale = 1.5 / maxPressureForScale;

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const JXG = (await import('jsxgraph')).default;
      if (cancelled || !boardRef.current) return;

      const board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [-4.5, 3, 4.5, -3],
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
      });

      // Board starts empty — the eccentricity-driven effect below draws
      // the axis line, footing, and pressure diagram together as soon as
      // `ready` flips true, so there's no reason to draw a line here that
      // would just be cleared and redrawn a moment later.
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
  }, []);

  // Redraw the footing + pressure diagram whenever eccentricity changes —
  // simpler to fully redraw this scene each time than to track/mutate a
  // large set of individual JSXGraph elements, since the diagram's shape
  // (trapezoid vs triangle) genuinely changes, not just its size.
  useEffect(() => {
    const board = jxgBoardRef.current;
    if (!board || !ready) return;

    // Clear every existing element and redraw from scratch — simpler and
    // less error-prone than tracking which specific elements to keep,
    // since the diagram's shape (trapezoid vs triangle) genuinely changes
    // between eccentricity values, not just its size.
    board.suspendUpdate();
    for (const obj of Object.values(board.objects)) {
      const o = obj as any;
      if (o.elType) board.removeObject(o, false);
    }

    // Footing (rectangle) — drawn just above the axis line
    board.create(
      'polygon',
      [
        [-halfWidthDisplay, 0.15],
        [halfWidthDisplay, 0.15],
        [halfWidthDisplay, 0.6],
        [-halfWidthDisplay, 0.6],
      ],
      {
        fillColor: '#38636A',
        fillOpacity: 1,
        borders: { strokeColor: '#38636A' },
        vertices: { visible: false },
        fixed: true,
        highlight: false,
      }
    );

    // Load arrow at the (possibly eccentric) load position
    const loadX = Math.max(-halfWidthDisplay, Math.min(halfWidthDisplay, eDisplay));
    board.create('arrow', [[loadX, 2.2], [loadX, 0.65]], {
      strokeColor: '#C4632F',
      strokeWidth: 3,
      fixed: true,
      highlight: false,
    });
    board.create('text', [loadX, 2.4, 'P'], {
      fontSize: 13,
      anchorX: 'middle',
      color: '#A54F24',
      fixed: true,
      highlight: false,
    });

    // Pressure diagram beneath the footing
    const qMaxHeight = result.qMaxKpa * pressureScale;
    const qMinHeight = result.qMinKpa * pressureScale;

    if (result.distributionShape === 'triangular-uplift' && result.qMinKpa === 0) {
      // Exact geometry: the triangle's base is the real contact width
      // (computed in foundation-pressure-logic.ts, not re-derived here),
      // mapped to display units with the same scale factor used for
      // eccentricity — so what's drawn matches the numbers in the
      // controls panel exactly, not an approximation of them.
      const leaningRight = eDisplay >= 0;
      const edgeX = leaningRight ? halfWidthDisplay : -halfWidthDisplay;
      const contactWidthDisplay = result.contactWidthM * scale;
      const zeroPointX = leaningRight
        ? halfWidthDisplay - contactWidthDisplay
        : -halfWidthDisplay + contactWidthDisplay;
      const liftedEdgeX = leaningRight ? -halfWidthDisplay : halfWidthDisplay;

      if (contactWidthDisplay > 0) {
        board.create(
          'polygon',
          [
            [edgeX, 0.1],
            [zeroPointX, 0.1],
            [edgeX, 0.1 - qMaxHeight],
          ],
          {
            fillColor: '#C4632F',
            fillOpacity: 0.35,
            borders: { strokeColor: '#C4632F', strokeWidth: 2 },
            vertices: { visible: false },
            fixed: true,
            highlight: false,
          }
        );
      }

      board.create('text', [liftedEdgeX, 0.3, '0 (uplift)'], {
        fontSize: 10,
        anchorX: leaningRight ? 'left' : 'right',
        color: '#8B8478',
        fixed: true,
        highlight: false,
      });
    } else {
      // Uniform or trapezoidal — draw the full-width quadrilateral, which
      // correctly degenerates to a rectangle when qMax === qMin (e = 0).
      board.create(
        'polygon',
        [
          [-halfWidthDisplay, 0.1],
          [halfWidthDisplay, 0.1],
          [halfWidthDisplay, 0.1 - qMaxHeight],
          [-halfWidthDisplay, 0.1 - qMinHeight],
        ],
        {
          fillColor: '#4A7C82',
          fillOpacity: 0.35,
          borders: { strokeColor: '#4A7C82', strokeWidth: 2 },
          vertices: { visible: false },
          fixed: true,
          highlight: false,
        }
      );
    }

    board.create('line', [[-4.5, 0], [4.5, 0]], {
      straightFirst: false,
      straightLast: false,
      strokeColor: '#8B8478',
      strokeWidth: 1,
      fixed: true,
      highlight: false,
    });

    board.unsuspendUpdate();
    board.update();
  }, [eDisplay, halfWidthDisplay, result, ready, pressureScale]);

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => setEccentricityM(DEFAULT_FOUNDATION_PRESSURE_INPUTS.eccentricityM)}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.eccentricityLabel}
            value={eccentricityM}
            displayValue={`${eccentricityM.toFixed(2)} m`}
            min={0}
            max={0.9}
            step={0.02}
            onChange={setEccentricityM}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              q_max = <span className="text-foreground">{result.qMaxKpa} kPa</span>
            </span>
            <span>
              q_min = <span className="text-foreground">{result.qMinKpa} kPa</span>
            </span>
            <span>
              {t.middleThirdLimitLabel} ={' '}
              <span className="text-foreground">{result.middleThirdLimitM} m</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{explanationText}</p>
        </div>
      }
    >
      <div ref={boardRef} className="h-72 w-full" />
    </VisualizationFrame>
  );
}
