'use client';

import dynamic from 'next/dynamic';
import {
  Ruler,
  Square,
  Box,
  Weight,
  HardHat,
  Layers,
  MoveVertical,
  TrendingUp,
  Droplets,
  GitCommitHorizontal,
  Scale,
  Mountain,
} from 'lucide-react';

const VizLoadingFallback = () => (
  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Loading…</div>
);

const UnitConverterTool = dynamic(() => import('./basic/unit-converter-tool').then((m) => m.UnitConverterTool), {
  ssr: false,
  loading: VizLoadingFallback,
});
const AreaCalculatorTool = dynamic(() => import('./basic/area-calculator-tool').then((m) => m.AreaCalculatorTool), {
  ssr: false,
  loading: VizLoadingFallback,
});
const VolumeCalculatorTool = dynamic(
  () => import('./basic/volume-calculator-tool').then((m) => m.VolumeCalculatorTool),
  { ssr: false, loading: VizLoadingFallback }
);
const SteelWeightTool = dynamic(() => import('./civil/steel-weight-tool').then((m) => m.SteelWeightTool), {
  ssr: false,
  loading: VizLoadingFallback,
});
const ConcreteCalculatorTool = dynamic(
  () => import('./civil/concrete-calculator-tool').then((m) => m.ConcreteCalculatorTool),
  { ssr: false, loading: VizLoadingFallback }
);
const BrickCalculatorTool = dynamic(
  () => import('./civil/brick-calculator-tool').then((m) => m.BrickCalculatorTool),
  { ssr: false, loading: VizLoadingFallback }
);
const StairCalculatorTool = dynamic(
  () => import('./civil/stair-calculator-tool').then((m) => m.StairCalculatorTool),
  { ssr: false, loading: VizLoadingFallback }
);
const SlopeCalculatorTool = dynamic(
  () => import('./civil/slope-calculator-tool').then((m) => m.SlopeCalculatorTool),
  { ssr: false, loading: VizLoadingFallback }
);
const WaterTankTool = dynamic(() => import('./civil/water-tank-tool').then((m) => m.WaterTankTool), {
  ssr: false,
  loading: VizLoadingFallback,
});
const BeamCalculatorTool = dynamic(
  () => import('./advanced/beam-calculator-tool').then((m) => m.BeamCalculatorTool),
  { ssr: false, loading: VizLoadingFallback }
);
const LoadCalculatorTool = dynamic(
  () => import('./advanced/load-calculator-tool').then((m) => m.LoadCalculatorTool),
  { ssr: false, loading: VizLoadingFallback }
);
const SoilBearingTool = dynamic(() => import('./advanced/soil-bearing-tool').then((m) => m.SoilBearingTool), {
  ssr: false,
  loading: VizLoadingFallback,
});

export type ToolCategory = 'basic' | 'civil' | 'advanced';

export interface ToolMeta {
  slug: string;
  category: ToolCategory;
  icon: typeof Ruler;
  component: React.ComponentType<{ loggedIn: boolean }>;
}

export const TOOL_REGISTRY: ToolMeta[] = [
  { slug: 'unit-converter', category: 'basic', icon: Ruler, component: UnitConverterTool },
  { slug: 'area-calculator', category: 'basic', icon: Square, component: AreaCalculatorTool },
  { slug: 'volume-calculator', category: 'basic', icon: Box, component: VolumeCalculatorTool },
  { slug: 'steel-weight-calculator', category: 'civil', icon: Weight, component: SteelWeightTool },
  { slug: 'concrete-calculator', category: 'civil', icon: HardHat, component: ConcreteCalculatorTool },
  { slug: 'brick-calculator', category: 'civil', icon: Layers, component: BrickCalculatorTool },
  { slug: 'stair-calculator', category: 'civil', icon: MoveVertical, component: StairCalculatorTool },
  { slug: 'slope-calculator', category: 'civil', icon: TrendingUp, component: SlopeCalculatorTool },
  { slug: 'water-tank-calculator', category: 'civil', icon: Droplets, component: WaterTankTool },
  { slug: 'beam-calculator', category: 'advanced', icon: GitCommitHorizontal, component: BeamCalculatorTool },
  { slug: 'load-calculator', category: 'advanced', icon: Scale, component: LoadCalculatorTool },
  { slug: 'soil-bearing-calculator', category: 'advanced', icon: Mountain, component: SoilBearingTool },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOL_REGISTRY.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return TOOL_REGISTRY.filter((t) => t.category === category);
}
