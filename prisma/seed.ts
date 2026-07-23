import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seeds all 8 subject areas and every course listed under them in the
 * Master Blueprint (Part 4.1). One course per subject gets full lesson
 * content written out, so the Lesson Viewer has real material to render
 * in every subject area. The remaining courses are seeded with correct
 * module/lesson structure and accurate descriptions, but `body: null` —
 * structure now, prose later, same as the Phase 1 placeholder convention.
 *
 * Run with: npx prisma db seed
 * (wired up via the "prisma.seed" field in package.json)
 */

type LessonSeed = {
  title: string;
  titleBn?: string;
  contentType: 'reading' | 'video' | 'interactive' | 'lab';
  durationMin?: number;
  body?: string;
  interactiveKey?: string; // registry key — see components/visualizations/registry.tsx
  labKey?: string; // registry key — see components/labs/registry.tsx
};

type ModuleSeed = {
  title: string;
  titleBn?: string;
  lessons: LessonSeed[];
};

type CourseSeed = {
  slug: string;
  title: string;
  titleBn?: string;
  description: string;
  published: boolean;
  modules: ModuleSeed[];
};

type SubjectSeed = {
  slug: string;
  title: string;
  titleBn: string;
  description: string;
  courses: CourseSeed[];
};

// ---------------------------------------------------------------------------
// Fully-written course: Structural Analysis (under Structural Engineering)
// ---------------------------------------------------------------------------
const structuralAnalysisCourse: CourseSeed = {
  slug: 'structural-analysis',
  title: 'Structural Analysis',
  titleBn: 'স্ট্রাকচারাল অ্যানালাইসিস',
  description:
    'How loads move through a structure — reactions, internal forces, and deflections in beams and simple frames.',
  published: true,
  modules: [
    {
      title: 'Reactions and Equilibrium',
      lessons: [
        {
          title: 'Free body diagrams',
          contentType: 'reading',
          durationMin: 12,
          body: `# Free body diagrams

Before you can analyze any structure, you need to isolate it from
everything touching it — supports, other members, loads — and replace
each of those with the force or moment it exerts. That isolated
sketch is a **free body diagram (FBD)**.

## Why this matters on site, not just on paper

An FBD is the same habit a site engineer uses when checking whether a
temporary shoring prop is doing its job: ignore what the prop is *for*,
and just ask what forces are acting on it right now.

## The three equilibrium equations (2D)

For any body at rest:

- ΣFx = 0 — horizontal forces balance
- ΣFy = 0 — vertical forces balance
- ΣM = 0 — moments about any point balance

Three equations means you can solve for at most three unknowns from a
single FBD. A simply-supported beam with a pin support (2 unknown
reaction components) and a roller support (1 unknown reaction
component) gives exactly three unknowns — which is why that support
combination is called **statically determinate**.

## Worked example

A simply-supported beam, span 6 m, carries a single point load of
10 kN at 2 m from the left support.

Taking moments about the left support:

R₂ × 6 = 10 × 2
R₂ = 3.33 kN

Then from ΣFy = 0:

R₁ + R₂ = 10
R₁ = 6.67 kN

Notice the load closer to the left support puts *more* reaction on the
left support — the beam is "sharing" the load in inverse proportion to
distance, the same principle you can see live in the beam diagram on
the CivilLearn home page.`,
        },
        {
          title: 'Determinate vs. indeterminate structures',
          contentType: 'reading',
          durationMin: 10,
          body: `# Determinate vs. indeterminate structures

A structure is **statically determinate** when the equilibrium
equations alone (ΣFx=0, ΣFy=0, ΣM=0) are enough to solve for every
reaction. Add one more support than equilibrium can handle, and it
becomes **statically indeterminate** — you need additional equations
from how the material deforms (compatibility conditions) to solve it.

## Quick test

Degree of static indeterminacy for a 2D structure:

DSI = (reactions + internal force components) − (3 × number of rigid bodies)

If DSI = 0 → determinate.
If DSI > 0 → indeterminate to that degree.

## Why it matters for design

Indeterminate structures are usually *more* efficient (loads
redistribute if one part is overstressed) but *harder* to analyze by
hand — this is exactly why software like STAAD Pro and ETABS exist:
they solve the compatibility equations numerically so you don't have
to by hand for anything beyond a textbook example.`,
        },
      ],
    },
    {
      title: 'Shear Force and Bending Moment Diagrams',
      lessons: [
        {
          title: 'Building a shear force diagram',
          contentType: 'reading',
          durationMin: 14,
          body: `# Building a shear force diagram

Shear force V(x) at any point along a beam is the sum of all vertical
forces to one side of that point. Walk from left to right:

- At a support reaction pointing up → V jumps up by that amount
- At a downward point load → V jumps down by that amount
- Under a uniformly distributed load (UDL) → V changes linearly, with
  slope equal to −w (the load per unit length)

## Sign convention

Positive shear: the left portion of the beam tends to move up relative
to the right portion. This is a convention, not a law of physics — but
staying consistent with it is what makes the bending-moment diagram
you draw next actually correct.

## Connecting to the moment diagram

The single most useful relationship in beam analysis:

dM/dx = V(x)

In words: **the bending moment diagram's slope at any point equals the
shear force at that point.** Wherever V = 0, the moment diagram has a
local maximum or minimum — which is exactly where you'd check for the
worst-case bending stress in a real design.`,
        },
        {
          title: 'Interactive: point load moment diagram',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'moment-diagram-explorer',
        },
        {
          title: 'Practice set: SFD/BMD for common load cases',
          contentType: 'reading',
          durationMin: 20,
          body: `# Practice set: SFD/BMD for common load cases

Work through these by hand before checking against software — the
point isn't the final numbers, it's building the intuition for what
"looks right."

1. Simply-supported beam, span L, UDL w across full span.
   Expect: parabolic moment diagram, maximum at midspan = wL²/8.

2. Cantilever, length L, point load P at free end.
   Expect: linear moment diagram, maximum at fixed end = PL, shear
   constant = P along full length.

3. Simply-supported beam, span L, two equal point loads P at L/3 and
   2L/3 (symmetric loading).
   Expect: trapezoidal moment diagram, constant maximum region between
   the two loads.

If your diagram for case 1 isn't a smooth curve, check whether you
treated the UDL as a series of point loads by mistake — a UDL gives a
*curved* moment diagram, not a straight-line one.`,
        },
      ],
    },
    {
      title: 'Deflection',
      lessons: [
        {
          title: 'Why deflection limits exist',
          contentType: 'reading',
          durationMin: 9,
          body: `# Why deflection limits exist

A beam can be strong enough to never break and still fail its job if
it sags too much — cracked plaster, doors that stick, floors that feel
"bouncy." BNBC 2020 sets serviceability deflection limits (commonly
span/360 for live load on floors supporting brittle finishes) precisely
to prevent this kind of failure, which has nothing to do with the
beam's ultimate strength.

## Double integration method (concept)

Since M(x) = EI × d²y/dx², integrating the moment equation twice gives
you the deflection curve y(x), with two constants of integration fixed
by the beam's boundary conditions (e.g., y = 0 at both supports for a
simply-supported beam).

In practice, engineers rarely do this integration by hand for anything
but textbook cases — standard formulas (like the wL⁴/384EI maximum
deflection for a simply-supported beam under UDL) or software cover it
for real designs. What matters is knowing *why* the limit exists, so
you recognize when a software output that looks "structurally fine" on
strength might still fail on serviceability.`,
        },
      ],
    },
    {
      title: 'Load Path',
      lessons: [
        {
          title: 'From distributed load to concentrated load and back again',
          contentType: 'reading',
          durationMin: 10,
          body: `# From distributed load to concentrated load and back again

Everything so far in this course has looked at one member at a time —
a single beam, its reactions, its own moment diagram. But a real
building is a *chain* of members, and the load's character changes at
every link in that chain.

## The chain

A slab carries its load — dead weight plus live load — spread over an
**area** (kN/m²). That slab spans between beams, so each beam collects
the slab's load over its tributary width and carries it as a **line**
load (kN/m) along its own length. The beam then delivers its entire
load to the columns at each end as a **point** load (kN) — genuinely
concentrated now, at a single location. The column carries that point
load straight down, unchanged, to the foundation. And the foundation's
whole job is to reverse the entire process: take that concentrated
point load and spread it back out over an area of soil, keeping the
resulting pressure within the soil's safe bearing capacity.

Area → line → point → point → area again. That shape-change, not any
single formula, is the actual concept this lesson is building.

## Why this matters when reading a structural drawing

Once you can see this chain, a structural drawing stops being a
collection of separate member sizes and starts reading as one
connected load path. If a column looks undersized for the load it's
carrying, the first question isn't "is this column wrong" — it's
"trace the path backward: what's actually loading this column, and is
that upstream number right?" Most real design errors are found by
walking this chain, not by re-deriving a single member's formula in
isolation.

Run the visualization next and step through the same five stages —
watch a fixed slab load turn into a beam line load, then a column
point load, then get sized back into a footing footprint.`,
        },
        {
          title: 'Interactive: load transfer visualizer',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'load-transfer-visualizer',
        },
      ],
    },
    {
      title: 'Column Stability',
      lessons: [
        {
          title: 'Why slender columns fail differently',
          contentType: 'reading',
          durationMin: 10,
          body: `# Why slender columns fail differently

A short, stocky column fails by crushing — the material simply reaches
its yield stress. A slender column can fail at a much lower load,
through a completely different mechanism: **buckling**. It suddenly
bows sideways and loses all capacity, even though the material itself
is nowhere near its yield stress.

## Euler's critical load

For a pinned-pinned column:

P_cr = π²EI / (KL)²

Notice what's *not* in this formula: material strength. A slender
column's buckling capacity depends on stiffness (E, I) and geometry
(K, L) — not on how strong the steel is. Using higher-grade steel in a
slender column doesn't raise its buckling capacity at all, which
surprises a lot of students the first time they see it.

## Slenderness ratio

KL/r (effective length divided by radius of gyration) is the single
number that tells you which failure mode governs:

- Low slenderness → short column → crushing governs
- High slenderness → slender column → Euler buckling governs

Try dragging the slider in the next lesson's visualizer through that
range and watch both the predicted capacity and the deflected shape
change together.`,
        },
        {
          title: 'Interactive: column buckling visualizer',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'column-buckling-visualizer',
        },
        {
          title: 'Which failure mode actually governs?',
          contentType: 'reading',
          durationMin: 8,
          body: `# Which failure mode actually governs?

The previous lesson's Euler formula tells you the buckling capacity at
any slenderness ratio — but it doesn't tell you whether buckling is
even the failure mode that matters for a given column. A short, stocky
column will crush (the material yields) long before it ever comes
close to its Euler buckling load. Only past a certain slenderness does
buckling actually become the weaker, governing case.

## Two capacities, one governing minimum

**Crushing capacity** doesn't depend on length at all:

P_crush = Fy × A

**Buckling capacity** decreases as slenderness increases:

P_cr = π²EI / (KL)²

Plot both against slenderness ratio and they cross at one specific
point — below it, the (constant) crushing line sits below the
buckling curve, so crushing governs; above it, the buckling curve has
dropped below the crushing line, so buckling governs instead. A real
column design always takes the *lower* of the two at its actual
slenderness — never just one formula in isolation.

## Seeing it on the same column from the last lesson

For the representative column used throughout this module, that
crossover works out to a slenderness ratio around 89. Run the next
visualization and watch the marker cross from the flat crushing line
onto the falling buckling curve exactly there — the same column, the
same cross-section, just asking a different question than the last
lesson did.`,
        },
        {
          title: 'Interactive: crushing vs. buckling comparator',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'column-failure-comparator',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Fully-written course: Soil Mechanics (under Geotechnical Engineering)
// ---------------------------------------------------------------------------
const soilMechanicsCourse: CourseSeed = {
  slug: 'soil-mechanics',
  title: 'Soil Mechanics',
  titleBn: 'সয়েল মেকানিক্স',
  description: 'Soil classification, stress, and behavior under load.',
  published: true,
  modules: [
    {
      title: 'Soil as an Engineering Material',
      lessons: [
        {
          title: 'Why soil behaves unlike steel or concrete',
          contentType: 'reading',
          durationMin: 10,
          body: `# Why soil behaves unlike steel or concrete

Steel and concrete are manufactured to a specification — you can look
up their strength in a table. Soil is not manufactured; it's whatever
happens to be there, and its engineering behavior depends on things a
steel table never has to account for: how the particles are sized and
packed, how much water sits in the voids between them, and how densely
they're arranged.

This is why geotechnical engineering starts with **classification**
rather than a strength table: before you can say anything useful about
a soil's bearing capacity or settlement, you first need to know what
*kind* of soil you're dealing with.

## The two big questions classification answers

1. **Particle size** — is this soil mostly gravel, sand, silt, or clay?
   Different size ranges behave completely differently: sand drains
   freely and has essentially no cohesion; clay holds water and can be
   quite cohesive even when saturated.

2. **Gradation** — within the sand/gravel range, is there a wide range
   of particle sizes (well-graded) or mostly one size (poorly-graded,
   sometimes called uniform)? This matters directly for compaction: a
   well-graded soil has small particles filling the voids between
   large ones, packing to a much denser, more stable state than a
   uniform soil ever can.

The **sieve analysis** test in this module's lab answers exactly this
second question — quantitatively, not just by eye.`,
        },
      ],
    },
    {
      title: 'Particle Size & Gradation',
      lessons: [
        {
          title: 'Reading a gradation curve',
          contentType: 'reading',
          durationMin: 12,
          body: `# Reading a gradation curve

A sieve analysis passes a dried soil sample through a stack of sieves
with progressively smaller openings, then weighs what's retained on
each one. Convert those retained weights to **percent passing** at
each sieve size, plot it, and you get the gradation curve — the single
most-referenced plot in geotechnical engineering.

## Why the x-axis is logarithmic

A gradation curve's x-axis (particle size) is always plotted on a log
scale, because particle sizes routinely span several orders of
magnitude in one sample — from 19 mm gravel down to 0.075 mm fines.
Plotted on a normal linear scale, the fine end of the curve would be
crushed into an unreadable sliver near the origin. On a log scale,
every size decade gets equal visual space.

## D10, D30, D60 — reading three points off the curve

These are the particle sizes at which 10%, 30%, and 60% of the sample
(by weight) is finer:

- **D10** ("effective size") — commonly used in permeability estimates
- **D30, D60** — combined with D10 to compute two shape coefficients:

**Coefficient of Uniformity:**

Cu = D60 / D10

A low Cu (close to 1) means most particles are close to the same
size — a steep, narrow curve. A high Cu means a broad range of sizes —
a long, flat curve.

**Coefficient of Curvature:**

Cc = D30² / (D10 × D60)

This checks whether the *middle* of the gradation curve is smooth and
continuous, or whether there's a gap (a size range that's
underrepresented — "gap-graded" soil, which behaves differently in
compaction than a smoothly well-graded one even if Cu alone looks
fine).

## The well-graded threshold

By convention (and by BNBC 2020 / USCS practice): a sand or gravel is
considered **well-graded** when Cu > 4 and Cc falls between 1 and 3.
Meeting *both* conditions matters — a soil can have a high Cu (broad
size range) and still fail the Cc check if the curve has a gap or an
unusually flat middle section, which is exactly the kind of thing this
combined check is designed to catch that Cu alone would miss.

Run the sieve analysis lab next and you'll see this checked against a
real (if representative) data set — including a case where the two
coefficients don't agree, which happens more often with real samples
than a textbook example might suggest.`,
        },
        {
          title: 'Virtual lab: sieve analysis',
          contentType: 'lab',
          durationMin: 20,
          labKey: 'sieve-analysis',
        },
      ],
    },
    {
      title: 'Fine-Grained Soil Classification',
      lessons: [
        {
          title: "When particle size stops being enough to classify a soil",
          contentType: 'reading',
          durationMin: 11,
          body: `# When particle size stops being enough to classify a soil

Sieve analysis works well for sand and gravel, where particle size is
essentially the whole story — but pass a fine-grained soil (silt or
clay) through the same sieves and most of it ends up in the pan,
passing the finest sieve without telling you anything about how it
will actually behave. Two clays can have nearly identical grain-size
curves and still behave completely differently: one might be firm and
manageable across a wide range of moisture contents, the other might
turn to soup with only a little added water. Particle size alone
can't distinguish them — what can is how the soil's **consistency**
changes as moisture content changes, which is exactly what the
Atterberg Limits measure.

## The two boundaries that matter most

As a fine-grained soil dries from a liquid slurry to a solid, it
passes through recognizable consistency states. Two of the boundaries
between them are standardized, measurable quantities:

- **Liquid Limit (LL)** — the moisture content at which the soil
  transitions from a liquid-like to a plastic (moldable) state
- **Plastic Limit (PL)** — the moisture content at which it transitions
  from plastic to semi-solid, and starts to crumble rather than mold

The gap between them — **Plasticity Index, PI = LL − PL** — measures
the range of moisture content over which the soil stays workable and
plastic. A high PI means the soil tolerates a wide range of water
content while staying moldable (typical of clay); a low PI means it
crosses from sticky to crumbly over a narrow range (more typical of
silt).

## Reading the Casagrande chart

Plotting PI against LL for a soil, and comparing against the
**A-line** (PI = 0.73 × (LL − 20)), is the standard way fine-grained
soils get classified: above the line reads as clay-like behavior,
below it as silt-like. Combined with whether LL is above or below 50
(splitting "low plasticity" from "high plasticity"), this gives the
four common groups — CL, CH, ML, MH — that show up throughout
geotechnical practice, from foundation design to earthwork
specifications.

This is deliberately the simplified version of classification (the
same convention as the well-graded check in Sieve Analysis) — the
full USCS flowchart also folds in fines content from the gradation
test and a few edge cases this lab doesn't model. What it does give is
the real regression-based Liquid Limit determination and the actual
A-line comparison, not a shortcut version of either.

Run the lab next: the flow curve fit runs through four representative
trials, landing on a Liquid Limit around 37–38% — try dragging the
plastic limit reading up and down and watch the classification cross
from CL into the non-plastic zone as PI shrinks toward zero.`,
        },
        {
          title: 'Virtual lab: Atterberg limits',
          contentType: 'lab',
          durationMin: 22,
          labKey: 'atterberg-limits',
        },
      ],
    },
    {
      title: 'Bearing Pressure',
      lessons: [
        {
          title: 'When a footing carries more than just a centered load',
          contentType: 'reading',
          durationMin: 10,
          body: `# When a footing carries more than just a centered load

The Load Path lesson in Structural Analysis ended with the foundation
spreading a concentrated column load back out over an area of soil —
and that description quietly assumed the load lands exactly at the
footing's center, giving perfectly uniform pressure underneath. Real
footings often don't get that luxury: wind load, an off-center column,
or a moment transferred down from the structure above all shift the
*effective* location of the load away from center. Engineers describe
that shift as an **eccentricity**, e — the distance between where the
load actually acts and the footing's centroid.

## Why eccentricity changes everything about the pressure

A centered load produces uniform pressure. An eccentric load produces
**trapezoidal** pressure instead — higher on the side the load leans
toward, lower on the other — for exactly the same reason a see-saw
tips: more of the load's effect lands on the side it's closer to.

## The middle-third rule

There's a hard limit to how eccentric a load can get before something
worse happens. Soil can only push (compression) — it can't pull
(tension) the way a bolted connection could. If the eccentricity gets
large enough that the trapezoidal formula would call for *negative*
pressure on one side, that's telling you something physically
impossible. What actually happens instead: the footing lifts off the
soil on that side entirely, and the pressure redistributes as a
triangle over a smaller contact area than the footing's full width.

The boundary between these two behaviors is called the **middle
third** — as long as the eccentricity stays within B/6 of center (B
being the footing width), the full width stays in contact and the
simple trapezoidal formula holds. Push past that, and part of the
footing lifts off.

This is exactly why footing design isn't just "size it for the average
pressure" — a footing sized only for P/A can still fail at one edge if
its eccentricity was never checked against the middle-third limit.

Run the next visualization and drag the eccentricity past B/6 — you'll
see the pressure diagram itself change shape, not just size, the
moment it crosses that line.`,
        },
        {
          title: 'Interactive: foundation pressure distribution',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'foundation-pressure-visualizer',
        },
      ],
    },
    {
      title: 'Effective Stress Through Soil Layers',
      lessons: [
        {
          title: "Why 'total stress' isn't what actually holds soil together",
          contentType: 'reading',
          durationMin: 10,
          body: `# Why 'total stress' isn't what actually holds soil together

Every layer of soil above a given depth presses down under its own
weight, building up **total vertical stress** the deeper you go — the
same idea as water pressure increasing with depth in a pool. But for
soil specifically, that total stress is *not* the number that governs
how strong the soil is or how much it will settle. That governing
number is the **effective stress**, and the gap between the two is
entirely due to water.

## Terzaghi's effective stress principle

σᵥ′ = σᵥ − u

Where σᵥ is total vertical stress (from the weight of everything
above), u is pore water pressure (from groundwater sitting in the
soil's voids), and σᵥ′ is effective stress — what's left over once
you subtract out the water's contribution.

The reasoning: soil particles resist load through friction and
interlocking *between grains*. Water sitting in the pores between
those grains carries pressure just like water anywhere else, but it
can't provide any shear resistance — a fluid can't "grip" anything.
So the water's share of the total stress does nothing to hold the
soil together; only the particle-to-particle share (the effective
stress) does.

## Why the water table changes everything below it

Above the water table, pore pressure is essentially zero, so total
and effective stress are the same. Below the water table, pore
pressure grows with depth below that table, and effective stress
falls correspondingly behind total stress. This is why two points at
the *same total stress* can have very different soil strength if one
is above and one is below the water table — it's the effective stress,
not the total stress, that actually correlates with how much shear
resistance and bearing capacity the soil offers at that depth.

## Layered soil makes this cumulative, not uniform

Real soil profiles aren't one material all the way down — the
visualization that follows uses a representative 3-layer profile
(sand, then clay, then dense sand) where each layer's own unit weight
contributes to the stress buildup. At the default probe depth (4m,
within the clay layer), total stress reaches 70.0 kPa, but effective
stress is only 45.5 kPa — the water table's presence above that depth
accounts for the entire 24.5 kPa gap. Drag the probe through different
layers and watch how each layer's unit weight changes the *rate* at
which stress builds up, not just the final number.`,
        },
        {
          title: 'Interactive: soil layers and effective stress',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'soil-layers-visualizer',
        },
      ],
    },
    {
      title: 'Compaction',
      lessons: [
        {
          title: "Why compaction has a peak, not just a 'the more the better' trend",
          contentType: 'reading',
          durationMin: 10,
          body: `# Why compaction has a peak, not just a 'the more the better' trend

Every soil mechanics lesson so far has treated soil as a fixed
material and asked how it responds to load. Compaction is different —
it's about *changing* the soil itself before construction even starts,
by mechanically packing particles closer together to reduce voids and
raise density. Denser soil settles less and carries more load, which
is exactly why embankments, backfills, and pavement subgrades all get
compacted before anything is built on them.

## Why adding water helps, up to a point

It's tempting to assume compaction works best on dry soil — less water
sounds like it should mean less "wasted" volume. In practice the
opposite happens at first: a little water lubricates the particles,
letting them slide past each other into a denser arrangement under the
same compactive effort. Push past a certain point, though, and
additional water starts filling void space that particles could have
occupied instead, so density starts falling again. That combination —
rising, then falling — is why a compaction curve has a genuine peak
rather than a monotonic trend, and why finding that peak, not just
"add more water," is the actual goal.

## Why the curve needs several trials, not one good one

The peak — **Optimum Moisture Content (OMC)** and the density achieved
there, **Maximum Dry Density (MDD)** — isn't something you can read off
a single test. It's the peak of a curve traced by several trials at
different moisture contents, fitted afterward to find where dry
density stops rising and starts falling. This mirrors the same
"real regression through several points, not a single best reading"
principle as the Liquid Limit flow curve two modules back.

## The physical ceiling that catches bad data

No compacted sample can ever fully eliminate air voids — there's a
theoretical **zero-air-voids** dry density for any given moisture
content, and every real compaction curve has to stay below it. It's a
useful sanity check for exactly the same reason the Sieve Analysis
well-graded check and the Compression Test acceptance margin are: real
soil behavior has hard physical limits, and a result that violates one
means something in the test or the data is wrong, not that the soil
did something impossible.

Run the lab next: the default five trials trace out a clean peak
around 12–13% moisture — try flattening the trial values into a
straight upward trend and watch the lab explicitly refuse to report a
peak it never actually saw.`,
        },
        {
          title: 'Virtual lab: compaction test',
          contentType: 'lab',
          durationMin: 22,
          labKey: 'compaction-test',
        },
      ],
    },
    {
      title: 'Shear Strength',
      lessons: [
        {
          title: 'What actually resists a slope, a footing, or a retaining wall from sliding',
          contentType: 'reading',
          durationMin: 11,
          body: `# What actually resists a slope, a footing, or a retaining wall from sliding

Every soil property covered so far — gradation, plasticity, effective
stress, compaction — describes the soil, but none of them directly
answer the question a slope stability or foundation bearing capacity
calculation actually needs: how much shear stress can this soil resist
before it fails? That number comes from the **Mohr-Coulomb failure
criterion**, and it comes from exactly two parameters.

## The two ingredients of shear strength

**Cohesion (c)** is the shear strength a soil has even under zero
normal stress — particle-to-particle bonding (chemical, electrostatic,
or simple interlocking) that clay-rich soils have and clean sands
essentially don't. **Friction angle (φ)** is how much additional shear
strength develops as normal stress increases — the same reason it's
harder to slide a heavy box than a light one across the same floor. A
purely frictional soil (clean, cohesionless sand) has c≈0 and gets all
its strength from φ; a saturated clay tested quickly can behave the
opposite way, with strength that barely changes as normal stress
increases.

## Why three trials, not one

Because the failure criterion τ = c + σ·tan(φ) is a straight line,
finding both c and φ requires testing at more than one normal stress
and fitting a line through the results — one trial alone can't
separate "how much strength comes from cohesion" from "how much comes
from friction," the same reason two unknowns need two equations, not
one.

## Why a small negative intercept isn't a red flag

Real trial data rarely lies on a perfectly straight line, and fitting
a line through just three points can occasionally push the intercept
slightly negative even for soil that's genuinely cohesionless.
Negative cohesion isn't physically meaningful, so that's reported as
zero rather than displayed as-is — a small, explained correction, not
a sign the test failed.

Run the lab next: the default three trials fit a clean line giving
φ≈31°, c≈8 kPa — try compressing the trial normal stresses closer
together and watch the fit quality (R²) get less certain as the line
has less spread to anchor itself against.`,
        },
        {
          title: 'Virtual lab: direct shear test',
          contentType: 'lab',
          durationMin: 20,
          labKey: 'direct-shear',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Fully-written course: Earthquake Engineering (under Structural Engineering)
// ---------------------------------------------------------------------------
const earthquakeEngineeringCourse: CourseSeed = {
  slug: 'earthquake-engineering',
  title: 'Earthquake Engineering',
  titleBn: 'আর্থকোয়েক ইঞ্জিনিয়ারিং',
  description: 'Seismic load analysis and detailing for earthquake resistance.',
  published: true,
  modules: [
    {
      title: 'Resonance and Structural Period',
      lessons: [
        {
          title: "Why a building's period matters more than the shaking's strength",
          contentType: 'reading',
          durationMin: 11,
          body: `# Why a building's period matters more than the shaking's strength

A common intuition about earthquake damage is "stronger shaking causes
more damage." That's true in a broad sense, but it misses the single
most important factor in why *some* buildings in an earthquake are
destroyed while nearby, similarly-built structures survive relatively
unscathed: **resonance**.

## Every building has a natural period

Just like a swing has a natural rhythm it wants to swing at, every
building has a natural period — the time it takes to complete one
free sway cycle if you displaced it and let go. Taller, more flexible
buildings have longer natural periods (they sway slowly); shorter,
stiffer buildings have shorter periods (they sway quickly). This
period comes from the same mass-and-stiffness relationship you'd
recognize from a simple spring-mass system:

T = 2π√(m/k)

## Ground motion also has a dominant period

Earthquake ground shaking isn't a single frequency, but it does have a
**dominant period** that depends on the earthquake's characteristics
and the local soil conditions the seismic waves pass through. Soft
soil sites, in particular, tend to amplify ground motion at longer
periods compared to hard rock sites.

## When the two periods match

When a building's natural period lands close to the ground motion's
dominant period, the building resonates — its response amplifies well
beyond what a simple "how hard is it shaking" measure would predict.
The dynamic amplification factor formula:

DAF = 1 / √[(1−r²)² + (2ζr)²]

(where r is the ratio of forcing frequency to natural frequency, and ζ
is the structure's damping ratio) shows this precisely: DAF peaks
sharply right at r=1 — exact resonance — and falls off on either side.
For lightly damped structures, that peak can reach an order of
magnitude above the ground motion's own amplitude.

## Why this is a real design consideration, not just theory

This is exactly why building codes require checking a structure's
period against site-specific ground motion characteristics, and why
two nominally "equally strong" buildings can perform completely
differently in the same earthquake if their periods land on opposite
sides of the site's dominant period. It's also why adding damping
(through devices, or simply through better detailing) is such an
effective seismic design strategy — the visualization that follows
lets you see the peak amplification directly by tuning the building's
period against the ground motion's period.`,
        },
        {
          title: 'Interactive: earthquake motion and resonance',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'earthquake-motion-visualizer',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Fully-written course: RCC Design (under Structural Engineering)
// ---------------------------------------------------------------------------
const rccDesignCourse: CourseSeed = {
  slug: 'rcc-design',
  title: 'RCC Design',
  titleBn: 'আরসিসি ডিজাইন',
  description: 'Reinforced concrete member design to BNBC 2020 and ACI 318-19.',
  published: true,
  modules: [
    {
      title: 'Reinforcement Detailing',
      lessons: [
        {
          title: 'Why detailing rules exist, not just design formulas',
          contentType: 'reading',
          durationMin: 10,
          body: `# Why detailing rules exist, not just design formulas

Designing a reinforced concrete beam isn't finished once you've
calculated how much steel area it needs. The steel has to physically
fit in the section — with enough concrete cover to protect it, enough
space between bars for concrete to flow around them during casting,
and enough total area to avoid a sudden, brittle failure mode. These
are **detailing rules**, and getting them wrong produces a beam that
looks fine on a strength calculation but fails in the field or simply
can't be built as drawn.

## Minimum reinforcement — why "just enough" steel isn't enough

You might expect a beam's minimum steel requirement to come from
"whatever the applied moment calculates to." It doesn't — there's a
separate, independent minimum:

As,min = max( (1.4/fy)·b·d , (√fc′/(4·fy))·b·d )

This exists because a very lightly reinforced beam can fail
**suddenly** the moment the concrete cracks — the crack forms, and the
small amount of steel present immediately yields or ruptures, with
almost no warning. A beam with at least this minimum steel area fails
**gradually** instead: the steel yields well before rupture, giving
visible deflection and cracking as a warning sign before collapse. This
is a ductility requirement, not a strength one — it has nothing to do
with how large the applied load actually is.

## Clear spacing — a constructability rule, not just a strength rule

Bars also can't be packed arbitrarily close together. Concrete is a
particulate material — during casting, it has to flow *around* every
bar and *between* every pair of bars to fully consolidate. Pack bars
too tightly and you get voids (honeycombing) around the reinforcement,
which is a durability and bond-strength problem discovered only after
the concrete has already set. ACI 318 sets a minimum clear spacing of
the larger of 25mm or one bar diameter, specifically to keep this
physically buildable.

## Both checks, together

A real design has to satisfy both requirements *at once* — enough
bars for the minimum area, but not so many that they violate minimum
spacing in the available section width. Run the next visualization and
adjust the bar count: watch both checks respond together, and notice
that the "right" answer isn't just "more bars is safer" — too many
bars in too narrow a section fails the spacing check even while easily
passing the area check.`,
        },
        {
          title: 'Interactive: reinforcement details',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'reinforcement-details-visualizer',
        },
      ],
    },
    {
      title: 'Shear and Crack Patterns',
      lessons: [
        {
          title: 'Why cracks change direction along a beam',
          contentType: 'reading',
          durationMin: 9,
          body: `# Why cracks change direction along a beam

If you've seen a distressed concrete beam — one with visible cracking
— you may have noticed the cracks don't all point the same way. Near
midspan, cracks tend to run roughly vertical, starting at the bottom
face. Near the supports, cracks often run diagonally instead. This
isn't random — it directly reflects which internal force, shear or
bending moment, dominates at that location.

## Two different failure mechanisms

A **flexural (bending) crack** forms where the bending moment is high
and shear is comparatively low — typically near midspan for a simply
supported beam. The bottom fiber goes into tension as the beam bends,
and the crack opens roughly perpendicular to that tension, which means
close to vertical.

A **shear crack** forms where shear is high, particularly near
supports. The combination of shear and moment there creates a
principal tensile stress that isn't vertical — it's diagonal, commonly
approaching 45° in the simplified picture used at this level. This
diagonal cracking is what stirrups (vertical shear reinforcement) are
specifically designed to resist; without them, a diagonal crack can
propagate and cause a sudden shear failure, which tends to be far less
forgiving — with much less visible warning — than a flexural failure.

## A necessary simplification

The exact crack angle in a real beam depends on the full 2D stress
state at each point (principal stress direction, from Mohr's circle),
which needs actual section geometry to compute — not just the internal
shear and moment values. The visualization that follows uses a
simplified model based on the *ratio* of local shear to local moment,
which captures the right qualitative behavior — vertical near
midspan, diagonal near supports, smooth transition between — without
requiring that fuller stress analysis. It's a teaching approximation,
not a design tool.

## Why this connects directly to the last lesson

This is exactly why stirrup spacing isn't uniform along a real beam —
codes require closer stirrup spacing near supports (where shear
dominates and diagonal cracking is the governing concern) and allow
wider spacing near midspan (where shear is low). The reinforcement
detailing you just worked through and the crack pattern you're about
to see are two views of the same underlying physics.`,
        },
        {
          title: 'Interactive: crack formation visualizer',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'crack-formation-visualizer',
        },
      ],
    },
    {
      title: 'Whole-Building Models',
      lessons: [
        {
          title: 'From one beam to a whole building — same rules, much bigger picture',
          contentType: 'reading',
          durationMin: 12,
          body: `# From one beam to a whole building — same rules, much bigger picture

Every lesson in this course so far has zoomed in on one element at a
time — one beam's reinforcement, one crack pattern, one column's
failure mode. That's the right way to *learn* the rules, but it can
leave a gap: what does a whole building built from hundreds of these
individually-correct elements actually look like, together, and in
what order does it get built?

These three interactives share one sample building — a G+2 (ground
plus 2 upper floors) reinforced concrete frame, 3 bays × 2 bays,
proportioned the same way any real preliminary design would be: beam
depths checked against span/depth deflection-control ratios, column
sizes checked against a rough tributary-load capacity estimate,
footing sizes checked against an assumed safe bearing capacity — not
just picked to look reasonable. It's a teaching model, not a
submitted design, but every dimension in it could plausibly appear in
one.

## Building Structure

Explore the bare frame and the finished building together — toggle
walls on and off to see how the structural skeleton (footings,
columns, beams, slabs) relates to the non-structural infill (brick
walls, windows, doors) that fills in around it. Notice that the frame
alone is a complete, stable load path from roof to foundation; the
walls add weather protection and room division, not structural
capacity, in this kind of construction.

## Reinforcement Model

The same building, with an X-ray toggle showing the rebar cages inside
every column and beam — the direct extension of this course's
Reinforcement Detailing module from a single cross-section to an
entire building. The longitudinal bars run each member's real full
length; the ties and stirrups are shown at a reduced, clearly-stated
representative frequency rather than their real ~150-250mm code
spacing, since modeling every single tie across 36 columns and 68
beams would add thousands of meshes with no extra teaching value over
showing the pattern clearly.

## Construction Sequence

The same building again, revealed stage by stage: excavation,
footings, ground-story columns, first-floor slab, and upward, story by
story, ending with walls and roof finishing. This is the order real RC
frame buildings actually get built in — columns always rise before the
slab that caps them, because that slab needs the columns finished
first to have something to bear on, and infill walls always come after
the frame is complete, not before.

Try all three, in order — the building doesn't change underneath you,
only which lens you're looking at it through.`,
        },
        {
          title: 'Interactive: building structure',
          contentType: 'interactive',
          durationMin: 10,
          interactiveKey: 'building-structure-visualizer',
        },
        {
          title: 'Interactive: reinforcement model',
          contentType: 'interactive',
          durationMin: 10,
          interactiveKey: 'reinforcement-model-visualizer',
        },
        {
          title: 'Interactive: construction sequence',
          contentType: 'interactive',
          durationMin: 12,
          interactiveKey: 'construction-sequence-visualizer',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Fully-written course: Fluid Mechanics (under Water & Environmental Engineering)
// ---------------------------------------------------------------------------
const fluidMechanicsCourse: CourseSeed = {
  slug: 'fluid-mechanics',
  title: 'Fluid Mechanics',
  titleBn: 'ফ্লুইড মেকানিক্স',
  description: 'Fundamental behavior of fluids at rest and in motion.',
  published: true,
  modules: [
    {
      title: 'Open Channel Flow',
      lessons: [
        {
          title: "Manning's Equation and why channels aren't sized by guesswork",
          contentType: 'reading',
          durationMin: 10,
          body: `# Manning's Equation and why channels aren't sized by guesswork

Every irrigation channel, storm drain, and roadside ditch has to carry
a certain flow rate without overflowing — and that flow rate depends
on more than just how big the channel is. Two channels of identical
size can carry very different amounts of water depending on how rough
their surface is and how steep their slope is. **Manning's Equation**
is the standard formula that ties all of this together, and it's one
of the most-used formulas in civil engineering hydraulics precisely
because open channels are everywhere in infrastructure.

## The equation

V = (1/n) · R^(2/3) · S^(1/2)

Then discharge (the actual flow rate) is simply:

Q = V · A

Where:
- **n** is Manning's roughness coefficient — a material property, not a
  geometry property. Smooth finished concrete has a low n (around
  0.013); an unlined earth channel has a much higher n (around 0.025)
  because the rougher, more irregular surface resists flow more.
- **R** is the hydraulic radius, R = A/P — cross-sectional flow area
  divided by wetted perimeter (the perimeter that's actually in
  contact with water, which does *not* include the open top surface).
- **S** is the channel's slope — steeper channels flow faster for the
  same depth, the same intuition as water running downhill faster on
  a steeper hill.

## Why wetted perimeter, not just area

Two channels can have the same cross-sectional area but different
wetted perimeters — a wide, shallow channel has a larger wetted
perimeter than a narrow, deep one carrying the same area of water.
More wetted perimeter means more surface for friction to act on,
which is why hydraulic radius (not just area) is what actually
determines velocity in Manning's equation. This is a genuinely
counterintuitive point worth sitting with: a channel's *shape*, not
just its cross-sectional area, affects how much water it can carry at
a given slope.

## Reading the visualization

The next visualization lets you adjust flow depth and surface material
directly. At the default (0.8m depth, concrete lining), the channel
carries roughly 2.27 m³/s at about 1.42 m/s — watch both numbers drop
noticeably if you switch to an earth or gravel surface at the same
depth, purely from the roughness coefficient changing, with nothing
else about the channel's geometry different at all.`,
        },
        {
          title: 'Interactive: open channel flow visualizer',
          contentType: 'interactive',
          durationMin: 8,
          interactiveKey: 'water-flow-visualizer',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Fully-written course: Building Materials (under Basic Civil Engineering)
// ---------------------------------------------------------------------------
const buildingMaterialsCourse: CourseSeed = {
  slug: 'building-materials',
  title: 'Building Materials',
  titleBn: 'বিল্ডিং মেটেরিয়ালস',
  description: 'Properties, testing, and selection of the materials covered in the Material Library.',
  published: true,
  modules: [
    {
      title: 'Fresh Concrete Properties',
      lessons: [
        {
          title: 'Workability — why it matters before concrete ever hardens',
          contentType: 'reading',
          durationMin: 9,
          body: `# Workability — why it matters before concrete ever hardens

A concrete mix can have exactly the right strength on paper and still
fail on site — if it's too stiff to flow around reinforcement bars, or
too wet and prone to segregating (the heavier aggregate settling out
from the cement paste) before it sets. **Workability** is the property
that describes how easily fresh concrete can be mixed, placed,
compacted, and finished without segregating.

## What controls it

Water content is the single biggest lever — more water makes concrete
flow more easily, but past a certain point it also weakens the
hardened concrete and increases the risk of segregation and bleeding
(water rising to the surface). This is the core tension in mix design:
enough water to place the concrete properly, but no more than that.

Aggregate shape and grading matter too — well-graded, rounded aggregate
packs and flows more easily than angular, uniformly-sized aggregate
with the same water content (the same packing-efficiency idea from the
Soil Mechanics gradation lesson applies here, just for a different
material).

## How it's measured on site

The **slump test** is the standard field check — fast, needs almost no
equipment, and directly observable by anyone on site without lab
processing. It doesn't measure workability in an absolute engineering
sense (two mixes with the same slump can behave differently under
vibration), but it's an excellent quick consistency check: if today's
batch slumps very differently from yesterday's using the same mix
design, something changed — usually water content — and that's worth
investigating before placing the concrete.`,
        },
        {
          title: 'Virtual lab: slump test',
          contentType: 'lab',
          durationMin: 15,
          labKey: 'slump-test',
        },
      ],
    },
    {
      title: 'Hardened Concrete Strength',
      lessons: [
        {
          title: "Why the grade number is a strength, and what 'characteristic' means",
          contentType: 'reading',
          durationMin: 10,
          body: `# Why the grade number is a strength, and what 'characteristic' means

Workability describes concrete before it sets; once it hardens, the
property that actually gets designed against is compressive strength —
and this is what a concrete "grade" (M15, M20, M25...) is naming
directly. M20 means a 150mm cube of that mix is specified to reach a
**characteristic strength** of 20 MPa at 28 days.

## Why "characteristic" and not just "average"

Concrete strength varies between nominally identical cubes — same mix,
same curing, different result, because concrete is a composite
material made on site, not manufactured to the precision of rolled
steel. "Characteristic strength" accounts for this directly: it's
defined as the strength value below which no more than 5% of test
results are expected to fall, not the raw average. A mix has to be
designed with a **margin** above the characteristic strength so that,
given normal variability, the 5th-percentile result still clears the
specified grade.

## Why acceptance uses a margin, not a hard cutoff

This same variability is why codes don't reject concrete the instant
one cube result comes in under the target. ACI 318-19 §26.12.3.1's
acceptance criteria check two things together: the *average* of any 3
consecutive test results must meet or exceed f'c, and no *individual*
result may fall more than a set margin below it (3.5 MPa for grades up
to M35, 10% of f'c above that). A single low cube, on its own, isn't
automatically a failure — it's a flag to check against the margin and
the surrounding results, which is exactly what the individual-result
check in the next lab evaluates.

## Why the cube's cast face matters

The compression test always loads the cube on its cast side faces, not
the trowelled top — the top surface is never perfectly flat or dense
the way a moulded face is, and loading it directly would introduce a
stress concentration that has nothing to do with the concrete's actual
strength.

Run the lab next: it's set up to clear an M20 target cleanly, then try
lowering the load until the result crosses first into the acceptance
margin, then past it — the report explains what each zone actually
means for a real site decision.`,
        },
        {
          title: 'Virtual lab: compression test',
          contentType: 'lab',
          durationMin: 15,
          labKey: 'compression-test',
        },
      ],
    },
    {
      title: 'Flexural Strength',
      lessons: [
        {
          title: "Why bending strength needs its own test, and its own formula-per-fracture-location",
          contentType: 'reading',
          durationMin: 10,
          body: `# Why bending strength needs its own test, and its own formula-per-fracture-location

Compressive strength tells you how concrete handles a squeezing load —
but a slab-on-grade, a pavement, or a beam under its own tension zone
isn't always primarily in compression. Plain (unreinforced) concrete
is genuinely weak in tension compared to compression — roughly a tenth
the strength, which is the entire reason reinforcement exists in the
first place. Flexural strength (modulus of rupture) measures that
tension-side weakness directly, by bending a beam until it cracks
rather than crushing a cube.

## Why third-point loading, specifically

Loading the beam at two points (each a third of the span from a
support) rather than one point at midspan creates a region between the
two loads — the **middle third** of the span — where bending moment is
constant. Testing there means the beam is being pushed to its actual
material limit across a whole zone, not just at one point, which is
part of why the standard formula (R = PL/bd²) assumes the fracture
happens somewhere in that zone.

## Why the formula changes if it doesn't break there

If the beam instead fractures somewhat outside the middle third —
closer to one of the load points — the bending moment there is lower
than at the load point itself, so using the same formula would
understate the concrete's real strength. The standard's answer is a
second formula (R = 3Pa/bd²) that uses the actual distance from the
support to where the beam broke, rather than the full span. And if the
fracture happens far enough outside the middle third — more than 5% of
the span beyond it — neither formula is trusted anymore: something
about the specimen or the setup likely affected where it broke, and
the result gets discarded rather than force-fit into either formula.

This mirrors the same principle as the Compression Test's acceptance
margin and the Bitumen grade gaps: a real standard doesn't collapse a
messy physical reality into one clean formula everywhere — it defines
exactly where that formula applies, and says plainly when a result
falls outside where any formula can be trusted.

Run the lab next: the default fracture sits exactly at center (deep in
the middle third), giving a clean 3.8 MPa result — try dragging the
fracture point out past 97.5mm from center and watch the report switch
from a formula to an explicit "discard this test" explanation.`,
        },
        {
          title: 'Virtual lab: flexural test',
          contentType: 'lab',
          durationMin: 18,
          labKey: 'flexural-test',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Fully-written course: Highway Engineering (under Transportation Engineering)
// ---------------------------------------------------------------------------
const highwayEngineeringCourse: CourseSeed = {
  slug: 'highway-engineering',
  title: 'Highway Engineering',
  titleBn: 'হাইওয়ে ইঞ্জিনিয়ারিং',
  description: 'Geometric design and construction of highways.',
  published: true,
  modules: [
    {
      title: 'Aggregate Quality for Pavement',
      lessons: [
        {
          title: 'Why road aggregate is tested for impact, not just crushing',
          contentType: 'reading',
          durationMin: 9,
          body: `# Why road aggregate is tested for impact, not just crushing

A road surface doesn't just carry static weight — it takes repeated,
sudden impact from vehicle wheels, especially at higher speeds and on
rougher surfaces. An aggregate that resists a slow, gradually-applied
crushing load perfectly well can still break down under that kind of
sudden shock, which is why pavement aggregate gets a separate test for
impact resistance rather than relying on a crushing-strength number
alone.

## What the Aggregate Impact Value actually measures

The test applies a standard number of blows from a known height onto a
confined aggregate sample, then measures how much of it broke down
into fines (passing a 2.36mm sieve). The result is a percentage — and
counterintuitively, a **lower** percentage means a **tougher**
aggregate: less of the original sample was pulverized by the impact.

## Reading the result

By the common classification (BS 812):

- Below 10% — exceptionally strong, suitable even for heavy-duty
  surfaces under high impact
- 10–20% — strong, the typical range specified for road wearing
  surfaces
- 20–30% — satisfactory for sub-base or non-wearing-surface concrete,
  but not usually specified for the top wearing course
- Above 30% — generally too weak for pavement wearing surfaces

Run the lab next with the pre-filled data and you'll land right in the
"strong, suitable for wearing surfaces" range — a realistic result for
a competent road aggregate, not a contrived textbook-perfect number.`,
        },
        {
          title: 'Virtual lab: aggregate impact value test',
          contentType: 'lab',
          durationMin: 18,
          labKey: 'aggregate-impact-value',
        },
      ],
    },
    {
      title: 'Bitumen Grading',
      lessons: [
        {
          title: 'Why bitumen is graded by hardness, and why the grades have gaps',
          contentType: 'reading',
          durationMin: 9,
          body: `# Why bitumen is graded by hardness, and why the grades have gaps

Aggregate strength is only half of what a pavement needs — the
bitumen binding it together has to stay stiff enough not to rut under
traffic in hot weather, yet flexible enough not to crack in cold
weather. Both properties trace back to one underlying characteristic:
how hard or soft the bitumen is, which is exactly what the
**penetration test** measures.

## What the test actually measures

A standard needle, under a fixed 100g load, is allowed to sink into a
25°C bitumen sample for exactly 5 seconds. The depth it penetrates —
in units of 0.1mm — is the penetration value. Softer bitumen lets the
needle sink further, so a **higher** penetration number means
**softer** bitumen — the opposite direction from the Aggregate Impact
Value's "lower is tougher" convention, which is worth noting
explicitly since it's easy to carry the wrong intuition over from one
test to the other.

## Why standard grades are named as ranges, and have gaps between them

Bitumen is sold under grade names like 60/70 or 80/100 — the range
itself is the specification, not a single target value, because
penetration naturally varies somewhat batch to batch even for the same
intended product. What's less obvious: the standard grades **aren't
continuous**. There's a 30/40, a 40/50, then a jump straight to 60/70 —
no standard "50/60" grade exists. A result that lands at, say, 55 dmm
isn't a calculation problem; it genuinely falls between two named
commercial grades, which in practice is exactly the kind of result
that prompts a supplier conversation rather than a simple pass/fail.

## Choosing a grade for the job

In Bangladesh, 60/70 is the grade most commonly specified by the Roads
and Highways Department for general paving — a reasonable middle
ground for the climate. Harder grades (40/50) suit hotter conditions
or heavier, slower traffic where rutting resistance matters most;
softer grades (80/100) suit cooler conditions or where some
flexibility matters more than pure hardness.

Run the lab next — the default trial data lands cleanly in the 60/70
band, then try spreading the three trial readings further apart and
watch the repeatability check catch it before a grade is even
reported.`,
        },
        {
          title: 'Virtual lab: bitumen penetration test',
          contentType: 'lab',
          durationMin: 15,
          labKey: 'bitumen-penetration',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Fully-written course: Surveying (under Construction Engineering)
// ---------------------------------------------------------------------------
const surveyingCourse: CourseSeed = {
  slug: 'surveying',
  title: 'Surveying',
  titleBn: 'সার্ভেয়িং',
  description: 'Land measurement techniques and instruments.',
  published: true,
  modules: [
    {
      title: 'Differential Levelling',
      lessons: [
        {
          title: 'Reading a level and booking a field survey',
          contentType: 'reading',
          durationMin: 11,
          body: `# Reading a level and booking a field survey

A level instrument does one simple thing very precisely: it defines a
perfectly horizontal line of sight. Everything in differential
levelling follows from that one fact — every staff reading taken from
the same instrument setup is measured against the *same* horizontal
line, so comparing two readings tells you the difference in ground
elevation between those two points, regardless of how far apart they
are.

## The three kinds of reading

- **Back Sight (BS)** — the first reading taken from a new instrument
  position, on a point of known or already-established elevation
- **Intermediate Sight (IS)** — any additional readings taken from the
  same setup, on points you want elevations for but don't need to move
  the instrument to reach
- **Fore Sight (FS)** — the last reading from a setup, taken on a
  stable point (a "change point") that the instrument will then move
  to a new position to re-observe as the next Back Sight

## The rule that trips people up first

A **larger** staff reading means **lower** ground — because the
horizontal line of sight is fixed, a bigger number means more distance
between that fixed line and the ground below it. So when the reading
gets smaller from one point to the next, the ground is rising; when it
gets larger, the ground is falling. This is the opposite of what
"bigger number" intuitively suggests, and worth sitting with before
the lab, not during it.

## Why the arithmetic check exists

Booking a level survey is repetitive arithmetic done by hand (or now,
by the same logic in software) — exactly the kind of task where a
single transcription error can silently propagate through every
elevation after it. The check:

ΣBS − ΣFS = ΣRise − ΣFall = Last RL − First RL

verifies three independently-computed values against each other. If
they don't all agree, there's an arithmetic error somewhere in the
booking — not necessarily in the field readings themselves, but in how
they were processed. Run the lab next and you'll see this check pass
cleanly on the sample data; try changing one reading and watch it
catch the resulting mismatch.`,
        },
        {
          title: 'Virtual lab: differential levelling',
          contentType: 'lab',
          durationMin: 20,
          labKey: 'levelling',
        },
      ],
    },
    {
      title: 'Total Station Survey',
      lessons: [
        {
          title: 'One instrument, one reading, a full 3D position',
          contentType: 'reading',
          durationMin: 10,
          body: `# One instrument, one reading, a full 3D position

Differential Levelling measures elevation differences one setup at a
time, along a chain of points — it's precise, but it only gives
elevation, and only along the path the instrument physically follows.
A total station does something different: from one fixed setup, it
measures both the horizontal and vertical **angle** to a target and
the **distance** to it (via an electronic distance meter built into
the instrument), all in a single reading. That's enough information —
angle plus distance in two directions — to place the target's full 3D
position, not just its elevation.

## Splitting a slope distance into two useful numbers

The instrument measures the straight-line ("slope") distance to the
target, not the horizontal distance the plan coordinates actually
need. Multiplying by the cosine of the vertical angle converts slope
distance into horizontal distance; multiplying by the sine gives the
vertical component instead — the same right-triangle logic underlying
every trigonometric leveling calculation, just applied to a distance
that's measured directly rather than pieced together from staff
readings.

## Why instrument height and target height both matter

The instrument doesn't sit exactly on the station's marked point — it
sits at some height above it, on the tripod. The target doesn't sit
exactly on the ground point being surveyed either — the prism sits at
some height above it, on its pole. Both heights have to be added into
the vertical calculation, or every computed elevation would be off by
however much those two heights don't happen to cancel out.

## Radiation vs. traverse

This "single setup, multiple targets measured outward" pattern is
called the **radiation method** — genuinely different from what the
next module covers, where the instrument itself moves station to
station around a loop. Radiation is fast when many points are visible
from one spot; a traverse is what you need when they aren't.

Run the lab next: the default station and three target readings cover
a level sight, an uphill sight, and a downhill sight — enough to see
how the same formula handles all three without any special-casing.`,
        },
        {
          title: 'Virtual lab: total station survey',
          contentType: 'lab',
          durationMin: 18,
          labKey: 'total-station',
        },
      ],
    },
    {
      title: 'Traverse Survey',
      lessons: [
        {
          title: "Why a closed loop is its own accuracy check",
          contentType: 'reading',
          durationMin: 12,
          body: `# Why a closed loop is its own accuracy check

Total Station Survey measures many points outward from one fixed
setup; a traverse instead moves the instrument from station to
station around a loop, measuring the bearing and distance of each leg
as it goes — the method for covering ground too large or too obstructed
for every point to be visible from a single setup.

## What makes a traverse self-checking

Close the loop back to its own starting station, and something useful
falls out for free: if every bearing and distance were measured
perfectly, resolving each leg into its northing (latitude) and easting
(departure) components and summing them all the way around should
land exactly back on the starting coordinates — the sums should both
be exactly zero. They never quite are, because no field measurement is
perfect, and that small non-zero residual — the **misclosure** — is a
direct, built-in measure of how good the whole survey actually was.
No separate accuracy check is needed; the geometry itself provides one.

## Turning misclosure into a number worth reporting

Raw misclosure in meters isn't that meaningful on its own — a few
centimeters of error means very different things on a 50m traverse
versus a 5km one. Dividing the total traverse length by the misclosure
gives a **relative precision** (expressed as 1:N) that's actually
comparable across surveys of different sizes, and comparable against
standard thresholds — roughly 1:5,000 as a common minimum for ordinary
engineering work, 1:10,000 for precise control survey.

## What the Bowditch rule does — and doesn't — fix

Once the misclosure is known, the **Bowditch (compass) rule**
distributes it back across every leg in proportion to that leg's
length, producing adjusted coordinates that close exactly. It's
important to be clear about what this adjustment actually accomplishes:
it makes the numbers close, by construction, every time — it does
**not** turn a bad survey into a good one. The precision classification
computed *before* adjustment is what tells you whether the raw
measurements were trustworthy; the adjustment afterward just
distributes whatever error was already there.

Run the lab next: the default 5-sided loop closes to better than
1:10,000 — try widening one leg's distance by a meter or two and watch
the precision classification drop before the plotted loop even
visibly changes shape.`,
        },
        {
          title: 'Virtual lab: traverse survey',
          contentType: 'lab',
          durationMin: 22,
          labKey: 'traverse',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// The 8 subjects, each with its full course list from the blueprint.
// Only one course per subject (marked `full: true` in comments) carries
// the hand-written module set above; the rest get accurate structural
// seeding via `standardModules()`.
// ---------------------------------------------------------------------------

function standardModules(courseTitle: string): ModuleSeed[] {
  // A reasonable, subject-appropriate 3-module shape used for courses that
  // don't yet have hand-written content. Real modules/lessons replace this
  // per-course as content gets written — this just keeps the catalog
  // structurally real (queryable, navigable) rather than empty.
  return [
    {
      title: 'Foundations',
      lessons: [
        { title: `Introduction to ${courseTitle}`, contentType: 'reading', durationMin: 10 },
        { title: 'Key terms and definitions', contentType: 'reading', durationMin: 8 },
      ],
    },
    {
      title: 'Core Concepts',
      lessons: [
        { title: 'Worked examples', contentType: 'reading', durationMin: 15 },
        { title: 'Interactive visualization', contentType: 'interactive', durationMin: 10 },
      ],
    },
    {
      title: 'Applied Practice',
      lessons: [
        { title: 'Practice problems', contentType: 'reading', durationMin: 20 },
        { title: 'Case study', contentType: 'video', durationMin: 12 },
      ],
    },
  ];
}

function course(slug: string, title: string, titleBn: string, description: string): CourseSeed {
  return {
    slug,
    title,
    titleBn,
    description,
    published: false,
    modules: standardModules(title),
  };
}

const subjects: SubjectSeed[] = [
  {
    slug: 'mathematics',
    title: 'Mathematics',
    titleBn: 'গণিত',
    description: 'The mathematical toolkit every other subject on this platform depends on.',
    courses: [
      course('algebra', 'Algebra', 'বীজগণিত', 'Equations, inequalities, and functions used throughout engineering calculations.'),
      course('trigonometry', 'Trigonometry', 'ত্রিকোণমিতি', 'Angles, triangles, and periodic functions — essential for surveying and structural geometry.'),
      course('calculus', 'Calculus', 'ক্যালকুলাস', 'Differentiation and integration, the language of change and accumulation.'),
      course('differential-equation', 'Differential Equation', 'ডিফারেনশিয়াল ইকুয়েশন', 'Modeling systems that change continuously — beam deflection, fluid flow, vibration.'),
      course('matrix', 'Matrix', 'ম্যাট্রিক্স', 'Matrix algebra as used in structural analysis software (stiffness matrices, load vectors).'),
      course('numerical-methods', 'Numerical Methods', 'নিউমেরিক্যাল মেথডস', 'Approximation techniques for equations with no clean closed-form solution.'),
    ],
  },
  {
    slug: 'engineering-science',
    title: 'Engineering Science',
    titleBn: 'ইঞ্জিনিয়ারিং সায়েন্স',
    description: 'The physics, chemistry, and foundational technical literacy behind civil engineering practice.',
    courses: [
      course('engineering-physics', 'Engineering Physics', 'ইঞ্জিনিয়ারিং ফিজিক্স', 'Mechanics, energy, and materials behavior from a physics-first perspective.'),
      course('engineering-chemistry', 'Engineering Chemistry', 'ইঞ্জিনিয়ারিং কেমিস্ট্রি', 'Chemistry of cement hydration, corrosion, and material durability.'),
      course('basic-electrical-engineering', 'Basic Electrical Engineering', 'বেসিক ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং', 'Electrical fundamentals relevant to site power, lighting, and building services.'),
      course('computer-fundamentals', 'Computer Fundamentals', 'কম্পিউটার ফান্ডামেন্টালস', 'Computing literacy needed before tackling CAD, BIM, and analysis software.'),
    ],
  },
  {
    slug: 'basic-civil-engineering',
    title: 'Basic Civil Engineering',
    titleBn: 'বেসিক সিভিল ইঞ্জিনিয়ারিং',
    description: 'The first-year bridge between general engineering science and civil engineering practice.',
    courses: [
      course('engineering-mechanics', 'Engineering Mechanics', 'ইঞ্জিনিয়ারিং মেকানিক্স', 'Statics and dynamics of rigid bodies — the prerequisite for all structural analysis.'),
      course('engineering-drawing', 'Engineering Drawing', 'ইঞ্জিনিয়ারিং ড্রয়িং', 'Orthographic projection, sections, and dimensioning conventions used on construction drawings.'),
      buildingMaterialsCourse,
      course('construction-technology', 'Construction Technology', 'কনস্ট্রাকশন টেকনোলজি', 'Methods and sequencing behind how buildings actually get built.'),
    ],
  },
  {
    slug: 'structural-engineering',
    title: 'Structural Engineering',
    titleBn: 'স্ট্রাকচারাল ইঞ্জিনিয়ারিং',
    description: 'How structures carry load safely — from first principles through BNBC-compliant design.',
    courses: [
      course('strength-of-materials', 'Strength of Materials (SOM)', 'স্ট্রেংথ অফ মেটেরিয়ালস', 'Stress, strain, and how materials deform and fail under load.'),
      structuralAnalysisCourse,
      rccDesignCourse,
      course('steel-design', 'Steel Design', 'স্টিল ডিজাইন', 'Structural steel member and connection design.'),
      course('timber-design', 'Timber Design', 'টিম্বার ডিজাইন', 'Design principles for timber structural members.'),
      course('prestressed-concrete', 'Prestressed Concrete', 'প্রিস্ট্রেসড কংক্রিট', 'Pre-tensioning and post-tensioning concepts for long-span members.'),
      earthquakeEngineeringCourse,
      course('bridge-engineering', 'Bridge Engineering', 'ব্রিজ ইঞ্জিনিয়ারিং', 'Bridge types, loading, and design considerations.'),
    ],
  },
  {
    slug: 'geotechnical-engineering',
    title: 'Geotechnical Engineering',
    titleBn: 'জিওটেকনিক্যাল ইঞ্জিনিয়ারিং',
    description: 'The ground beneath every structure — how soil behaves and how to build on it safely.',
    courses: [
      soilMechanicsCourse,
      course('foundation-engineering', 'Foundation Engineering', 'ফাউন্ডেশন ইঞ্জিনিয়ারিং', 'Shallow and deep foundation design — the bridge to the Foundation Systems tools.'),
      course('rock-mechanics', 'Rock Mechanics', 'রক মেকানিক্স', 'Behavior of rock masses in engineering applications.'),
      course('ground-improvement', 'Ground Improvement', 'গ্রাউন্ড ইম্প্রুভমেন্ট', 'Techniques for improving weak or problematic soils before construction.'),
    ],
  },
  {
    slug: 'water-environmental-engineering',
    title: 'Water & Environmental Engineering',
    titleBn: 'ওয়াটার অ্যান্ড এনভায়রনমেন্টাল ইঞ্জিনিয়ারিং',
    description: 'Fluid behavior, water systems, and environmental protection in the built environment.',
    courses: [
      fluidMechanicsCourse,
      course('hydraulics', 'Hydraulics', 'হাইড্রলিক্স', 'Applied fluid mechanics for pipe flow, open channels, and hydraulic structures.'),
      course('irrigation-engineering', 'Irrigation Engineering', 'ইরিগেশন ইঞ্জিনিয়ারিং', 'Water distribution systems for agriculture.'),
      course('water-supply', 'Water Supply', 'ওয়াটার সাপ্লাই', 'Design of potable water supply systems.'),
      course('environmental-engineering', 'Environmental Engineering', 'এনভায়রনমেন্টাল ইঞ্জিনিয়ারিং', 'Pollution control and environmental impact in construction.'),
      course('sanitary-engineering', 'Sanitary Engineering', 'স্যানিটারি ইঞ্জিনিয়ারিং', 'Wastewater collection and treatment systems.'),
    ],
  },
  {
    slug: 'transportation-engineering',
    title: 'Transportation Engineering',
    titleBn: 'ট্রান্সপোর্টেশন ইঞ্জিনিয়ারিং',
    description: 'Roads, railways, and airports — how people and goods move through built infrastructure.',
    courses: [
      highwayEngineeringCourse,
      course('traffic-engineering', 'Traffic Engineering', 'ট্রাফিক ইঞ্জিনিয়ারিং', 'Traffic flow analysis and control systems.'),
      course('pavement-design', 'Pavement Design', 'পেভমেন্ট ডিজাইন', 'Flexible and rigid pavement design methods.'),
      course('railway-engineering', 'Railway Engineering', 'রেলওয়ে ইঞ্জিনিয়ারিং', 'Track geometry and railway infrastructure design.'),
      course('airport-engineering', 'Airport Engineering', 'এয়ারপোর্ট ইঞ্জিনিয়ারিং', 'Runway and airport facility design considerations.'),
    ],
  },
  {
    slug: 'construction-engineering',
    title: 'Construction Engineering',
    titleBn: 'কনস্ট্রাকশন ইঞ্জিনিয়ারিং',
    description: 'Managing the construction process itself — planning, measurement, safety, and quality.',
    courses: [
      course('construction-management', 'Construction Management', 'কনস্ট্রাকশন ম্যানেজমেন্ট', 'Planning, scheduling, and resource management for construction projects.'),
      course('estimation-basics', 'Estimation Basics', 'এস্টিমেশন বেসিক্স', 'Quantity takeoff and cost estimation fundamentals — the bridge to CivilCost.'),
      surveyingCourse,
      course('safety-engineering', 'Safety Engineering', 'সেফটি ইঞ্জিনিয়ারিং', 'Construction site safety systems and risk management.'),
      course('quality-control', 'Quality Control', 'কোয়ালিটি কন্ট্রোল', 'Quality assurance systems for construction materials and workmanship.'),
    ],
  },
];

async function main() {
  console.log('Seeding subjects and courses...');

  for (let sIdx = 0; sIdx < subjects.length; sIdx++) {
    const s = subjects[sIdx];

    const subject = await prisma.subject.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        titleBn: s.titleBn,
        description: s.description,
        order: sIdx,
      },
      create: {
        slug: s.slug,
        title: s.title,
        titleBn: s.titleBn,
        description: s.description,
        order: sIdx,
      },
    });

    console.log(`  Subject: ${s.title} (${s.courses.length} courses)`);

    for (let cIdx = 0; cIdx < s.courses.length; cIdx++) {
      const c = s.courses[cIdx];

      const createdCourse = await prisma.course.upsert({
        where: { slug: c.slug },
        update: {
          subjectId: subject.id,
          title: c.title,
          titleBn: c.titleBn,
          description: c.description,
          published: c.published,
          order: cIdx,
        },
        create: {
          slug: c.slug,
          subjectId: subject.id,
          title: c.title,
          titleBn: c.titleBn,
          description: c.description,
          published: c.published,
          order: cIdx,
        },
      });

      // Clear existing modules/lessons for this course before reseeding,
      // so re-running the seed doesn't duplicate rows.
      await prisma.module.deleteMany({ where: { courseId: createdCourse.id } });

      for (let mIdx = 0; mIdx < c.modules.length; mIdx++) {
        const m = c.modules[mIdx];

        const createdModule = await prisma.module.create({
          data: {
            courseId: createdCourse.id,
            title: m.title,
            titleBn: m.titleBn,
            order: mIdx,
          },
        });

        for (let lIdx = 0; lIdx < m.lessons.length; lIdx++) {
          const l = m.lessons[lIdx];

          await prisma.lesson.create({
            data: {
              moduleId: createdModule.id,
              title: l.title,
              titleBn: l.titleBn,
              contentType: l.contentType,
              durationMin: l.durationMin ?? 10,
              body: l.body ?? null,
              interactiveKey: l.interactiveKey ?? null,
              labKey: l.labKey ?? null,
              order: lIdx,
            },
          });
        }
      }
    }
  }

  const subjectCount = await prisma.subject.count();
  const courseCount = await prisma.course.count();
  const moduleCount = await prisma.module.count();
  const lessonCount = await prisma.lesson.count();

  // ---------------------------------------------------------------------
  // Practice & Exam System (Part 14) — a starting set of two quizzes, not
  // comprehensive coverage across every subject (same "structure now,
  // content later" honesty as the rest of this seed file). Every
  // numerical answer here is a value already independently verified
  // elsewhere in this platform's build (the Beam, Soil Bearing, and
  // Steel Weight tools) — reused, not re-derived from scratch, so a
  // quiz answer can never quietly drift from the tool that taught the
  // same number.
  // ---------------------------------------------------------------------

  type QuizSeed = {
    title: string;
    category: string;
    timedSeconds: number | null;
    questions: {
      type: 'mcq' | 'numerical' | 'cq';
      prompt: string;
      choices?: { id: string; text: string }[];
      answer: Record<string, unknown>;
    }[];
  };

  const QUIZZES: QuizSeed[] = [
    {
      title: 'Structural Analysis Fundamentals',
      category: 'Structural Engineering',
      timedSeconds: 600,
      questions: [
        {
          type: 'mcq',
          prompt:
            'For a simply-supported beam under a uniformly distributed load, the maximum bending moment occurs:',
          choices: [
            { id: 'a', text: 'At the supports' },
            { id: 'b', text: 'At mid-span' },
            { id: 'c', text: 'At the quarter points' },
            { id: 'd', text: 'Nowhere in particular — it is constant along the span' },
          ],
          answer: { kind: 'mcq', correctChoiceIds: ['b'] },
        },
        {
          type: 'mcq',
          prompt: 'A short reinforced concrete column fails primarily by:',
          choices: [
            { id: 'a', text: 'Elastic (Euler) buckling' },
            { id: 'b', text: 'Material crushing' },
            { id: 'c', text: 'Fatigue' },
            { id: 'd', text: 'Creep' },
          ],
          answer: { kind: 'mcq', correctChoiceIds: ['b'] },
        },
        {
          type: 'numerical',
          prompt:
            'A simply-supported beam spans 6m and carries a uniformly distributed load of 10 kN/m. What is the maximum bending moment?',
          answer: { kind: 'numerical', value: 45.0, tolerancePercent: 2.0, unit: 'kN·m' },
        },
        {
          type: 'numerical',
          prompt: 'For that same beam, what is the maximum shear force?',
          answer: { kind: 'numerical', value: 30.0, tolerancePercent: 2.0, unit: 'kN' },
        },
        {
          type: 'cq',
          prompt:
            'Explain why reinforced concrete beams need both longitudinal bars and stirrups — why not longitudinal bars alone?',
          answer: {
            kind: 'cq',
            modelAnswer:
              'Longitudinal bars resist the tension a beam develops on its stretched face under bending — plain concrete is weak in tension, so steel carries that load instead. But bending isn\'t the only thing a beam resists: shear force produces diagonal tension cracks running at roughly 45° near the supports, and longitudinal bars (running along the beam\'s length) can\'t cross those diagonal cracks effectively. Stirrups, wrapped transversely around the section, cross those diagonal cracks directly and resist the shear-induced diagonal tension. Stirrups also hold the longitudinal bars in their correct position during casting and provide some confinement to the concrete core.',
          },
        },
      ],
    },
    {
      title: 'Geotechnical & Materials Basics',
      category: 'Geotechnical Engineering',
      timedSeconds: 480,
      questions: [
        {
          type: 'mcq',
          prompt: "Terzaghi's bearing capacity factor Nγ is typically obtained from:",
          choices: [
            { id: 'a', text: 'A closed-form formula, exactly like Nc and Nq' },
            { id: 'b', text: 'Tabulated values, since it has no clean closed form' },
            { id: 'c', text: 'It is always zero for any soil' },
            { id: 'd', text: 'Direct field measurement only, never a calculation' },
          ],
          answer: { kind: 'mcq', correctChoiceIds: ['b'] },
        },
        {
          type: 'mcq',
          prompt: "A soil's Plasticity Index (PI) is defined as:",
          choices: [
            { id: 'a', text: 'Liquid Limit + Plastic Limit' },
            { id: 'b', text: 'Liquid Limit − Plastic Limit' },
            { id: 'c', text: 'Liquid Limit ÷ Plastic Limit' },
            { id: 'd', text: 'Plastic Limit − Liquid Limit' },
          ],
          answer: { kind: 'mcq', correctChoiceIds: ['b'] },
        },
        {
          type: 'numerical',
          prompt:
            'A strip footing has cohesion c=0 kPa, friction angle φ=30°, soil unit weight γ=18 kN/m³, footing depth Df=1.5m, and width B=2.0m. Using Terzaghi\'s equation with Nc=37.2, Nq=22.5, Nγ=19.7, what is the ultimate bearing capacity qu?',
          answer: { kind: 'numerical', value: 962.1, tolerancePercent: 2.0, unit: 'kPa' },
        },
        {
          type: 'numerical',
          prompt: 'A 16mm diameter mild steel reinforcement bar has a unit weight of approximately how many kg per meter?',
          answer: { kind: 'numerical', value: 1.58, tolerancePercent: 3.0, unit: 'kg/m' },
        },
        {
          type: 'cq',
          prompt:
            "Explain why a soil's Optimum Moisture Content (OMC) exists — why doesn't compaction just keep improving as more water is added?",
          answer: {
            kind: 'cq',
            modelAnswer:
              "A little water lubricates soil particles, letting them slide past each other into a denser arrangement under the same compactive effort — so dry density rises as moisture increases, at first. Past a certain point, though, additional water starts filling void space that soil particles could otherwise have occupied, so dry density starts falling again even though more water keeps being added. That rise-then-fall is why there's a genuine peak — the Optimum Moisture Content — rather than a 'more water is always better' relationship, and it's also why no real compacted sample can exceed the theoretical zero-air-voids density at any given moisture content.",
          },
        },
      ],
    },
  ];

  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});

  for (const q of QUIZZES) {
    const createdQuiz = await prisma.quiz.create({
      data: { title: q.title, category: q.category, timedSeconds: q.timedSeconds },
    });
    for (const question of q.questions) {
      await prisma.question.create({
        data: {
          quizId: createdQuiz.id,
          type: question.type,
          prompt: question.prompt,
          choices: question.choices ?? undefined,
          answer: question.answer,
        },
      });
    }
  }

  const quizCount = await prisma.quiz.count();
  const questionCount = await prisma.question.count();

  console.log(
    `Done. ${subjectCount} subjects, ${courseCount} courses, ${moduleCount} modules, ${lessonCount} lessons, ${quizCount} quizzes, ${questionCount} questions.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
