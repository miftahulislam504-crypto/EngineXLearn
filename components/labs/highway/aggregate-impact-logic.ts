/**
 * Aggregate Impact Value (AIV) Test — BS 812-112 / BNBC 2020, measures
 * aggregate resistance to sudden shock loading, a key property for road
 * surfacing aggregate specifically (as opposed to crushing strength under
 * gradually applied load, which a different test — the Aggregate Crushing
 * Value test — measures).
 *
 * AIV (%) = (mass passing the 2.36mm sieve after impact / original mass) × 100
 *
 * Lower AIV = tougher aggregate (less of it broke down into fines under
 * impact). This is the opposite direction of most "higher is better"
 * intuitions, and worth stating explicitly in the report so it doesn't
 * read backwards to a student seeing it for the first time.
 */

export type AggregateGrade = 'exceptional' | 'strong' | 'satisfactory' | 'weak';

export interface AggregateImpactResult {
  aivPercent: number;
  grade: AggregateGrade;
}

const GRADE_BANDS: { max: number; grade: AggregateGrade }[] = [
  { max: 10, grade: 'exceptional' },
  { max: 20, grade: 'strong' },
  { max: 30, grade: 'satisfactory' },
  { max: Infinity, grade: 'weak' },
];

export function computeAggregateImpactValue(
  originalMassG: number,
  passing2_36mmG: number
): AggregateImpactResult {
  const aivPercent =
    originalMassG > 0 ? Math.round((passing2_36mmG / originalMassG) * 1000) / 10 : 0;

  const band = GRADE_BANDS.find((b) => aivPercent < b.max) ?? GRADE_BANDS[GRADE_BANDS.length - 1];

  return {
    aivPercent,
    grade: band.grade,
  };
}
