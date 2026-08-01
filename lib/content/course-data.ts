/**
 * All course/subject content, hardcoded — no database. This file is the
 * single source of truth for every subject, course, module, and lesson
 * in EngineX Learn. It was originally written as Prisma seed data; the
 * course/lesson content itself (titles, descriptions, lesson bodies) is
 * unchanged from that version — only the loading mechanism changed, from
 * "write these rows to Postgres" to "import this array directly".
 *
 * `lib/content/index.ts` hydrates this raw data with stable ids (derived
 * from slugs/titles, not random) and resolves every course into its
 * subject — that's the shape every page actually imports from. This file
 * only exports the raw `subjects` array and its types.
 */

export type LessonSeed = {
  title: string;
  titleBn?: string;
  contentType: 'reading' | 'video' | 'interactive' | 'lab';
  durationMin?: number;
  body?: string;
  interactiveKey?: string; // registry key — see components/visualizations/registry.tsx
  labKey?: string; // registry key — see components/labs/registry.tsx
};

export type ModuleSeed = {
  title: string;
  titleBn?: string;
  lessons: LessonSeed[];
};

export type CourseSeed = {
  slug: string;
  title: string;
  titleBn?: string;
  description: string;
  published: boolean;
  modules: ModuleSeed[];
};

export type SubjectSeed = {
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
the EngineX Learn home page.`,
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

// ---------------------------------------------------------------------------
// Software Learning Center (blueprint Part 8) — all 11 courses hand-written,
// none using the standardModules() stub. Deliberately teaches *usage*
// only (workflow, commands, when to reach for a feature), never claims
// exact menu paths or button positions — those change between software
// versions and would go stale or wrong; the workflow concepts don't.
// No screenshots of the real software are used anywhere (none exist in
// this build), so every lesson is text/diagram-describable content only.
// ---------------------------------------------------------------------------

function autocadCourse(): CourseSeed {
  return {
    slug: 'autocad',
    title: 'AutoCAD',
    titleBn: 'অটোক্যাড',
    description: '2D drafting fundamentals for construction drawings — the industry-standard starting point for CAD.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What AutoCAD is for',
            contentType: 'reading',
            durationMin: 8,
            body: `# What AutoCAD is for

AutoCAD is 2D (and basic 3D) drafting software — the tool most
construction drawings in Bangladesh are still produced in, from
architectural plans to structural detail sheets. Unlike a BIM tool
(Revit), AutoCAD doesn't know that a line represents a wall; it just
draws the line. That makes it fast and flexible for pure drafting, but
it means the drawing carries no building data of its own — quantities,
schedules, and clash checks all have to be done separately.

## When to reach for it

- Producing final construction drawing sheets (plans, sections, details)
- Working from someone else's DWG file — it's the universal exchange format
- Quick detail sketches that don't need full 3D coordination

## The core idea: model space vs paper space

Every AutoCAD drawing has two spaces. **Model space** is where you draw
the actual building at real-world scale (1 unit = 1 mm, or whatever
your template uses). **Paper space** (layouts) is where you arrange
one or more views of the model onto a printable sheet, each at its own
scale, with a title block. Confusing the two — drawing a detail at
paper scale directly in model space — is the single most common
beginner mistake and it breaks dimensioning later.

## Layers, not colors

Professional drawings organize everything by **layer** (walls, doors,
dimensions, text, grid lines — each its own layer), not by manually
picked colors. A layer carries a default color, linetype, and
lineweight, and can be turned off or frozen independently. Get the
layer structure right at the start of a project; retrofitting it into
a messy drawing later is much slower than doing it upfront.`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Drawing and modifying: the command-first mindset',
            contentType: 'reading',
            durationMin: 12,
            body: `# Drawing and modifying: the command-first mindset

AutoCAD is built around **commands**, typed or picked, each with its
own short sequence of prompts. Once the pattern clicks, most of the
software follows it.

## Draw commands, at a glance

- **LINE** — straight segments, point to point
- **PLINE** (polyline) — a single connected object made of many
  segments, useful for anything you'll want to select as one piece
  (a room outline, a footpath)
- **CIRCLE**, **ARC** — geometric primitives
- **OFFSET** — the fastest way to draw a parallel line at a fixed
  distance (a wall's second face, a road's shoulder line)
- **TRIM** / **EXTEND** — cut back or stretch objects to meet another
  object exactly, instead of redrawing

## Modify commands that save the most time

- **COPY** / **MOVE** — self-explanatory, but both respect object
  snaps (see below), so they're precise, not eyeballed
- **ARRAY** — repeats an object in a rectangular grid, a circular
  pattern, or along a path (rebar spacing, column grids, stair treads)
- **MIRROR** — for symmetric layouts, draw half and mirror it
- **FILLET** / **CHAMFER** — rounds or angles a corner between two
  objects to an exact radius or distance

## Object snaps: the reason CAD drawings are precise

Object snaps (running OSNAP) let the cursor lock onto exact
geometric points — endpoint, midpoint, center, intersection —
instead of wherever the mouse happens to be. A drawing built without
snaps enabled looks fine zoomed out and is subtly wrong up close.
Keep endpoint, midpoint, and intersection on by default; add others
as a specific drawing needs them.

## Dimensioning

Dimensions in AutoCAD are **associative** — attached to the geometry
they measure, not just text sitting near it. If the geometry moves,
an associative dimension updates automatically. This is why dimensions
should always be added after the geometry is finalized in model
space, then arranged for readability in the layout (paper space).`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: draw a simple room plan

**Task:** In a new AutoCAD drawing, draw the floor plan of a single
10 ft × 12 ft room with:

1. Four walls, 5-inch thick, drawn on a "Walls" layer
2. One door opening (3 ft wide) on any wall, on a "Doors" layer
3. One window opening (4 ft wide) on another wall, on a "Windows" layer
4. Overall dimensions on a "Dimensions" layer, added after the walls
   are finalized
5. A layout (paper space) sheet showing the plan at 1:50 scale with a
   simple title block

**What this exercises:** OFFSET for wall thickness, TRIM to clean up
corners and openings, layer discipline, and the model-space/paper-space
split covered in the first lesson. If the dimensions look wrong on the
printed sheet but right in model space, the scale factor on the
layout viewport is the first thing to check — a very common real
mistake, not just a beginner one.`,
          },
        ],
      },
    ],
  };
}

function revitCourse(): CourseSeed {
  return {
    slug: 'revit',
    title: 'Revit',
    titleBn: 'রেভিট',
    description: 'Building Information Modeling — designing with real building elements instead of just lines.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What Revit is for, and how it differs from AutoCAD',
            contentType: 'reading',
            durationMin: 10,
            body: `# What Revit is for, and how it differs from AutoCAD

Revit is a **BIM** (Building Information Modeling) tool. Where
AutoCAD draws a line that means whatever you intend it to mean, Revit
places a real **wall**, **door**, or **column** object that knows its
own material, thickness, height, and — critically — its relationships
to everything else in the model. Move a wall in Revit and the doors
hosted in it move too; the floor plan, section, and 3D view all update
from the same underlying model, because they're different views of
one thing, not separate drawings.

## Why this matters for a civil/structural user specifically

Revit is usually associated with architecture, but the structural
discipline works the same way: columns, beams, foundations, and
floor slabs are modeled as real structural elements with real
sizes and materials, not drawn shapes. This is what makes automatic
quantity takeoff, clash detection between structural and MEP systems,
and coordinated drawing sets possible — all outputs of one shared
model.

## Core concepts before touching a single tool

- **Family** — every building component (a specific door type, a
  column size) is a "family" — a reusable, parametric definition you
  place instances of
- **Levels** — horizontal reference planes (Ground Floor, 1st Floor,
  Roof) that most elements are hosted to; get levels right first,
  everything else references them
- **Views**, not separate drawings — a floor plan, a section, and a
  3D view of the same level are three views into the same model,
  always in sync
- **Worksets** — how multiple people edit the same model at once on
  a team project (not usually relevant solo, but important to know
  exists)`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Modeling workflow: levels, grids, then elements',
            contentType: 'reading',
            durationMin: 14,
            body: `# Modeling workflow: levels, grids, then elements

Revit models are built in a fairly consistent order, and skipping
ahead usually causes rework later.

## 1. Levels first

Set up levels for every floor and key reference height (Ground Floor,
1st Floor, ..., Roof, Parapet) before placing anything. Every element
you place afterward references a level as its base — get this
structure wrong and every element built on it needs correcting too.

## 2. Grids next

Structural (and often architectural) grids — the lettered/numbered
column reference lines — get placed next, usually copied from a
linked architectural or structural CAD import if one exists, or laid
out to the structural spacing.

## 3. Structural elements, hosted to levels and grids

Columns get placed at grid intersections, hosted between two levels
(e.g., Ground Floor to 1st Floor). Beams span between columns.
Foundations sit below Ground Floor. Floor slabs are drawn as sketched
boundaries and hosted to a level. Every one of these is a real family
instance with a real size and material — not a drawn shape — which is
what later makes an accurate quantity schedule possible with no
manual re-counting.

## 4. Schedules — reading the model as data

A **schedule** in Revit is a table generated directly from the model:
list every column with its size and concrete grade, every door with
its width, height, and count. Because it's generated from the actual
model elements, a schedule is always accurate to whatever is currently
modeled — edit the model, the schedule updates. This is the practical
payoff of modeling with real elements instead of drawing lines: the
Bill of Quantities work that would otherwise be manual counting
becomes close to automatic.

## 5. Sheets for output

Once views exist (plans, sections, 3D, schedules), they get placed
onto **sheets** — Revit's equivalent of AutoCAD's paper space layouts
— for printing or PDF export as a coordinated drawing set.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: a simple single-story frame

**Task:** In a new Revit structural template:

1. Create 2 levels: Ground Floor (0 m) and 1st Floor (3.5 m)
2. Lay out a simple 3×3 grid of structural grids at 4 m spacing in
   both directions (a 3-bay × 3-bay layout)
3. Place columns at every grid intersection, hosted from Ground Floor
   to 1st Floor
4. Place beams connecting the columns along every grid line at the
   1st Floor level
5. Generate a column schedule showing count and size

**What this exercises:** the levels → grids → elements sequence from
the lesson above, and seeing a schedule populate automatically from
placed elements rather than being typed in by hand. If the schedule
shows the wrong column count, check for columns accidentally placed
off-grid — a very common source of quantity errors in real models,
not just practice ones.`,
          },
        ],
      },
    ],
  };
}

function civil3dCourse(): CourseSeed {
  return {
    slug: 'civil-3d',
    title: 'Civil 3D',
    titleBn: 'সিভিল থ্রিডি',
    description: 'Terrain, roads, and site grading — BIM for civil infrastructure rather than buildings.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What Civil 3D is for',
            contentType: 'reading',
            durationMin: 9,
            body: `# What Civil 3D is for

Civil 3D is Autodesk's BIM tool for **infrastructure** rather than
buildings — roads, site grading, drainage networks, and land
development. Where Revit models walls and columns, Civil 3D models
**surfaces** (terrain), **alignments** (road/pipe centerlines), and
**corridors** (the 3D road/channel model built along an alignment).

## The central object: the surface

Almost everything in Civil 3D starts from a **surface** — a
triangulated model of the ground built from survey points, contours,
or an imported point cloud. Once a surface exists, Civil 3D can derive
contours, slope analysis, and — most usefully — cut/fill volumes
automatically by comparing an existing-ground surface to a
proposed-design surface.

## Alignments and profiles

An **alignment** is the horizontal path of a road or pipe — its
centerline in plan. A **profile** is that same path's vertical
path — its elevation along the length. Design an alignment first,
then design a profile along it (matching existing ground where
needed, meeting minimum/maximum grade rules elsewhere), and the two
together fully define a road's geometry in 3D.

## When to reach for it over plain AutoCAD

Any project involving earthwork volumes, road design, or drainage
design benefits from Civil 3D's dynamic surfaces and corridors — plain
AutoCAD can draw contour lines but can't calculate a cut/fill volume
or automatically update a road cross-section when the alignment
changes.`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'From points to corridor: the road design sequence',
            contentType: 'reading',
            durationMin: 13,
            body: `# From points to corridor: the road design sequence

## 1. Existing ground surface

Import survey points (or a point cloud) and build a TIN (triangulated
irregular network) surface — this is "existing ground." Every
subsequent design decision gets checked against it.

## 2. Alignment

Draw the road's horizontal centerline as an alignment, respecting
minimum curve radius for the design speed. Civil 3D flags
non-compliant curves automatically once design criteria are set.

## 3. Profile

Draw the vertical profile along that alignment — the design surface
of the road at every station — respecting maximum grade and minimum
vertical curve length rules, again checked automatically against the
criteria you set.

## 4. Assembly and corridor

An **assembly** is a cross-section template — lanes, shoulders,
slopes, curb — built once. A **corridor** sweeps that assembly along
the alignment and profile, generating the full 3D road model in one
operation. Change the alignment or profile afterward, and the corridor
updates automatically — this dynamic link is the entire point of
using Civil 3D over drawing static cross-sections by hand.

## 5. Volumes, from two surfaces

With existing-ground and corridor (proposed) surfaces both present,
a volume surface comparing the two gives cut and fill quantities
directly — no manual cross-section area calculation needed, which is
the traditional hand-calculation method this replaces.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: a short road corridor

**Task:** In a new Civil 3D drawing:

1. Import a sample point file (or use Civil 3D's sample data) and
   build an existing-ground surface
2. Draw a 200 m straight alignment across the site
3. Draw a profile along it that roughly follows existing ground with
   a constant grade
4. Build a simple 2-lane road assembly (two 3.5 m lanes, 2% crown,
   1.5 m shoulders each side)
5. Create a corridor from the alignment, profile, and assembly
6. Generate a volume surface and read off the total cut and fill

**What this exercises:** the full points → surface → alignment →
profile → assembly → corridor → volume sequence in one pass. If the
corridor looks twisted or the volumes look absurd, the profile not
matching the alignment's stationing is the most common cause.`,
          },
        ],
      },
    ],
  };
}

function sketchupCourse(): CourseSeed {
  return {
    slug: 'sketchup',
    title: 'SketchUp',
    titleBn: 'স্কেচআপ',
    description: 'Fast, intuitive 3D massing and visualization — the quickest way to communicate a design idea in 3D.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What SketchUp is for',
            contentType: 'reading',
            durationMin: 7,
            body: `# What SketchUp is for

SketchUp is a fast, direct-modeling 3D tool — you push, pull, and
draw shapes in 3D space almost as quickly as sketching on paper, with
none of the parametric setup Revit needs (levels, families, hosting
rules) or the survey-driven setup Civil 3D needs. That makes it the
right tool for early massing studies, quick client-facing
visualizations, and site/context models — and the wrong tool for
anything needing accurate quantity takeoff or construction
documentation, since a SketchUp model is just 3D geometry, not
building data.

## The core interaction: push/pull

Draw any flat 2D shape (a rectangle, a polygon) on a plane, then
**push/pull** it to extrude it into a 3D solid. Nearly all basic
massing in SketchUp comes down to variations on this one interaction
— draw a footprint, push it up into a building mass; draw a window
shape on a wall face, push it in to create a recess or push it through
to create an opening.

## Groups and components

Ungrouped geometry in SketchUp is "sticky" — touching one shape can
accidentally merge or cut into another. **Groups** isolate a piece of
geometry so it behaves as one object. **Components** go further:
every copy of the same component stays identical — edit one instance
of a component and every other instance updates too, which is exactly
what you want for repeated elements like windows or columns across a
facade.`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Building a simple massing model',
            contentType: 'reading',
            durationMin: 11,
            body: `# Building a simple massing model

## 1. Start from a footprint

Draw the building footprint as a closed 2D shape on the ground plane
— either traced over an imported site plan/image, or drawn directly
from known dimensions.

## 2. Push/pull to height

Select the footprint face and push/pull it up to the building's
height. For a multi-story massing study, it's often faster to extrude
one story height, then copy that story upward the right number of
times, than to model every floor individually from scratch.

## 3. Cut openings as components

Model a single window as a component once, then copy it (as
component instances) across the facade. If the window design changes
later, editing the one component updates every copy simultaneously —
this is the single biggest time-saver in SketchUp massing work.

## 4. Materials and shadows for communication

SketchUp's strength is quick visual communication, not photorealism.
Applying simple materials (glass, concrete, brick textures) and using
the built-in shadow study (set date/time/location) to check sun
exposure on facades is usually enough for early design communication
— save photorealistic rendering for a dedicated rendering workflow if
the project needs it.

## 5. Sections for quick coordination

A **section plane** cuts through the model live — drag it through a
building and see the internal layout instantly, without building
separate 2D section drawings. Useful for a fast internal design check
before committing to detailed documentation in another tool.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 12,
            body: `# Practice assignment: a 3-story massing study

**Task:** In a new SketchUp model:

1. Draw a 15 m × 10 m rectangular footprint
2. Push/pull it up to one story height (3.2 m), then copy it upward
   twice more for a 3-story mass (9.6 m total)
3. Model one window as a component and place at least 6 instances
   across one facade
4. Edit the original window component's size and confirm every
   instance updates
5. Add a section plane and check the internal massing at mid-height

**What this exercises:** push/pull as the core modeling interaction,
components for repeated elements, and the section-plane workflow for
a quick internal check — the three habits that make SketchUp fast for
early-stage design.`,
          },
        ],
      },
    ],
  };
}

function etabsCourse(): CourseSeed {
  return {
    slug: 'etabs',
    title: 'ETABS',
    titleBn: 'ইটেবস',
    description: 'Building-specific structural analysis and design — the standard tool for multi-story RCC and steel buildings.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What ETABS is for',
            contentType: 'reading',
            durationMin: 9,
            body: `# What ETABS is for

ETABS is structural analysis and design software purpose-built for
**buildings** — it understands stories, diaphragms, and the
grid-and-level organization real buildings have, unlike general-purpose
finite-element software that treats everything as generic elements
with no building-specific assumptions. That specialization is why it's
the standard tool for multi-story RCC and steel building design across
the industry, including in Bangladesh under BNBC.

## The model, conceptually

An ETABS model is built from:

- **Grids** — the column/beam reference lines, same idea as a Revit
  or Civil 3D grid
- **Stories** — each floor level, with its own height; stories can
  be marked "similar to" another story to save modeling repeated
  floors from scratch
- **Frame elements** — beams and columns, assigned a section (size)
  and material
- **Area elements** — slabs and walls, assigned a thickness and
  material, and a behavior (rigid diaphragm vs membrane, shell vs
  membrane for walls)
- **Loads** — dead, live, wind, seismic — assigned as patterns, then
  combined into load combinations per the design code (BNBC 2020
  here)

## Why analysis and design are two separate steps

ETABS first runs a **structural analysis** — given the model geometry,
sections, and loads, it solves for forces, moments, and deflections
throughout the structure. Only afterward does it run **design** —
checking (or, for RCC, sizing) each member against the forces the
analysis found, per the selected design code. Getting analysis right
first matters more than getting the design code settings right,
because design is only ever as good as the forces it's checking
against.`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Model → analyze → design: the ETABS sequence',
            contentType: 'reading',
            durationMin: 14,
            body: `# Model → analyze → design: the ETABS sequence

## 1. Grid and story setup

Define the structural grid spacing and story heights first — matching
the architectural drawings. Mark repeated typical floors as "similar
to" the story above/below to avoid re-modeling every floor
individually.

## 2. Draw and assign

Draw columns, beams, and slabs on the grid at each story, then assign
each a section size and material. Getting section sizes roughly right
from the start (from experience or a quick hand-check) saves several
analysis-design iteration cycles later.

## 3. Loads and load patterns

Assign dead load (self-weight is automatic; superimposed dead load —
finishes, partitions — is added manually), live load (per BNBC
occupancy category), and lateral loads (wind, seismic, generated from
building geometry and code parameters, not usually hand-input load by
load).

## 4. Load combinations

Combine load patterns per the design code's factored combinations
(e.g., 1.2DL + 1.6LL). ETABS can auto-generate the standard
combinations for a selected code rather than requiring every
combination typed manually.

## 5. Run analysis, then check results before design

Run the analysis and check: does the deflected shape look reasonable?
Are reaction totals close to the expected total building weight? A
model with an error (a disconnected beam, a wrongly-assigned release)
often still "runs" but gives implausible results — always sanity-check
before trusting the design step.

## 6. Design

Run the RCC or steel design module, which sizes reinforcement (for
RCC) or checks member adequacy (for steel) against the analysis
results, per the selected code. Review flagged overstressed members
and iterate — adjust section or add reinforcement — rather than
accepting the first design pass automatically.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: a simple 3-story building model

**Task:** In a new ETABS model:

1. Set up a 3×3 grid at 5 m spacing in both directions, 3 stories at
   3.2 m each
2. Assign columns at every grid intersection and beams along every
   grid line at each floor
3. Add slabs at each floor, 125 mm thick
4. Assign dead load (superimposed, e.g. 1.5 kN/m² for finishes) and
   live load (e.g. 2 kN/m² for residential) to all slabs
5. Generate standard BNBC load combinations and run the analysis
6. Check the maximum column axial force at the base and confirm it's
   roughly consistent with a hand-estimate of total building weight
   ÷ number of ground-floor columns

**What this exercises:** the full grid → elements → loads →
combinations → analysis sequence, and the sanity-check habit from the
lesson above — a wildly different hand-estimate versus ETABS result
usually means a modeling error, not a hand-calculation error.`,
          },
        ],
      },
    ],
  };
}

function safeCourse(): CourseSeed {
  return {
    slug: 'safe',
    title: 'SAFE',
    titleBn: 'সেইফ',
    description: 'Slab and foundation analysis and design — ETABS\'s companion tool for what it doesn\'t specialize in.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What SAFE is for',
            contentType: 'reading',
            durationMin: 8,
            body: `# What SAFE is for

SAFE is CSI's specialized tool for **slabs, mats, and foundations** —
the two-way, plate-like elements that ETABS models more simply for
overall building analysis. Where ETABS treats a floor slab mainly as
a rigid diaphragm that transfers lateral load between frames, SAFE
models the same slab as a real bending plate, giving accurate moments,
shears, and deflections across the slab for its actual design.

## When to reach for it over ETABS's own slab design

- Flat slab or flat plate floors, where punching shear around columns
  needs real checking
- Mat/raft foundations, where soil-structure interaction (a soil
  spring or subgrade modulus under the mat) governs behavior
- Any slab where deflection (not just strength) is being checked
  carefully — long spans, transfer slabs, post-tensioned slabs

## The core idea: the slab as a plate, not a diaphragm

SAFE meshes a slab into a fine grid of plate elements and solves for
how it actually bends in two directions under load — very different
from a simple one-way strip calculation. This is what makes it
possible to see exactly where reinforcement needs to concentrate
(over columns, at midspan) rather than applying a uniform
reinforcement layout everywhere out of caution.`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Setting up a slab or mat model',
            contentType: 'reading',
            durationMin: 12,
            body: `# Setting up a slab or mat model

## 1. Import or build the geometry

Many projects import column/wall layout directly from an ETABS model
(keeping geometry consistent between the two), then add the slab or
mat as a plate element over that layout.

## 2. Supports: columns as point supports, or a soil spring for a mat

For a suspended floor slab, columns above and below are modeled as
point (or short line) supports. For a mat foundation, the ground
itself is modeled as distributed vertical springs using a **subgrade
modulus** (from the geotechnical report) — not a rigid support,
because real soil compresses under load and that compression affects
how load distributes across the mat.

## 3. Loads, same categories as ETABS

Dead, live, and any special loads (equipment, partition walls as line
loads) are assigned directly to the slab.

## 4. Run analysis and read the moment contours

SAFE's output is typically viewed as moment contour plots across the
slab — bands of color showing where positive (bottom) and negative
(top) moment concentrate. Reinforcement is then designed to follow
that real distribution — heavier over columns (negative moment,
top steel), lighter at midspan (positive moment, bottom steel) —
instead of a blanket uniform layout.

## 5. Punching shear check around columns

For flat slabs specifically, SAFE checks punching shear — the risk of
a column punching through the slab locally — around every column,
which is often the governing check for flat slab thickness and
whether shear reinforcement (studs or a drop panel) is needed.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: a flat slab panel

**Task:** In a new SAFE model:

1. Model a single flat slab panel, 6 m × 6 m, 200 mm thick, supported
   on 4 corner columns (point supports) and 2 mid-edge columns
2. Assign dead load (self-weight automatic + 1.5 kN/m² superimposed)
   and live load (2 kN/m²)
3. Run the analysis and view the moment contour plot
4. Identify where negative (top) moment concentrates versus positive
   (bottom) moment
5. Run the punching shear check at the corner columns specifically —
   corner columns typically have the least slab area resisting
   punching shear, so they're often the critical case

**What this exercises:** reading a real moment contour instead of
assuming uniform reinforcement, and recognizing why punching shear
at corner/edge columns needs particular attention on flat slabs.`,
          },
        ],
      },
    ],
  };
}

function staadProCourse(): CourseSeed {
  return {
    slug: 'staad-pro',
    title: 'STAAD Pro',
    titleBn: 'স্টাড প্রো',
    description: 'General-purpose structural analysis — frames, trusses, and a wide range of structure types beyond just buildings.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What STAAD Pro is for',
            contentType: 'reading',
            durationMin: 8,
            body: `# What STAAD Pro is for

STAAD Pro is a general-purpose structural analysis tool — it isn't
specialized to buildings the way ETABS is, which makes it well suited
to a wider range of structure types: industrial steel frames, towers,
trusses, bridges, and pipe racks, alongside conventional buildings.
Where ETABS assumes stories and diaphragms by default, STAAD models
everything as nodes and members from the ground up, giving more
flexibility for non-building geometry at the cost of some of ETABS's
building-specific conveniences.

## The model, conceptually

- **Nodes** — points in 3D space, defined by coordinates
- **Members** — beam elements connecting two nodes, each assigned a
  section and material
- **Plates** — for modeling slabs or wall panels as 2D elements when
  needed
- **Supports** — fixed, pinned, or spring supports assigned to nodes
- **Loads** — assigned to members (distributed, point) or nodes
  (point loads), then combined per the design code

## When STAAD Pro over ETABS

- Industrial and non-building structures — trusses, towers, pipe
  racks, bridges
- Projects needing very specific member releases or unusual support
  conditions that a building-specific tool assumes away by default
- Teams already standardized on STAAD's command-file / macro workflow
  for repetitive structure types`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Building a model from nodes up',
            contentType: 'reading',
            durationMin: 13,
            body: `# Building a model from nodes up

## 1. Geometry: nodes and members

Because STAAD builds from raw nodes and members rather than a grid
system, it helps to sketch the structure's key coordinates on paper
first — every node's (x, y, z) position — before starting to model,
especially for non-orthogonal structures like trusses or towers where
there's no simple grid to fall back on.

## 2. Section and material properties

Assign a section (from a standard steel section library, or a custom
RCC section) and material to every member. For a truss, member
releases (pinned ends, carrying only axial force, no moment) usually
need to be set explicitly — trusses only work as trusses if their
members genuinely can't carry moment.

## 3. Supports

Assign supports to base nodes — fixed for most RCC column bases,
pinned for many steel truss/frame bases, or specific spring stiffness
values where soil-structure interaction needs it.

## 4. Loads and combinations

Loads get assigned to specific members or nodes — a distributed load
along a rafter, a point load at a specific joint. Load combinations
follow the design code exactly like ETABS.

## 5. Analysis and design as separate runs

Same principle as ETABS: run the analysis first, sanity-check
deflected shape and reactions, then run member design or code-checking
afterward — never skip straight to design results without checking
the analysis is behaving plausibly first.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: a simple roof truss

**Task:** In a new STAAD Pro model:

1. Model a simple triangular (king-post style) roof truss, 8 m span,
   2 m rise at the center
2. Assign pinned releases to all members so the model behaves as a
   true truss (axial force only)
3. Assign pinned supports at both base nodes
4. Apply a uniform downward load along the top chord representing
   roof dead + live load
5. Run the analysis and identify which members are in tension versus
   compression

**What this exercises:** building from raw nodes/coordinates rather
than a grid, setting member releases correctly for true truss
behavior, and reading tension/compression patterns — a top chord in
compression and bottom chord in tension is the expected result for
this load case, and a model showing the opposite usually means a
support or release was set up wrong.`,
          },
        ],
      },
    ],
  };
}

function sap2000Course(): CourseSeed {
  return {
    slug: 'sap2000',
    title: 'SAP2000',
    titleBn: 'স্যাপ২০০০',
    description: 'General-purpose finite element structural analysis, from simple frames to complex, unusual structures.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What SAP2000 is for',
            contentType: 'reading',
            durationMin: 8,
            body: `# What SAP2000 is for

SAP2000 is CSI's general-purpose structural analysis tool — built by
the same company as ETABS and SAFE, sharing much of the same
underlying analysis engine and interface logic, but aimed at general
and often more complex or unusual structures rather than typical
multi-story buildings specifically. It handles frame, shell, solid,
and cable/tendon elements in one model, which makes it a common
choice for bridges, stadiums, and structures with genuinely
non-standard geometry or behavior.

## How it relates to ETABS and STAAD Pro

If ETABS is specialized for buildings and STAAD Pro is general-purpose
with a nodes-and-members-first approach, SAP2000 sits as CSI's
general-purpose equivalent to STAAD Pro — most users pick between
STAAD Pro and SAP2000 based on team familiarity and specific feature
needs (SAP2000's nonlinear and dynamic analysis capabilities are
particularly strong) rather than one being categorically better.

## Element types available

- **Frame** elements — beams, columns, braces (same as STAAD's members)
- **Shell** elements — slabs, walls, curved surfaces
- **Solid** elements — for genuinely 3D stress states a shell/frame
  can't represent well (thick foundations, complex joints)
- **Cable/tendon** elements — for cable-stayed or suspension
  structures, and for post-tensioning tendons in concrete`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Modeling and analysis workflow',
            contentType: 'reading',
            durationMin: 12,
            body: `# Modeling and analysis workflow

## 1. Choose the right element type per component

Decide upfront which parts of the structure need frame elements
(members that primarily carry axial/bending force along their
length) versus shell elements (surfaces that bend in two directions)
versus solid elements (rare, only for genuinely 3D stress
concentrations). Getting this choice right the first time avoids
having to remodel a section later.

## 2. Geometry, materials, and sections

Same underlying logic as ETABS/STAAD: define materials and section
properties, then assign them to the drawn geometry.

## 3. Loads and load cases

SAP2000 distinguishes **load patterns** (a named type of load — dead,
live, wind) from **load cases** (how that pattern is analyzed — static
linear, response spectrum, time history, nonlinear static/pushover).
This is where SAP2000 goes further than a typical building-analysis
tool: dynamic and nonlinear load cases are first-class features, not
an add-on.

## 4. When nonlinear or dynamic analysis is actually needed

Most conventional buildings only need linear static analysis with
code-based seismic load. Reach for SAP2000's nonlinear/dynamic
capability specifically when the project needs it — base-isolated
buildings, structures needing time-history seismic analysis, or
pushover analysis for seismic performance assessment — rather than by
default, since these analysis types take real setup effort and
computation time that most projects don't need.

## 5. Results interpretation

As with any FE tool, sanity-check before trusting: do reactions sum
to the applied load, does the deflected shape look physically
reasonable, are there any released or disconnected members the model
silently ignored.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: a simple portal frame

**Task:** In a new SAP2000 model:

1. Model a single-bay, single-story portal frame — two columns 5 m
   tall, 6 m apart, connected by a beam, all frame elements
2. Assign fixed supports at both column bases
3. Apply a uniform distributed load along the beam (representing roof
   load) and a point lateral load at the top of one column
   (representing wind)
4. Run a static linear analysis for each load pattern separately, then
   combine them into one load combination
5. Check the bending moment diagram at the base of each column — a
   portal frame with fixed bases typically shows maximum moment right
   at the base connections

**What this exercises:** the distinction between a load pattern and
how it's analyzed, and reading a moment diagram to confirm the frame
is behaving as expected — fixed-base portal frames concentrate moment
at the base and at the beam-column joints, not at midspan.`,
          },
        ],
      },
    ],
  };
}

function primaveraCourse(): CourseSeed {
  return {
    slug: 'primavera',
    title: 'Primavera P6',
    titleBn: 'প্রিমাভেরা পি৬',
    description: 'Enterprise-grade project scheduling — the standard for large construction and infrastructure programs.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What Primavera P6 is for',
            contentType: 'reading',
            durationMin: 8,
            body: `# What Primavera P6 is for

Primavera P6 is enterprise project scheduling software — built for
large, complex programs with hundreds or thousands of activities,
multiple resource pools, and multi-project portfolios, which is why
it's the standard on large infrastructure and construction programs
specifically (as opposed to MS Project, more common on smaller,
single-project work — covered in the next course).

## Core scheduling concepts, shared with any CPM tool

- **Activity** — a discrete piece of work with a duration
- **Relationship** — how activities depend on each other (finish-to-start
  is most common: Activity B can't start until Activity A finishes)
- **Critical path** — the longest chain of dependent activities through
  the whole schedule; any delay on the critical path delays the whole
  project, while delay on a non-critical activity (which has "float")
  might not
- **Float** (or slack) — how much an activity can slip without
  delaying the project

## What P6 adds beyond basic CPM scheduling

- **Resource leveling** across an entire portfolio of projects
  sharing the same resource pool (not just one project's resources)
- **Baselines** — a snapshot of the original plan, kept alongside the
  live schedule, so progress and delay can be measured against what
  was originally planned, not just against the current version
- **EVM (Earned Value Management)** reporting built directly from
  the schedule and resource/cost data — the same EVM concepts covered
  in the CivilOS PM ecosystem, applied at enterprise scale here`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Building and maintaining a schedule',
            contentType: 'reading',
            durationMin: 13,
            body: `# Building and maintaining a schedule

## 1. WBS first, then activities

Set up the Work Breakdown Structure (WBS) — the hierarchical
breakdown of the project into manageable chunks (by building, by
floor, by trade) — before adding individual activities. Every activity
gets assigned to a WBS node, which is what makes later filtering and
summary reporting (progress by building, by floor) possible.

## 2. Activities and durations

Add activities under each WBS node with realistic durations. Duration
estimates that are too optimistic are the single most common cause of
a schedule that immediately falls behind actual site progress.

## 3. Relationships and the critical path

Link activities with the correct relationship type and any necessary
lag (e.g., concrete curing time as a lag on a finish-to-start
relationship, not a separate activity). Once relationships are in,
P6 calculates the critical path automatically — the activities with
zero float. This is the schedule's most important output: it tells
the project team exactly which activities cannot slip without
delaying the whole project.

## 4. Resources and costs

Assign resources (labor, equipment, material quantities) and costs to
activities. This is what enables resource-loaded schedules and cost
forecasting, not just activity timing.

## 5. Baseline, then track progress against it

Once the initial schedule is approved, save it as a **baseline**.
From then on, update actual progress (percent complete, actual
start/finish dates) against the live schedule, and compare against
the baseline to see real variance — this comparison is the entire
basis of EVM reporting (schedule variance, cost variance) later.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: a small foundation-to-slab schedule

**Task:** In a new Primavera P6 project:

1. Create a WBS with 3 nodes: Excavation, Foundation, Ground Floor Slab
2. Add activities under each: e.g., "Excavate footings" (3 days),
   "Place blinding concrete" (1 day), "Fix foundation reinforcement"
   (2 days), "Pour foundation concrete" (1 day), "Cure" (7 days, as a
   lag not a resourced activity), "Fix slab reinforcement" (2 days),
   "Pour slab concrete" (1 day)
3. Link them all finish-to-start in logical sequence, with the 7-day
   cure period as a lag on the relationship between foundation pour
   and slab reinforcement fixing
4. Identify the critical path
5. Save a baseline, then simulate a 2-day delay on "Fix foundation
   reinforcement" and see how it propagates

**What this exercises:** WBS-first structuring, using a lag for a
waiting period instead of a fake resourced activity, and seeing a
delay propagate along the critical path — the core mechanic that
makes CPM scheduling useful for real decision-making on site.`,
          },
        ],
      },
    ],
  };
}

function msProjectCourse(): CourseSeed {
  return {
    slug: 'ms-project',
    title: 'MS Project',
    titleBn: 'এমএস প্রজেক্ট',
    description: 'Approachable project scheduling for smaller projects — the everyday alternative to Primavera P6.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'What MS Project is for',
            contentType: 'reading',
            durationMin: 7,
            body: `# What MS Project is for

Microsoft Project uses the same core CPM (Critical Path Method)
scheduling logic as Primavera P6 — activities, relationships, critical
path, float — but in a lighter, more approachable tool aimed at
single or small-portfolio projects rather than enterprise programs.
For a small building project or a straightforward site schedule, MS
Project is often the faster, more accessible choice; for a large
multi-project program with heavy resource-sharing across projects,
P6's extra capability starts to matter more.

## What transfers directly from Primavera P6

Every core concept from the P6 course applies unchanged: WBS-first
structuring, activities with realistic durations, finish-to-start
relationships with lags for waiting periods, the critical path as the
schedule's most important output, and baselines for tracking progress
against the original plan.

## Where MS Project is genuinely simpler

- Single-project focus by default — no enterprise resource pool to
  configure across a portfolio
- The Gantt chart view is the default, primary way of working, rather
  than one view among several enterprise reporting layouts
- Faster to get a usable, sharable schedule out for a small team or a
  single project, at the cost of some large-portfolio reporting depth`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'Building a schedule in the Gantt view',
            contentType: 'reading',
            durationMin: 11,
            body: `# Building a schedule in the Gantt view

## 1. Task list first

Type the task list directly into the table portion of the Gantt view
— task name and duration for each. MS Project's table-plus-timeline
layout makes this faster to get started with than P6's more layered
interface, for a straightforward project.

## 2. Outline into summary tasks

Group related tasks under summary tasks (indent them) — this gives
the same WBS-like structure as Primavera, just built by indenting
rows in the same table rather than a separate WBS-configuration step.

## 3. Link tasks

Select tasks and link them (finish-to-start is the default and most
common), which draws the dependency arrows on the Gantt chart and
immediately starts calculating the critical path — shown in red on the
default Gantt view, making it easy to spot at a glance.

## 4. Assign resources

Assign resources (people, equipment) to tasks from a resource sheet.
MS Project flags **over-allocation** (a resource assigned more work in
a period than it can actually do) visually, which is often the first
sign a schedule is unrealistic before it even starts.

## 5. Set a baseline and track progress

Same concept as P6: save a baseline once the plan is approved, then
update percent-complete and actual dates as work happens, comparing
against the baseline to see real schedule variance.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 12,
            body: `# Practice assignment: the same schedule, in MS Project

**Task:** Rebuild the Primavera practice exercise (Excavation →
Foundation → Ground Floor Slab, same 7 activities and durations) in
MS Project instead:

1. Type the 7 tasks directly into the Gantt view's task table
2. Group them under 3 summary tasks: Excavation, Foundation, Ground
   Floor Slab
3. Link them finish-to-start in sequence, with a 7-day lag for curing
4. Confirm the critical path is highlighted automatically
5. Assign a "Mason" resource to the reinforcement-fixing tasks and
   check for any over-allocation warning if the same resource is
   assigned to overlapping tasks by mistake

**What this exercises:** the same scheduling logic as the Primavera
exercise, in a different interface — confirming the underlying CPM
concepts transfer between tools even though the two look quite
different day to day.`,
          },
        ],
      },
    ],
  };
}

function excelForEngineersCourse(): CourseSeed {
  return {
    slug: 'excel-for-engineers',
    title: 'Excel for Engineers',
    titleBn: 'ইঞ্জিনিয়ারদের জন্য এক্সেল',
    description: 'The one tool nearly every engineer uses daily — BOQ, estimates, and quick calculations, done right.',
    published: true,
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            title: 'Why Excel deserves deliberate practice, not just familiarity',
            contentType: 'reading',
            durationMin: 8,
            body: `# Why Excel deserves deliberate practice, not just familiarity

Almost every engineer already "knows" Excel in the sense of being able
to type numbers into cells. Far fewer use it in a way that scales —
where changing one input (a quantity, a rate) correctly updates every
number that depends on it, with no manual re-typing and no risk of a
stale, forgotten hardcoded value hiding in a formula. That difference
is the entire subject of this course.

## The one habit that matters most: formulas, never hardcoded results

If a cell's value is the result of a calculation, it should contain a
formula referencing the input cells — never the calculated number
typed in directly. A BOQ where "Amount" is typed in by hand instead of
being quantity × rate looks identical today, but silently goes wrong
the moment quantity or rate changes and nobody remembers to
recalculate that one cell by hand. This platform's own Resource
Library BOQ and Material Estimate templates follow exactly this rule
— every Amount and Total cell is a live formula, not a typed number —
specifically so they stay correct as they're filled in.

## Structure before formulas

A good engineering spreadsheet has: a clear header/title area, an
input section (fillable numbers, usually visually distinguished, e.g.
a colored fill), and a calculated-output section that references the
inputs. Mixing inputs and calculated cells with no visual distinction
is how spreadsheets become error-prone — a colleague (or your future
self) can't tell what's safe to edit and what will break a formula.`,
          },
        ],
      },
      {
        title: 'Core Workflow',
        lessons: [
          {
            title: 'The formulas every engineer actually reaches for',
            contentType: 'reading',
            durationMin: 13,
            body: `# The formulas every engineer actually reaches for

## Basic arithmetic references, done properly

Instead of \`=120*350\` (a hardcoded calculation with no traceable
inputs), reference the actual cells: \`=D5*E5\` where D5 is quantity
and E5 is rate. Every input stays visible and editable, and the
formula recalculates automatically the moment either input changes —
this single habit is most of what separates a reliable engineering
spreadsheet from a fragile one.

## SUM, and why a running total should never be typed by hand

\`=SUM(F6:F25)\` for a BOQ total, referencing the full range of Amount
cells. If a row gets added or removed later, extending the SUM range
(or building the table so new rows fall inside the range
automatically) keeps the total honest — a manually re-typed total is
guaranteed to eventually go stale.

## IF, for simple conditional logic

\`=IF(A1>100, "Order more", "Sufficient")\` — useful for quick flags:
whether a quantity exceeds a stock threshold, whether a test result
passes a minimum requirement. Keep conditions simple and readable;
deeply nested IFs are usually a sign the logic belongs in a proper
lookup table instead.

## VLOOKUP / XLOOKUP, for pulling from a reference table

Rather than re-typing a material's unit rate every time it's used
across a sheet, keep one reference table of rates and pull from it:
\`=VLOOKUP(A5, RateTable, 2, FALSE)\` (or the newer, more forgiving
\`=XLOOKUP(A5, RateTable[Material], RateTable[Rate])\`). Update the rate
once in the reference table and every formula referencing it updates
— the same "single source of truth" idea that shows up throughout
proper spreadsheet design.

## Wastage and rounding, the two errors that quietly cost money

\`=Quantity*(1+WastagePercent/100)\` accounts for material wastage
explicitly, as its own visible step, rather than folding an
undocumented "safety margin" into the rate itself where nobody can see
it later. And avoid rounding intermediate calculation steps — round
only the final displayed result, using Excel's display formatting
rather than the ROUND() function on numbers still being used in
further calculations, so rounding error doesn't compound.`,
          },
          {
            title: 'Practice assignment',
            contentType: 'reading',
            durationMin: 15,
            body: `# Practice assignment: build your own quantity sheet

**Task:** Rather than starting from scratch, open the **BOQ Template**
or **Material Estimate Template** from this platform's Resource
Library (Resources section) and:

1. Identify every cell that's currently a live formula (Amount, Qty
   incl. Wastage, Total) versus every cell meant to be typed in by
   hand
2. Add 3 new real material line items with realistic quantities and
   rates
3. Confirm the Total updates automatically with no manual
   recalculation
4. Deliberately break one formula (replace it with a typed number)
   and see how the sheet no longer updates when you change that row's
   quantity — then fix it back
5. If using the Material Estimate Template specifically, try changing
   the wastage percentage on one row and confirm only that row's
   quantity-including-wastage changes, not the others

**What this exercises:** recognizing the formula-vs-hardcoded-value
distinction in an existing professional template, and directly
experiencing why a hardcoded value breaks the moment an input changes
— the exact failure mode the first lesson in this course warned
about.`,
          },
        ],
      },
    ],
  };
}

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

export const rawSubjects: SubjectSeed[] = [
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
  {
    slug: 'software-learning-center',
    title: 'Software Learning Center',
    titleBn: 'সফটওয়্যার লার্নিং সেন্টার',
    description:
      'How to use the software, not the engineering theory behind it — CAD & BIM, structural analysis tools, project scheduling, and Excel.',
    courses: [
      autocadCourse(),
      revitCourse(),
      civil3dCourse(),
      sketchupCourse(),
      etabsCourse(),
      safeCourse(),
      staadProCourse(),
      sap2000Course(),
      primaveraCourse(),
      msProjectCourse(),
      excelForEngineersCourse(),
    ],
  },
];
