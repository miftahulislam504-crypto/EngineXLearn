'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Registry mapping a Lesson's `labKey` to the lab component that renders
 * it — same pattern as components/visualizations/registry.tsx. Adding a
 * new lab means: build the component under a subject subfolder (soil/,
 * concrete/, highway/, survey/ — matching the blueprint's four labs), add
 * one line here, set that key on the relevant Lesson row.
 */

function LabLoadingFallback() {
  return (
    <div className="flex h-72 w-full items-center justify-center rounded-lg border border-border bg-card">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}

const SieveAnalysisLab = dynamic(
  () => import('./soil/sieve-analysis-lab').then((m) => m.SieveAnalysisLab),
  { ssr: false, loading: LabLoadingFallback }
);

const SlumpTestLab = dynamic(
  () => import('./concrete/slump-test-lab').then((m) => m.SlumpTestLab),
  { ssr: false, loading: LabLoadingFallback }
);

const AggregateImpactLab = dynamic(
  () => import('./highway/aggregate-impact-lab').then((m) => m.AggregateImpactLab),
  { ssr: false, loading: LabLoadingFallback }
);

const LevellingLab = dynamic(
  () => import('./survey/levelling-lab').then((m) => m.LevellingLab),
  { ssr: false, loading: LabLoadingFallback }
);

const CompressionTestLab = dynamic(
  () => import('./concrete/compression-test-lab').then((m) => m.CompressionTestLab),
  { ssr: false, loading: LabLoadingFallback }
);

const AtterbergLimitsLab = dynamic(
  () => import('./soil/atterberg-limits-lab').then((m) => m.AtterbergLimitsLab),
  { ssr: false, loading: LabLoadingFallback }
);

const BitumenPenetrationLab = dynamic(
  () => import('./highway/bitumen-penetration-lab').then((m) => m.BitumenPenetrationLab),
  { ssr: false, loading: LabLoadingFallback }
);

const FlexuralTestLab = dynamic(
  () => import('./concrete/flexural-test-lab').then((m) => m.FlexuralTestLab),
  { ssr: false, loading: LabLoadingFallback }
);

const CompactionTestLab = dynamic(
  () => import('./soil/compaction-test-lab').then((m) => m.CompactionTestLab),
  { ssr: false, loading: LabLoadingFallback }
);

const DirectShearLab = dynamic(
  () => import('./soil/direct-shear-lab').then((m) => m.DirectShearLab),
  { ssr: false, loading: LabLoadingFallback }
);

const TotalStationLab = dynamic(
  () => import('./survey/total-station-lab').then((m) => m.TotalStationLab),
  { ssr: false, loading: LabLoadingFallback }
);

const TraverseLab = dynamic(
  () => import('./survey/traverse-lab').then((m) => m.TraverseLab),
  { ssr: false, loading: LabLoadingFallback }
);

export const LAB_REGISTRY = {
  'sieve-analysis': SieveAnalysisLab,
  'slump-test': SlumpTestLab,
  'aggregate-impact-value': AggregateImpactLab,
  'levelling': LevellingLab,
  'compression-test': CompressionTestLab,
  'atterberg-limits': AtterbergLimitsLab,
  'bitumen-penetration': BitumenPenetrationLab,
  'flexural-test': FlexuralTestLab,
  'compaction-test': CompactionTestLab,
  'direct-shear': DirectShearLab,
  'total-station': TotalStationLab,
  'traverse': TraverseLab,
} as const;

export type LabKey = keyof typeof LAB_REGISTRY;

export function isKnownLab(key: string | null | undefined): key is LabKey {
  return !!key && key in LAB_REGISTRY;
}

export function VirtualLab({
  labKey,
  lessonId,
  loggedIn,
}: {
  labKey: string | null;
  lessonId: string;
  loggedIn: boolean;
}) {
  const dict = useDictionary();

  if (!isKnownLab(labKey)) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">{dict.lab.notRegistered}</p>
      </div>
    );
  }

  const Component = LAB_REGISTRY[labKey];
  return <Component lessonId={lessonId} loggedIn={loggedIn} />;
}
