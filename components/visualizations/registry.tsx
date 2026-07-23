'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Registry mapping a Lesson's `interactiveKey` (a plain string stored in
 * Postgres) to the visualization component that renders it. Adding a new
 * visualization means: build the component under 2d/ or 3d/, add one line
 * here, set that key on the relevant Lesson row. No page code changes.
 *
 * Every entry is loaded via next/dynamic with ssr:false — both JSXGraph
 * and React Three Fiber touch the DOM/WebGL directly on mount and will
 * throw during server-side rendering otherwise.
 */

function VizLoadingFallback() {
  return (
    <div className="flex h-72 w-full items-center justify-center rounded-lg border border-border bg-card">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}

const MomentDiagramExplorer = dynamic(
  () => import('./2d/moment-diagram-explorer').then((m) => m.MomentDiagramExplorer),
  { ssr: false, loading: VizLoadingFallback }
);

const ColumnBucklingVisualizer = dynamic(
  () => import('./3d/column-buckling-visualizer').then((m) => m.ColumnBucklingVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const LoadTransferVisualizer = dynamic(
  () => import('./3d/load-transfer-visualizer').then((m) => m.LoadTransferVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const ColumnFailureComparator = dynamic(
  () => import('./2d/column-failure-visualizer').then((m) => m.ColumnFailureComparator),
  { ssr: false, loading: VizLoadingFallback }
);

const FoundationPressureVisualizer = dynamic(
  () => import('./2d/foundation-pressure-visualizer').then((m) => m.FoundationPressureVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const ReinforcementDetailsVisualizer = dynamic(
  () => import('./3d/reinforcement-details-visualizer').then((m) => m.ReinforcementDetailsVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const CrackFormationVisualizer = dynamic(
  () => import('./2d/crack-formation-visualizer').then((m) => m.CrackFormationVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const WaterFlowVisualizer = dynamic(
  () => import('./3d/water-flow-visualizer').then((m) => m.WaterFlowVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const EarthquakeMotionVisualizer = dynamic(
  () => import('./2d/earthquake-motion-visualizer').then((m) => m.EarthquakeMotionVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const SoilLayersVisualizer = dynamic(
  () => import('./3d/soil-layers-visualizer').then((m) => m.SoilLayersVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const BuildingStructureVisualizer = dynamic(
  () => import('./3d/building-structure-visualizer').then((m) => m.BuildingStructureVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const ReinforcementModelVisualizer = dynamic(
  () => import('./3d/reinforcement-model-visualizer').then((m) => m.ReinforcementModelVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

const ConstructionSequenceVisualizer = dynamic(
  () => import('./3d/construction-sequence-visualizer').then((m) => m.ConstructionSequenceVisualizer),
  { ssr: false, loading: VizLoadingFallback }
);

export const VISUALIZATION_REGISTRY = {
  'moment-diagram-explorer': MomentDiagramExplorer,
  'column-buckling-visualizer': ColumnBucklingVisualizer,
  'load-transfer-visualizer': LoadTransferVisualizer,
  'column-failure-comparator': ColumnFailureComparator,
  'foundation-pressure-visualizer': FoundationPressureVisualizer,
  'reinforcement-details-visualizer': ReinforcementDetailsVisualizer,
  'crack-formation-visualizer': CrackFormationVisualizer,
  'water-flow-visualizer': WaterFlowVisualizer,
  'earthquake-motion-visualizer': EarthquakeMotionVisualizer,
  'soil-layers-visualizer': SoilLayersVisualizer,
  'building-structure-visualizer': BuildingStructureVisualizer,
  'reinforcement-model-visualizer': ReinforcementModelVisualizer,
  'construction-sequence-visualizer': ConstructionSequenceVisualizer,
} as const;

export type VisualizationKey = keyof typeof VISUALIZATION_REGISTRY;

export function isKnownVisualization(key: string | null | undefined): key is VisualizationKey {
  return !!key && key in VISUALIZATION_REGISTRY;
}

/**
 * Renders the visualization for a given interactiveKey, or a clear
 * "not wired up yet" state if the key doesn't match anything in the
 * registry — which happens for lesson rows seeded with contentType:
 * 'interactive' but no matching component built yet (structure now,
 * component later — the same convention as the rest of this platform).
 */
export function InteractiveVisualization({ interactiveKey }: { interactiveKey: string | null }) {
  const dict = useDictionary();

  if (!isKnownVisualization(interactiveKey)) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">{dict.visualization.notRegistered}</p>
      </div>
    );
  }

  const Component = VISUALIZATION_REGISTRY[interactiveKey];
  return <Component />;
}
