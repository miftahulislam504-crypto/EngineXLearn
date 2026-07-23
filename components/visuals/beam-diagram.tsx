'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * BeamDiagram — the platform's signature element.
 *
 * A simply-supported beam under a single point load. Drag the load along
 * the beam and watch the bending-moment diagram redraw live underneath it.
 * This isn't a stock illustration — it's the actual physics (M(x) for a
 * simply supported beam with a point load P at distance `a` from the left
 * support, span L):
 *
 *   R1 = P(L-a)/L,  R2 = Pa/L
 *   M(x) = R1 * x            for 0 <= x <= a
 *   M(x) = R2 * (L - x)      for a <= x <= L
 *
 * Rendered as SVG so it stays crisp at any size and costs nothing on the
 * main thread beyond the drag handler.
 */

const SPAN = 600; // beam length in SVG units
const BEAM_Y = 120;
const MAX_MOMENT_HEIGHT = 90;
const LOAD_MAGNITUDE = 10; // arbitrary consistent unit (kN) for the demo

export function BeamDiagram() {
  const dict = useDictionary();
  const [loadPosition, setLoadPosition] = useState(0.35); // fraction of span, 0..1
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const a = loadPosition * SPAN;
  const L = SPAN;

  const { r1, r2, maxMoment, momentPath } = useMemo(() => {
    const P = LOAD_MAGNITUDE;
    const R1 = (P * (L - a)) / L;
    const R2 = (P * a) / L;
    const Mmax = (R1 * a) / 1; // moment at load point (= R2 * (L-a) too)

    // Build the moment-diagram path: rises linearly to Mmax at x=a, falls
    // linearly back to 0 at x=L. Two straight segments, drawn as a filled
    // area under a polyline for a clean "structural diagram" look.
    const scale = Mmax > 0 ? MAX_MOMENT_HEIGHT / Mmax : 0;
    const peakY = MAX_MOMENT_HEIGHT * scale === 0 ? 0 : MAX_MOMENT_HEIGHT;

    const path = `M 0 ${BEAM_Y + 40} L ${a} ${BEAM_Y + 40 + peakY} L ${L} ${BEAM_Y + 40} Z`;

    return { r1: R1, r2: R2, maxMoment: Mmax, momentPath: path };
  }, [a, L]);

  const updateFromClientX = useCallback((clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = SPAN / rect.width;
    const x = (clientX - rect.left) * scaleX;
    const fraction = Math.min(0.96, Math.max(0.04, x / SPAN));
    setLoadPosition(fraction);
  }, []);

  return (
    <div className="w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SPAN} ${BEAM_Y + 140}`}
        className="w-full overflow-visible"
        role="img"
        aria-label={dict.hero.beamDiagramAria}
        onPointerMove={(e) => dragging && updateFromClientX(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
      >
        {/* Faint grid backdrop, echoing drafting paper */}
        <defs>
          <pattern id="beam-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-concrete-400/20"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width={SPAN} height={BEAM_Y + 140} fill="url(#beam-grid)" />

        {/* --- Beam --- */}
        <motion.line
          x1="0"
          y1={BEAM_Y}
          x2={SPAN}
          y2={BEAM_Y}
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-structural-700 dark:text-vellum-200"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />

        {/* Pin support (left) */}
        <polygon
          points={`0,${BEAM_Y} -14,${BEAM_Y + 24} 14,${BEAM_Y + 24}`}
          className="fill-steel-500"
        />
        {/* Roller support (right) */}
        <g>
          <polygon
            points={`${SPAN},${BEAM_Y} ${SPAN - 14},${BEAM_Y + 24} ${SPAN + 14},${BEAM_Y + 24}`}
            className="fill-steel-500"
          />
          <line
            x1={SPAN - 16}
            y1={BEAM_Y + 26}
            x2={SPAN + 16}
            y2={BEAM_Y + 26}
            stroke="currentColor"
            strokeWidth="3"
            className="text-steel-500"
          />
        </g>

        {/* Hatching under both supports, standard drafting convention for "fixed to ground" */}
        {[0, SPAN].map((cx) => (
          <g key={cx} className="text-concrete-500">
            {[-10, -3, 4, 11].map((dx) => (
              <line
                key={dx}
                x1={cx + dx}
                y1={BEAM_Y + 24}
                x2={cx + dx - 6}
                y2={BEAM_Y + 32}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </g>
        ))}

        {/* --- Draggable point load (arrow) --- */}
        <motion.g
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture?.(e.pointerId);
            setDragging(true);
          }}
          animate={{ x: a }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <line
            x1="0"
            y1={BEAM_Y - 55}
            x2="0"
            y2={BEAM_Y - 6}
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-oxide-500"
            markerEnd="url(#arrowhead)"
          />
          <circle r="9" cy={BEAM_Y - 58} className="fill-oxide-500" />
          <text
            x="0"
            y={BEAM_Y - 68}
            textAnchor="middle"
            className="fill-oxide-600 dark:fill-oxide-400 font-mono text-[13px] font-medium"
          >
            P
          </text>
        </motion.g>

        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" className="fill-oxide-500" />
          </marker>
        </defs>

        {/* --- Bending moment diagram (fills/redraws live as load moves) --- */}
        <motion.path
          d={momentPath}
          className="fill-steel-500/20 stroke-steel-500"
          strokeWidth="2"
          animate={{ d: momentPath }}
          transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        />

        <text
          x={8}
          y={BEAM_Y + 40 + MAX_MOMENT_HEIGHT + 24}
          className="fill-concrete-500 font-mono text-[11px]"
        >
          M(x) — bending moment diagram
        </text>

        {/* Reaction labels */}
        <text
          x={0}
          y={BEAM_Y + 52}
          textAnchor="middle"
          className="fill-concrete-600 dark:fill-concrete-300 font-mono text-[11px]"
        >
          R₁ = {r1.toFixed(1)}
        </text>
        <text
          x={SPAN}
          y={BEAM_Y + 52}
          textAnchor="middle"
          className="fill-concrete-600 dark:fill-concrete-300 font-mono text-[11px]"
        >
          R₂ = {r2.toFixed(1)}
        </text>
        <text
          x={a}
          y={BEAM_Y + 40 + MAX_MOMENT_HEIGHT - 6}
          textAnchor="middle"
          className="fill-steel-600 dark:fill-steel-300 font-mono text-[11px] font-medium"
        >
          M_max = {maxMoment.toFixed(1)}
        </text>
      </svg>

      <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
        {dict.hero.beamCaption}
      </p>
    </div>
  );
}
