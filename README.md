# CivilLearn — Phase 1 + Phase 2

**Phase 1** (Foundation): project setup, Firebase Auth, layout system, Home
page structure, Dashboard shell.

**Phase 2** (Learning System — blueprint Part 4): all 8 subject areas and
every one of their 42 sub-topics, seeded as real courses in Postgres via
Prisma — plus three pages that query that data end-to-end: Course Listing
(`/learning`), Course Detail (`/learning/[slug]`), and the Lesson Viewer
(`/learning/[slug]/[lessonId]`), including lesson-completion tracking tied
to the logged-in user.

Every "coming later" spot is still marked with a dashed placeholder or an
explicit note — it's obvious what's real content vs. reserved structure.

## What's actually built

**Phase 1:**
- Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui-style primitives
  (Button, Card, Input, Label, Progress, Avatar) on Radix.
- Firebase Auth — email/password + Google sign-in via `useAuth()`.
- Layout system — header, footer, protected-route wrapper.
- Home page — built hero + structural section shells (still placeholder
  content on the home page itself; see Phase 2 for where real data lives).
- Dashboard shell — sidebar, topbar, stat cards, empty states.

**Phase 2:**
- **Prisma schema extended**: `Subject` model added above `Course`
  (the 8 blueprint subject areas), `Lesson` gained a `body` field for
  markdown reading content and `durationMin`, and a new `LessonProgress`
  model tracks per-user, per-lesson completion.
- **Seed script** (`prisma/seed.ts`) — all 8 subjects, all 42 courses,
  exactly matching blueprint Part 4.1 (verified programmatically, not just
  by eye: zero missing, zero extra). One full course per subject area
  (Structural Engineering → **Structural Analysis**, written out
  completely as the reference example) has real, substantive lesson
  content — genuine explanations, worked examples, BNBC references, not
  lorem ipsum. The other ~34 courses are seeded with accurate
  module/lesson structure and descriptions but `body: null`, clearly
  marked "structure only" in the UI — same honesty convention as the
  Phase 1 home-page placeholders.
- **Course Listing** (`/learning`) — real query grouping all courses by
  subject, with module counts.
- **Course Detail** (`/learning/[slug]`) — module/lesson breakdown, "Start"
  or "Continue" button (routes to first incomplete lesson), live
  percent-complete for logged-in users.
- **Lesson Viewer** (`/learning/[slug]/[lessonId]`) — full sidebar
  navigation across the whole course, markdown rendering for reading
  lessons, mark-complete toggle, prev/next navigation. Reserved,
  correctly-typed empty states for video/interactive/lab lesson types
  that don't have their rendering engines built yet.
- **Server-side auth**: added `/api/auth/session` (exchanges a Firebase ID
  token for an httpOnly session cookie) and `lib/current-user.ts` (resolves
  that cookie into the mirrored Postgres `User` row inside Server
  Components). Phase 1's client-only Firebase Auth didn't have a
  server-side session; the Lesson Viewer's progress tracking needed one,
  so it's added here and wired into `signIn`/`signUp`/`signInWithGoogle`
  in `lib/auth-context.tsx`.

## The signature pieces

**Phase 1 — the beam diagram.** Live SVG simply-supported beam on the
homepage hero: drag the load, the bending-moment diagram redraws using the
real M(x) formula. `components/visuals/beam-diagram.tsx`.

**Phase 2 — the dimension-line progress indicator.** In the Lesson Viewer,
progress through the current module is shown as a dimension line with tick
marks — one per lesson — styled after a drafting sheet's measurement
convention, in `components/learning/dimension-progress.tsx`. This earns the
"numbered ticks" treatment in a way a generic 01/02/03 list wouldn't:
lessons within a module genuinely *are* a measured, ordered sequence, so
the visual encodes something true about the content rather than decorating
it.

## Setup

**1. Install dependencies**

```bash
npm install
```

Same caveat as Phase 1: this was built in a sandbox with no network
access, so `npm install` has never been run against it here. See
"A note on verification" at the bottom for exactly what was and wasn't
checked.

**2. Environment variables**

```bash
cp .env.example .env.local
```

Phase 2 makes two vars that Phase 1 listed as optional now **required**:
- `DATABASE_URL` — the Lesson Viewer doesn't work without a real Postgres
  connection; there's no more placeholder-array fallback for this data.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
  (Firebase Admin) — needed by `/api/auth/session` for progress tracking
  to work. Get these from Firebase Console → Project Settings → Service
  Accounts → Generate new private key.

**3. Push schema + seed the database**

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

The seed script is safe to re-run — it upserts subjects/courses by slug
and clears/recreates modules+lessons per course, so running it twice
doesn't duplicate anything.

**4. Run it**

```bash
npm run dev
```

Visit `http://localhost:3000/learning` to see the catalog, or go through
`/signup` first if you want to test lesson-completion tracking.

## Design notes

Same token system as Phase 1 (`structural-900`, `oxide-500`, `steel-500`,
`vellum-100`, `concrete-500` in `tailwind.config.js`). Phase 2 adds
`.prose-lesson` styling in `app/globals.css` for markdown lesson bodies —
display face for headings, mono for inline code, consistent with the
"specs get mono" rule established in Phase 1's footer.

## What's next (not in this phase)

The Lesson Viewer has reserved slots for `video`, `interactive`, and `lab`
content types with correct typing and empty states, but no rendering
engines yet — those are Part 6 (Visual Learning), Part 7 (Experiment &
Lab), and Part 23 (Multimedia System) respectively. The ~34 courses seeded
as "structure only" need real lesson bodies written. Say which piece to
pick up next.

## A note on verification

Same limitation as Phase 1: no network access here, so no `npm install`,
`prisma generate`, or `next build` could run. What I verified this time,
beyond Phase 1's checks:

- Every Prisma query in the new files was manually traced field-by-field
  against `schema.prisma` — every `include`, `where`, and `select` key
  matches an actual model field, and the `LessonProgress` compound unique
  key (`userId_lessonId`) matches its `@@unique([userId, lessonId])`
  declaration order, which is what Prisma actually generates.
- The seed script's course list was diffed programmatically against the
  blueprint document's Part 4.1 — confirmed exact match, 42 of 42, zero
  missing and zero extra.
- Every component prop passed between the new files (`LessonSidebar`,
  `DimensionProgress`, `MarkCompleteButton`) was checked against its
  declared interface — 84 import bindings total checked project-wide, plus
  every internal `@/...` import still resolves to a real exported name.

This is stronger signal than Phase 1 had, but it's still not a compiler
that actually ran against real type definitions. If `prisma generate`
produces slightly different method signatures than I assumed (unlikely at
this Prisma version, but possible), that's the most likely source of any
remaining issue — not the query logic itself.

---

## Phase 3 — Interactive Visualization Engine (blueprint Part 6)

Adds a registry-based system for embedding real, physics-accurate
visualizations into `interactive`-type lessons, plus two working examples:
one 2D (JSXGraph) and one 3D (React Three Fiber).

### What's built

- **`Lesson.interactiveKey`** — new schema field. An `interactive` lesson's
  row stores a plain string key; the Lesson Viewer looks that key up in a
  registry to decide which component to mount. Adding a new visualization
  later means building the component and adding one line to the registry —
  no page code changes, no migration beyond the one field already in place.
- **`components/visualizations/visualization-frame.tsx`** — shared chrome
  (title, reference/units note, reset button, grid-paper background,
  controls panel) used by every visualization regardless of whether it
  renders in 2D or 3D underneath. This is what keeps a JSXGraph diagram and
  a Three.js scene from looking like two different products.
- **Moment Diagram Explorer** (`2d/moment-diagram-explorer.tsx`, JSXGraph)
  — the same simply-supported-beam physics as the homepage hero's
  `beam-diagram.tsx`, rebuilt as a lesson-embeddable JSXGraph board with a
  draggable load and live-redrawing moment diagram. Wired into Structural
  Analysis's existing "Interactive: point load moment diagram" lesson,
  which was a placeholder in Phase 2.
- **Column Buckling Visualizer** (`3d/column-buckling-visualizer.tsx`,
  React Three Fiber) — Euler's critical buckling load
  (P_cr = π²EI/(KL)²) shown live in 3D as slenderness ratio changes, with
  the column's deflected mode shape rendered as an actual curved mesh, not
  a flat diagram. New "Column Stability" module added to Structural
  Analysis with a reading lesson explaining why slender columns fail
  differently, then this visualizer.
- **`components/visualizations/registry.tsx`** — the interactiveKey →
  component map, loaded via `next/dynamic` with `ssr: false` since both
  JSXGraph and WebGL need a real DOM. Falls back to a clear "not wired up
  yet" message for any interactiveKey that doesn't match a registered
  component, rather than crashing or silently rendering nothing.

### A bug this caught before shipping

The Column Buckling Visualizer's first draft mixed MPa/kPa/m units
mid-formula and was off by roughly 1000× — I verified the math externally
against a clean SI-unit calculation before finalizing, found the
discrepancy, traced it to the unit conversion, and rewrote the calculation
to stay in consistent N/mm units throughout (E is naturally MPa = N/mm²,
I is naturally mm⁴ from a radius-of-gyration input), converting only the
final answer to kN. Re-verified against six slenderness values spanning
the slider's full range — P_cr now decreases correctly as slenderness
increases, and the magnitudes are realistic for an actual steel column
(hundreds to tens of thousands of kN). Flagging this here rather than
quietly fixing it, since it's exactly the kind of error that's invisible
in a design review but actively wrong in a physics lesson.

### Setup — nothing new required

This phase adds no new environment variables and no new npm packages
beyond what Phase 1's `package.json` already pinned (`jsxgraph`, `three`,
`@react-three/fiber`, `@react-three/drei` were already in the original
stack). After `npm install`, re-run:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

The seed script now also sets `interactiveKey` on the two lessons that use
it — safe to re-run, same upsert/clear-and-recreate pattern as before.

### What's next (not in this phase)

Only 2 of the many Part 6 visualizations named in the blueprint
(Column Failure, Load Transfer, Soil Settlement, Earthquake Motion, Crack
Formation, Shear Failure, Water Flow, Reinforcement Details, Building
Structure, Soil Layers, Construction Sequence) are built. The registry
pattern means each additional one is now a self-contained component + one
registry line, not a page-level change — but the physics/math for each
still needs the same care the buckling formula got here.

### A note on verification

Same no-network limitation as Phases 1 and 2. What's new this time: the
Euler buckling formula was independently verified against a clean-unit
calculation (documented above) rather than trusted on the strength of
"the formula looks right" — that's how the unit-conversion bug got caught.
Registry key strings were checked to match exactly between
`registry.tsx` and `seed.ts` (a typo there would silently fall through to
the "not wired up" state rather than error). Component prop usage across
`VisualizationFrame`, `VizSlider`, and both visualization components was
checked line-by-line against their declared interfaces, and the relative
imports inside `components/visualizations/` (not just the `@/...` imports
checked in prior phases) were added to the automated import/export
cross-check — 90 bindings checked project-wide, zero mismatches.

---

## Phase 4 — Virtual Lab Engine (blueprint Part 7)

Adds a registry-based system for `lab`-type lessons, structured around the
four features the blueprint names for the Experiment & Lab System:
Equipment Explanation, Step-by-step Procedure, [virtual] Simulation, and
Result Calculation feeding an Auto Lab Report. First working example:
Sieve Analysis (gradation test) under a newly fully-written Soil Mechanics
course.

### What's built

- **`Lesson.labKey`** — new schema field, same pattern as Phase 3's
  `interactiveKey`. A **`LabResult`** model was also added — unlike
  visualizations, a lab produces a report the blueprint explicitly calls
  "Auto Lab Report," which implies it should persist, not vanish on
  refresh. Each submitted run is saved as raw inputs + computed results
  (JSON columns), scoped to user + lesson.
- **`components/labs/lab-frame.tsx`** — shared chrome implementing the
  four-stage flow (Equipment → Procedure → Run Test → Lab Report) as
  tabs, with later stages locked until earlier ones are completed. Every
  lab gets this same instrument-panel structure regardless of what it's
  actually testing.
- **`components/labs/soil/sieve-analysis-logic.ts`** — the gradation-test
  math (retained → cumulative → percent passing, D10/D30/D60 via
  log-space interpolation, Cu/Cc coefficients, well-graded classification)
  kept in a plain calculation file with no React or UI code. Deliberately
  separated so the formulas are one place to read and check — this is the
  file that would have caught Phase 3's unit-conversion bug faster had the
  buckling formula lived somewhere this isolated. The math here was
  independently verified against a hand-computed reference before the UI
  was built around it: same values, confirmed line-by-line.
- **`components/labs/soil/gradation-curve.tsx`** — the particle-size
  distribution curve on a genuine log-scale x-axis (JSXGraph), the actual
  professional convention (ASTM D6913 / BNBC 2020) for this chart, not a
  stylistic choice — particle sizes span orders of magnitude and D10/D30/D60
  are conventionally read directly off this semi-log plot.
- **`components/labs/soil/sieve-analysis-lab.tsx`** — assembles the above
  into the full lab: pre-filled but fully editable sample data, mass-balance
  validation before allowing the user into the report stage, and a save
  action that persists to `LabResult` (with a real error/not-logged-in
  message, not a silent no-op).
- **`components/labs/registry.tsx`** — `labKey` → component map, same
  `next/dynamic` + `ssr: false` pattern as the visualization registry.
- **Soil Mechanics** course fully written (was "structure only" through
  Phase 3) — two reading lessons that set up classification and gradation
  curve theory, then the lab. The reading content's specific claims (e.g.,
  "high Cu but fails the Cc check") were checked against the lab's actual
  sample-data output before being written, so the lesson text and the
  live lab agree with each other rather than describing a generic case
  disconnected from what the student actually sees.

### Two things caught before shipping

**A real bug**: `sieve-analysis-lab.tsx` used the `cn()` class-merging
utility without importing it — would have been a runtime `ReferenceError`
the first time the save-report footer rendered. Caught by the same
import/export cross-check used in prior phases.

**A bug in the verification tooling itself, not the code**: that
cross-check initially flagged two false positives — `type LabStage` and
`type SieveRow` imported inline alongside regular named imports (valid
TypeScript since 4.5, e.g. `import { LabFrame, type LabStage } from
'../lab-frame'`). The checker script wasn't stripping the inline `type`
keyword before comparing names, not a problem with the import statements
themselves. Fixed the checker, re-ran, confirmed clean. Noting this
because it's worth being honest when a flagged issue turns out to be the
verification method's fault rather than the code's.

### Setup — one new thing

No new npm packages (JSXGraph was already in Phase 1's `package.json`).
After `npm install`, the usual:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

`db push` now also creates the `lab_results` table. The seed script sets
`labKey: 'sieve-analysis'` on the new lab lesson and writes the full
Soil Mechanics course content — safe to re-run, same
upsert/clear-and-recreate pattern as every phase before this one.

### What's next (not in this phase)

Only 1 of the blueprint's 4 labs (Concrete, **Soil** ✓, Highway, Survey)
has a working test. Within Soil Lab alone, Liquid Limit, Plastic Limit,
Compaction Test, and Direct Shear Test are still unbuilt. The registry
pattern means each is a self-contained component + one line, but — as
with Part 6 — the math for each needs the same independent verification
this one got, not just "the formula looks right."

### A note on verification

Same no-network limitation as every prior phase. This phase added one
verification step beyond Phase 3's: the calculation logic
(`sieve-analysis-logic.ts`) was traced through in Python line-for-line
before any UI was built around it, and cross-checked against an
independently hand-computed reference (D10/D30/D60/Cu/Cc all matched
exactly). The import/export cross-check now covers 105 bindings
project-wide; the two false positives it initially raised were confirmed
to be a bug in the checker's handling of inline `type` import specifiers,
not in the imports themselves, and the checker was fixed rather than the
finding being waved off.

---

## Phase 5 — Three More Labs: Concrete, Highway, Survey (blueprint Part 7 continued)

Fills out three of the four remaining blueprint labs with one working test
each: Slump Test (Concrete), Aggregate Impact Value (Highway), and
Differential Levelling (Survey). Same `LabFrame` four-stage engine from
Phase 4, no engine changes needed — this phase is entirely new lab content
plus the courses to hold it.

### What's built

- **`components/labs/concrete/slump-test-logic.ts`** + **`slump-test-lab.tsx`**
  — workability classification (Very low / Low / Medium / High / Very
  high-flowing / Collapse) plus a "shear slump" invalid-test case, since a
  real slump test can fail in a way that isn't a number at all — the mass
  shears sideways instead of settling evenly, and the reading has to be
  discarded and retested. Boundary-tested against gaps/overlaps between
  classification bands (0/25/50/100/175/230mm — all clean).
- **`components/labs/highway/aggregate-impact-logic.ts`** + **`aggregate-impact-lab.tsx`**
  — Aggregate Impact Value (mass passing 2.36mm sieve after standard impact
  / original mass × 100), BS 812 grade bands. The report explicitly states
  that lower AIV means tougher aggregate, since that's the one place this
  test's result reads backwards from most students' first intuition.
- **`components/labs/survey/levelling-logic.ts`** + **`levelling-lab.tsx`**
  — differential levelling by the Rise & Fall method, with a dynamic
  field-book table (BS/IS/FS columns) and the real arithmetic closure
  check (ΣBS − ΣFS = ΣRise − ΣFall = Last RL − First RL) that a field
  survey actually uses to catch booking errors. This was the most
  mathematically involved of the three — traced through in Python
  line-for-line against the final TypeScript logic before any UI was
  built, confirming exact RL values (100.000 → 100.320 → 101.430 → 101.965)
  and closure agreement across all three independent sums.
- **Three courses fully written** (were "structure only"): Building
  Materials (workability theory → Slump Test), Highway Engineering
  (why pavement aggregate needs impact testing specifically, not just
  crushing strength → AIV test), Surveying (how a level's fixed sight
  line works, the "bigger reading = lower ground" rule, why the
  arithmetic check exists → Levelling test). Every specific numeric claim
  in the reading content (e.g., "lands in the strong range," "classifies
  as Medium workability") was checked against each lab's actual default
  sample-data output before being written.
- **Registry updated** — `LAB_REGISTRY` now has 4 entries (`sieve-analysis`,
  `slump-test`, `aggregate-impact-value`, `levelling`), all cross-checked
  for exact string match against their seeded `labKey` values.

### Setup — nothing new required

No new npm packages, no schema changes (`labKey` already existed from
Phase 4). Same commands as before:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### What's next (not in this phase)

Concrete, Soil, and Highway now each have one working test; Survey has
Levelling but not Traverse or Total Station (both meaningfully more
complex — coordinate geometry and closure error for a 2D traverse, not
just a 1D elevation chain). Within the labs already built, there's also
room to add more tests per lab (Compression Test for Concrete, Bitumen
Test for Highway, Liquid/Plastic Limit and Compaction Test for Soil) —
all following the same verify-the-math-independently-first pattern this
phase and Phase 4 established.

### A note on verification

Same no-network limitation as every prior phase. All three calculation
files were independently verified in Python before their UI was built —
Slump Test's classification bands were boundary-tested for gaps/overlaps
across all five thresholds, AIV's rounding approach was checked against
two independent implementations for agreement, and Levelling's full
station-by-station output was traced against the earlier hand-verified
reference with an exact match. The import/export cross-check now covers
126 bindings project-wide (up from 105 in Phase 4), including every prop
passed to `LabFrame`, `LabStageFooter`, and the cross-folder `VizSlider`
reuse in the Slump Test lab — all checked line-by-line against their
declared interfaces, not just import names.

---

## Phase 6 (part 1 of 2) — Three More Visualizations: Load Transfer, Column Failure, Foundation Pressure (blueprint Part 6 continued)

Blueprint Part 6 lists 17 visualizations across 3D Learning, Animated
Concepts, and Interactive Models. This is the first of two batches — three
built and verified here, five more to follow in the same registry pattern
established in Phase 3.

### What's built

- **`components/visualizations/3d/load-transfer-logic.ts`** +
  **`load-transfer-visualizer.tsx`** — the slab → beam → column →
  foundation → soil load path as a five-stage chain, not a single formula.
  A distributed load (kN/m²) becomes a line load (kN/m), then a point load
  (kN), then spreads back to an area pressure (kN/m²) sized against a
  bearing capacity. Rendered in 3D (React Three Fiber) because the
  area-line-point-area shape change is genuinely spatial — a flat chart
  can't show a slab, beam, and footing at their relative real sizes the
  way an actual small 3D scene can. Verified with a hand-worked numerical
  example before the component was built: 5 kN/m² slab load → 20 kN/m
  beam load → 60 kN column load → 0.4 m² footing → soil pressure returns
  to exactly the 150 kN/m² bearing capacity it was sized against.
- **`components/visualizations/2d/column-failure-logic.ts`** +
  **`column-failure-visualizer.tsx`** — crushing capacity (constant,
  Fy×A) plotted against Euler buckling capacity (decreasing, reusing the
  same formula as Phase 3's Column Buckling Visualizer) across
  slenderness ratio, with the crossover point solved analytically
  (s = √(π²EI/(Fy·A·r²)) ≈ 88.86 for the same representative column used
  throughout) rather than searched for numerically. Verified the two
  capacity formulas agree to within rounding right at that computed
  crossover point — not just that the curves "look like" they cross
  somewhere near there.
- **`components/visualizations/2d/foundation-pressure-logic.ts`** +
  **`foundation-pressure-visualizer.tsx`** — pressure distribution under
  an eccentrically-loaded footing: uniform when centered, trapezoidal
  within the "middle third" (e ≤ B/6), triangular with visible uplift
  past it (soil can't take tension, so the footing lifts off on one
  side). Verified continuity right at the e = B/6 boundary (both formulas
  agree there) and the e = 0 concentric case (reduces to plain P/A on
  both sides of the branch).

### A real rendering bug caught and fixed before shipping

The Foundation Pressure visualizer's first draft approximated the
triangular-uplift diagram's width as "roughly 60% of the footing" instead
of using the actual computed contact width from the logic file — the
*numbers* in the controls panel were always correct (they came straight
from the verified calculation), but the *triangle drawn on screen* would
have shown a contact width that didn't match those numbers. Fixed by
exposing `contactWidthM` from the logic file's result and having the
visualizer map that exact value to display units with the same scale
factor already used for eccentricity, rather than recomputing or
approximating it separately. Also cleaned up two smaller issues while
reviewing that file: a genuinely dead-code variable (`toRemove`, computed
but never used — an earlier draft's leftover) and a redundant initial
axis-line draw that was always immediately wiped by the next effect
anyway.

### Registry and seeding

All three keys (`load-transfer-visualizer`, `column-failure-comparator`,
`foundation-pressure-visualizer`) cross-checked for exact string match
between `registry.tsx` and `seed.ts`. Placed into existing courses at
points that connect to material already there rather than as
disconnected add-ons:

- **Load Transfer** → new "Load Path" module in Structural Analysis,
  between Deflection and Column Stability — the natural point to move
  from single-member behavior to how members connect into a system.
- **Column Failure** → added directly into the existing Column Stability
  module, right after the Column Buckling Visualizer, as the explicit
  "but does buckling even govern here?" follow-up question.
- **Foundation Pressure** → new "Bearing Pressure" module in Soil
  Mechanics, explicitly referencing back to the Load Path lesson's
  foundation-spreads-load-back-out idea and extending it to the eccentric
  case.

### Setup — nothing new required

No new npm packages, no schema changes. Same commands as always:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### What's next (not in this phase)

Five more Part 6 visualizations remain: Reinforcement Details, Crack
Formation/Shear Failure, Water Flow, Earthquake Motion, and Soil Layers —
planned next in that order, each getting the same independent math
verification before any UI is built, following directly from this batch.

### A note on verification

Same no-network limitation as every prior phase. All three calculation
files were verified independently in Python before their UI was built,
including boundary/continuity checks specific to each (the buckling
crossover point, the middle-third boundary, the concentric-load
degenerate case). Beyond the math, this phase's review caught a real
rendering-accuracy bug (the approximated vs. exact contact-width triangle,
detailed above) — worth noting specifically because it's a case where the
*underlying numbers* were already correct and only the *drawing* was
wrong, a category of error the calculation-file verification alone
wouldn't have caught, since it only checked the math, not what the SVG
canvas coordinates actually did with it. The import/export cross-check now
covers 139 bindings project-wide (up from 126 after Phase 5).

---

## Phase 7 — Full Site Internationalization (English ↔ Bengali)

Every page, component, lab, and visualization now supports switching
between English and Bengali via URL-based locale routing
(`/en/learning` vs `/bn/learning`), with a language switcher in the header.
This was built as its own foundational phase, before the remaining Part 6
visualizations, specifically so those don't need retrofitting later.

### What's built

- **URL-based routing** — `app/[locale]/` wraps every page.
  `middleware.ts` redirects bare paths (`/learning`) to the right locale
  prefix, preferring an existing `NEXT_LOCALE` cookie, then the browser's
  `Accept-Language` header, then English as the default. Chosen over
  cookie-only switching because it gives shareable links (send someone a
  Bengali lesson URL and it opens in Bengali), working SEO per language,
  and no mismatch between what a Server Component renders and what a
  client-side cookie says.
- **Dictionary system** — `lib/i18n/dictionary-type.ts` defines the
  `Dictionary` interface; `en.ts` and `bn.ts` are both typed against it,
  so a missing Bengali translation is a compile error, not a silent
  English fallback in production. Verified programmatically: every
  section and key matches exactly across the interface and both
  dictionaries (109 line-start keys audited; the only 3 apparent
  "mismatches" were confirmed to be function *parameter* names in the
  interface's type signatures, not dictionary keys — a real distinction,
  not a gap).
- **`components/i18n/link.tsx`** — a drop-in `next/link` replacement that
  auto-prefixes every internal href with the current locale, so the ~40
  existing `<Link href="/x">` call sites across the app needed only an
  import swap, not a per-link rewrite.
- **`lib/i18n/localize-content.ts`** — picks the right-language field for
  *database* content (`title` vs `titleBn`, `body` vs `bodyBn`), falling
  back to English when a Bengali translation doesn't exist yet yet rather
  than showing nothing — matching the "structure now, content later"
  honesty convention already used throughout `prisma/seed.ts`.
- **Schema extended**: `bodyBn` added to `Lesson`, `descriptionBn` added
  to `Subject` and `Course` (both already had `titleBn` from earlier
  phases).
- **Language switcher** (`components/i18n/language-switcher.tsx`) — in
  the header, swaps the locale prefix on the *current* path rather than
  bouncing to the home page, so switching language mid-lesson keeps you
  on that same lesson.

### Real bugs caught while converting, not just translation work

- **Active-link highlighting was silently broken.** `dashboard-sidebar.tsx`
  compared `usePathname()` (now locale-prefixed, e.g. `/en/dashboard`)
  directly against bare hrefs (`/dashboard`) — this would never match,
  so the sidebar's current-page highlight would have simply stopped
  working the moment routing went locale-aware. Fixed by stripping the
  locale prefix before comparing.
- **Login redirects would have double-hopped and dropped the user's
  locale.** `protected-route.tsx` called `router.replace('/login')` — a
  bare path that middleware would then redirect a second time, falling
  back to cookie/browser detection rather than preserving whichever
  locale the user was actually on. Fixed to redirect to `/${locale}/login`
  directly.
- **A locale-guessing hack that was actually wrong in spirit.** An early
  draft of the Sieve Analysis lab's classification text picked the word
  "and" vs "এবং" by comparing an unrelated dictionary string
  (`dict.auth.or === 'OR'`) as a proxy for "which locale am I in." Caught
  on review and replaced with a proper `dict.sieveAnalysis.and` key —
  using one string's content to infer locale for a completely different
  string was fragile and not how the rest of the system works.
- **Presentation text was leaking into the calculation layer** in four
  places (`sieve-analysis-logic.ts`'s classification, `slump-test-logic.ts`'s
  workability band, `aggregate-impact-logic.ts`'s grade/suitability,
  `levelling-logic.ts`'s check summary, plus `load-transfer-logic.ts` and
  `foundation-pressure-logic.ts`'s stage labels/explanations) — all
  originally returned pre-formatted English sentences instead of
  structured data. Fixed by having each return typed categories/numbers
  only, with the UI layer building the translated sentence via dictionary
  functions. This is also just better architecture independent of i18n:
  the calculation files are now testable without any UI or language
  concerns at all. Every restructured calculation was re-verified against
  its original hand-checked reference values after the change — all
  matched exactly.
- **Three missing `aria-label` translations** — the beam diagram's
  screen-reader description, the visualization reset button, and the
  mobile menu toggle were all still hardcoded English after the first
  conversion pass. Found by a dedicated `aria-label="[A-Z]` sweep across
  the codebase specifically because these don't show up in a visual
  read-through of the UI.

### Verification tooling itself had bugs — twice, caught and fixed

Building this phase's automated checks surfaced two real bugs in the
*checking scripts themselves*, not the code being checked — worth stating
plainly since the whole point of these checks is trustworthiness:

1. An early key-matching script's regex matched "word followed by colon"
   anywhere in a file, including inside English prose — `'The standard
   procedure, in order:'` and `"...a sieve analysis:"` produced phantom
   "extra key" reports for `order` and `analysis` that don't exist as
   dictionary keys at all. Diagnosed by direct inspection, fixed by
   switching to a line-start-anchored key check that prose text can't
   collide with.
2. An array-item-count script counted commas without tracking string
   boundaries, so English procedure-step text containing internal commas
   ("Arrange sieves in a stack, coarsest opening on top, finest on the
   bottom...") was miscounted as multiple array items — reporting 10
   "items" in a 6-item array, and one genuine-looking mismatch (11 vs 12)
   that was entirely an artifact. Fixed with a proper string-aware
   character scanner that ignores commas inside quotes.

Both are noted here rather than silently patched, because a checker that
was wrong twice deserves the same scrutiny as the code it's checking —
and because the fixes themselves (line-start anchoring, string-aware
scanning) are worth knowing about if this project's verification tooling
gets reused or extended later.

### Setup — two new things

**Environment**: no new environment variables.

**Schema**: `bodyBn` and two `descriptionBn` fields are new — same
migration commands as always:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

No Bengali lesson bodies were written in this phase (that's a content
task, explicitly deferred per an earlier scope decision) — the field
exists and the fallback-to-English path is verified working, but every
lesson currently displays in English even when Bengali is selected,
except for titles/descriptions which do have real Bengali translations.

### What's next (not in this phase)

The remaining 5 Part 6 visualizations (Reinforcement Details, Crack
Formation/Shear Failure, Water Flow, Earthquake Motion, Soil Layers) —
now building on top of this i18n foundation from the start, so their
dictionary sections get added alongside the components rather than
retrofitted. Separately: actual Bengali lesson body content (currently
falls back to English everywhere).

### A note on verification

Same no-network limitation as every prior phase — no `npm install`,
`prisma generate`, or `next dev` could run. This phase's verification
went further than prior phases in two ways: first, every calculation
file that was restructured to remove embedded presentation text was
re-verified against its original hand-checked reference values, not just
assumed unchanged by the refactor. Second, the automated checkers
themselves were debugged and fixed when their output looked suspicious
(detailed above) rather than trusted or dismissed — arriving at 222
cross-checked import bindings across 73 files with actual confidence in
that number, not just a script that happened to print "0 errors."

One specific claim worth flagging as unverified rather than confidently
asserted: `app/layout.tsx` reads `params.locale` to set `<html lang>`,
relying on Next.js App Router's documented behavior that a root layout
receives params from the full matched route, including segments defined
by child layouts. This is standard, documented behavior, not a guess —
but it's also the one piece of this phase's routing that most depends on
framework behavior I couldn't directly observe render. If `lang` doesn't
switch correctly between `/en/...` and `/bn/...` after `npm run dev`,
this is the first place to check.

---

## Phase 8 — Completing Part 6: Five More Visualizations

Completes the blueprint's Part 6 Visual Learning System — Reinforcement
Details, Crack Formation/Shear Failure, Water Flow, Earthquake Motion, and
Soil Layers. All ten visualizations from Part 6 that this platform set out
to build are now registered, seeded, and fully bilingual from the moment
each was written (built on the Phase 7 i18n foundation, not retrofitted).

### What's built

- **`Reinforcement Details`** (3D) — a beam cross-section with actual bar
  meshes positioned exactly where the calculation logic places them (not
  an illustration). Adjustable bar count shows the minimum-reinforcement
  check (ACI 318-19 §9.6.1.2) and the minimum-spacing check responding
  together, since a real design has to satisfy both simultaneously.
  Verified: a 300×500mm beam needs As,min=500mm², and a 4×20mm layout
  provides 1256.6mm² at 40mm clear spacing (vs. 25mm minimum) — comfortably
  passes both. Seeded into a newly-written **RCC Design** course.
- **`Crack Formation`** (2D) — reuses the exact beam physics from the
  homepage hero and Moment Diagram Explorer to show crack angle rotating
  from vertical (flexural, near midspan) to ~45° diagonal (shear, near
  supports) along the span — the same physics reason stirrup spacing
  isn't uniform in a real beam. Explicitly documented as a simplified
  teaching model (shear/moment ratio as a stress-ratio proxy), not a full
  Mohr's-circle derivation, stated plainly in both the code comments and
  the lesson text rather than presented as more rigorous than it is.
  Added to RCC Design, directly following Reinforcement Details.
- **`Water Flow`** (3D) — open-channel flow via Manning's Equation, with
  an animated water surface whose flow speed scales with the real
  computed velocity. Verified: a 2m-wide concrete channel at 0.8m depth
  carries ≈2.27 m³/s at ≈1.42 m/s; discharge increases monotonically with
  depth across a full range, the correct physical behavior. Seeded into a
  newly-written **Fluid Mechanics** course.
- **`Earthquake Motion`** (2D, animated) — a single-degree-of-freedom
  (SDOF) oscillator under harmonic ground shaking, demonstrating
  resonance: response amplitude spikes when the building's natural period
  matches the ground motion's period. Verified against the closed-form
  peak (DAF = 1/(2ζ) at exact resonance — 10.00 both ways for ζ=0.05).
  Seeded into a newly-written **Earthquake Engineering** course.
- **`Soil Layers`** (3D) — a stratified soil cross-section (sand/clay/dense
  sand) with a draggable depth probe showing Terzaghi's effective stress
  principle (σᵥ′ = σᵥ − u) building up through real layers and a water
  table. Verified: effective stress increases monotonically with depth
  and never exceeds total stress, the two required physical constraints;
  boundary-interpolation and mid-layer values cross-checked against each
  other for consistency. Added to Soil Mechanics, directly following
  Bearing Pressure — explicitly connects back to that lesson's
  foundation-sizing material.

### Two real gaps caught from Phase 7, fixed here

Reviewing the registry files while adding new entries surfaced that two
"not registered yet" fallback messages — in
`components/visualizations/registry.tsx` and `components/labs/registry.tsx`
— were still hardcoded English after the full i18n conversion in Phase 7.
Both fixed now, with a new `dict.lab.notRegistered` key added for the lab
registry's version (distinct from `dict.visualization.notRegistered`,
since they're genuinely different fallback states). Noting this
specifically because it's exactly the kind of gap that's easy to miss —
these fallback states only render when something's *not* wired up, so
they don't show up when testing the happy path.

### New courses written this phase

Three subjects that were "structure only" through Phase 7 now have full
content: **RCC Design** (Reinforcement Detailing + Shear/Crack modules),
**Fluid Mechanics** (Open Channel Flow), **Earthquake Engineering**
(Resonance and Structural Period). Each course's reading content was
checked against its visualization's actual default-state output before
being written, following the same practice established since Phase 4.

### Setup — nothing new required

No new npm packages, no schema changes. Same commands as always:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### What's left in Part 6 (for context, not a gap in what was promised)

The blueprint's Part 6 list includes a few items this batch's ten
visualizations already cover under a different name or fold into an
existing one — e.g. "Beam Action" (the homepage hero + Moment Diagram
Explorer), "Structural Behavior" (Column Buckling + Column Failure
together), "Bending Moment" (Moment Diagram Explorer). "Building
Structure," "Reinforcement Model," and "Construction Sequence" from the
Interactive Models sub-list remain unbuilt — they're more about full
3D building assemblies / sequencing animations than single-concept
physics visualizations, and would need their own scoping conversation
rather than fitting the same one-formula-one-visualization pattern this
batch and Phase 6 used.

## Phase 9 — Three More Labs: Compression, Atterberg Limits, Bitumen (blueprint Part 7 continued)

Continues the blueprint's Part 7 Experiment & Lab System the same way
Phase 8 completed Part 6 — filling in more of what was already scoped and
registered, rather than opening a new blueprint Part. Picked as the
natural next step because, unlike the big 3D building-assembly items left
in Part 6, expanding Part 7 fits the same one-lab-one-registry-entry
pattern every prior lab phase used, with no new scoping decisions needed.

### What's built

- **`Compression Test`** (Concrete) — 150mm cube compressive strength
  (load ÷ 22,500mm²), classified against a chosen grade (M15–M40) using a
  single-specimen acceptance margin generalized from ACI 318-19
  §26.12.3.1(b) (3.5 MPa for grades ≤ M35, 10% of fck above that).
  Verified: 495kN on M20 → 22.00 MPa, a clean pass; boundary-tested at
  exactly fck (450kN → 20.00 MPa) and exactly at the margin edge (371.25kN
  → 16.50 MPa) to confirm both boundaries are inclusive in the intended
  direction. Explicitly notes that full batch acceptance also needs the
  average of 3 consecutive tests — this report evaluates one cube at a
  time and says so. Added as a new **Hardened Concrete Strength** module
  in Building Materials, directly after Fresh Concrete Properties/Slump
  Test.
- **`Atterberg Limits`** (Soil) — Liquid Limit via genuine least-squares
  regression of moisture% against log₁₀(blow count) across 4 trials
  (read off the fitted line at N=25, not interpolated between the nearest
  two points), Plastic Limit as a direct thread-crumble reading, and
  Plasticity Index classified against the Casagrande A-line into
  CL/CH/ML/MH — with a distinct "non-plastic" result (PI < 4) rather than
  forcing a near-zero PI into either group. Verified: sample flow curve
  fits at R²=0.9988, LL≈37.5%, PI≈16.2 → classifies CL; four independent
  representative soils (typical CL/CH/ML/MH combinations) all classified
  as expected; A-line and LL=50 boundaries both checked for the correct
  side. New **Flow Curve** component reuses the Gradation Curve's
  log-space plotting technique, but draws a fitted straight line through
  scattered trial points rather than a curve through every point exactly
  — a deliberately different visual, because that distinction *is* the
  method. Added as a new **Fine-Grained Soil Classification** module in
  Soil Mechanics, directly after Particle Size & Gradation/Sieve
  Analysis, before Bearing Pressure.
- **`Bitumen Penetration Test`** (Highway) — standard needle penetration
  (100g, 25°C, 5s) averaged across 3 trials, with a repeatability check
  before any grade is reported, classified into standard grade bands
  (30/40, 40/50, 60/70, 80/100, 120/150). Verified: default trials
  [64,67,66] → 65.7 dmm, spread 3.0, classifies 60/70 — the grade most
  commonly specified by Bangladesh's RHD for general paving. Added as a
  new **Bitumen Grading** module in Highway Engineering, directly after
  Aggregate Quality for Pavement/Aggregate Impact Value.

### A real bug caught before any TypeScript was written

The first version of the bitumen grade classifier only checked "below
the lowest band" and "above the highest band" as fallback cases. Standard
penetration grades have genuine *gaps* between them (nothing standard
exists between 50–60 or 70–80 dmm), so a result like 55 dmm fell through
both fallback checks and was silently misclassified as "above-range."
Caught in the Python verification pass with a full boundary sweep across
every band edge and gap, before any of it reached TypeScript — fixed by
explicitly detecting and reporting the between-grades case rather than
forcing it into the nearest band.

### Setup — nothing new required

No new npm packages, no schema changes (`labKey` and the JSON `LabResult`
fields already cover arbitrary lab shapes). Same commands as always:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### What's left in Part 7 (for context, not a gap in what was promised)

Still unbuilt: Flexural (beam-break) Test for concrete; Compaction Test
and Direct Shear Test for soil; Traverse and Total Station for survey.
Traverse in particular is meaningfully more complex than this phase's
three (closure-error calculation across a full loop of stations, not a
single-reading or short-regression result) and would likely warrant its
own phase rather than bundling into a fourth slot here.

### A note on verification

Same no-network limitation as every prior phase — no `node_modules`
available, so full project-wide `tsc`/`next build` isn't possible here.
Verified in layers instead: all three calculation-logic files pass a
standalone strict `tsc` compile with zero dependencies and zero errors;
all four new UI components pass a strict `tsc` compile against
hand-written stub types for React/lucide-react/the dictionary hook, with
the only residual errors matching exactly what the same check produces
against the untouched, already-shipping `lab-frame.tsx` (confirming
those are stub-fidelity artifacts, not real issues); the full
`prisma/seed.ts` (1600+ lines) and the full `dictionary-type.ts` +
`en.ts` + `bn.ts` all pass a clean strict compile with zero errors,
including `en.ts`/`bn.ts` type-checking against the `Dictionary`
interface directly — which catches missing keys, extra keys, and
signature mismatches all at once, not just a manual count. Every `t.xxx`
dictionary reference in the new components was also cross-referenced by
name against both dictionaries and the interface. The project is now 90
TypeScript/TSX files.

## Phase 10 — Completing Part 7: Flexural, Compaction, Direct Shear, Total Station, Traverse

Finishes every lab left open at the end of Phase 9's "what's left in Part
7" note — including Traverse, flagged there as meaningfully more complex
and a likely candidate for its own phase. Built anyway, in full, per
explicit instruction to finish everything remaining in Part 7 before
moving to a new blueprint Part. Part 7 (Experiment & Lab System) is now
complete: 12 labs registered across Concrete, Soil, Highway, and Survey.

### What's built

- **`Flexural Test`** (Concrete) — third-point loading modulus of
  rupture, with the formula genuinely branching on where the beam
  fractures: R=PL/bd² inside the middle third, R=3Pa/bd² outside it
  (using actual distance to the nearest support), and an explicit
  "discard this result" outcome per ASTM C78 when fracture falls more
  than 5% of the span beyond the middle third. Verified: center-fracture
  default → 3.80 MPa (a plausible modulus of rupture, cross-checked
  against the ACI empirical relation fr≈0.62√f'c); boundary-swept the
  75mm middle-third edge and the 97.5mm discard threshold to confirm
  both transitions land exactly where the standard specifies. Added as a
  new **Flexural Strength** module in Building Materials, directly after
  Hardened Concrete Strength/Compression Test.
- **`Compaction Test`** (Soil) — Standard Proctor, dry density from wet
  mass and moisture content across 5 trials, OMC/MDD located by fitting
  a genuine least-squares parabola (not picking the best single
  reading) and solving for its vertex, checked against a
  zero-air-voids reference line. Verified: default trials → OMC≈12.63%,
  MDD≈1.720 g/cm³, both physically plausible and safely below ZAV at
  every point. Added as a new **Compaction** module in Soil Mechanics.
- **`Direct Shear Test`** (Soil) — Mohr-Coulomb envelope (c, φ) from
  linear regression across 3 normal-stress trials. Verified against a
  sand-like case (φ≈31°, c≈8 kPa) and a perfectly-linear synthetic case
  that recovers exact input parameters. Added as a new **Shear
  Strength** module in Soil Mechanics.
- **`Total Station Survey`** — radiation-method coordinate computation:
  slope distance + vertical angle → horizontal distance and
  trigonometric-leveling height difference; combined with bearing to
  give a target's full (N, E, elevation). Verified against three
  independently-computed geometry cases (level sight, uphill sight,
  downhill sight) with exact expected-value assertions, plus a
  bearing-360-equals-bearing-0 wraparound check. Added as a new **Total
  Station Survey** module in Surveying.
- **`Traverse Survey`** — closed-loop closure error and Bowditch
  (compass rule) adjustment across 5 legs: latitude/departure resolution
  per leg, linear misclosure, relative precision (1:N), and
  proportional correction that closes the adjusted coordinates back to
  the start exactly, by construction. Verified: a mathematically-perfect
  pentagon confirmed near-zero misclosure, then realistic small
  per-leg measurement error (±0.03–0.08m on 85m legs) produced a
  genuine, plausible 1:13,492 result — the first sample dataset
  attempted was rejected during verification for being unrealistic
  (1:15) before this one replaced it. Added as a new **Traverse Survey**
  module in Surveying, after Total Station Survey.

### Two more real bugs caught before any TypeScript was written

- **Compaction**: fitting a parabola through trial data that never
  actually traces a peak (dry density still rising, or still falling,
  across the whole tested range) produces a mathematically valid but
  physically meaningless vertex — one monotonic test case extrapolated
  to an OMC of 71%, far outside any real soil's range. Fixed by
  requiring the fitted peak to fall within (or just outside, by a small
  margin) the actual tested moisture range before trusting it;
  otherwise the lab reports "no peak captured" rather than a number.
- **Traverse**: an all-zero-distance leg set divides by zero in the
  Bowditch correction step (`distance / totalDistance`). Caught in the
  Python verification pass and guarded explicitly in the TypeScript
  logic — zero total distance now returns an explicit invalid-result
  case instead of crashing.

### A parabola fit, computed two ways, to close the loop on trust

Compaction's parabola fit needed a genuine least-squares solve, but
there's no numpy in TypeScript. Verified in Python with `numpy.polyfit`
first, then re-implemented by hand via a 3×3 Cramer's-rule solve of the
normal equations, then checked the two methods against each other
directly: coefficients matched to within 1e-13, and both the real-peak
and no-peak edge cases classified identically under both methods, before
the hand-rolled version was trusted enough to port into
`compaction-test-logic.ts`.

### Setup — nothing new required

No new npm packages, no schema changes — same three commands as always:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### Part 7 is now complete

Every lab scoped across Concrete (Slump, Compression, Flexural), Soil
(Sieve Analysis, Atterberg Limits, Compaction, Direct Shear), Highway
(Aggregate Impact Value, Bitumen Penetration), and Survey (Levelling,
Total Station, Traverse) is built, registered, and seeded into its
matching course. The next open scope is either Part 6's three remaining
large 3D assemblies (Building Structure, Reinforcement Model,
Construction Sequence — still flagged as needing their own scoping
conversation, not a drop-in registry entry) or an entirely
not-yet-started blueprint Part.

### A note on verification

Same no-network limitation as every prior phase. All five calculation
files were independently verified in Python before any TypeScript
existed, including two genuinely new verification techniques this
phase: boundary-sweeping a formula that branches on a physical
condition (Flexural's fracture-location threshold) across every
transition point, not just one example on each side; and cross-checking
a hand-rolled regression solver against a trusted library implementation
(`numpy.polyfit`) before porting it, rather than trusting the hand-rolled
math on its own. Every new UI component was checked with `tsc --strict`
against hand-written stub types, cross-referenced against both an
individually-declared-icons stub (clean) and, for one final pass, all 31
lab-directory files compiled together as a single program — which
surfaced only stub-quality artifacts (a weaker, Proxy-based
`lucide-react` stub in that one pass) that hit already-shipping,
untouched files exactly as hard as the new ones, confirming none of it
traced to real source code. The full `prisma/seed.ts` (now 1901 lines)
and the full `dictionary-type.ts` + `en.ts` + `bn.ts` all pass a clean
strict compile with zero errors, and all 12 `labKey` values in seed.ts
were cross-checked one-to-one against all 12 `LAB_REGISTRY` entries. The
project is now 103 TypeScript/TSX files.

## Phase 11 — Completing Part 6: Building Structure, Reinforcement Model, Construction Sequence

Finishes blueprint Part 6.3 ("Interactive Models") — the three items
flagged at the end of Phase 8 as needing their own scoping conversation
rather than fitting the one-formula-one-visualization pattern every prior
visualization used. They do fit a different pattern: all three render
views of one *shared* sample building rather than being three
disconnected demonstrations — explicitly scoped this way and confirmed
before any code was written, along with a fidelity-level choice (detailed
multi-material geometry, not the simpler schematic-box alternative also
offered).

### The shared building

A G+2 (ground + 2 upper floors) reinforced concrete frame, 3 bays × 2
bays (10.5m × 6.0m footprint, 9.0m height), proportioned to be
structurally plausible and checked independently before being written
into `building-model.ts`: beam depth (400mm) against the standard
span/depth deflection-control minimum for a 3.5m span (292mm), a rough
gross-section column capacity check against estimated 3-story tributary
load (demand/capacity ≈ 0.53, plausible — not absurdly oversized, not
dangerously tight), and footing size against an assumed 150kPa safe
bearing capacity (1.6m² footings comfortably clear of the 3.0–3.5m
column spacing). All grid, beam, slab, footing, and wall generation
logic was verified in Python first — every beam endpoint lands exactly
on a column grid point, every beam level exactly matches a column story
boundary — then the actual compiled TypeScript was run in Node and its
output cross-checked against the Python numbers directly (36 columns, 68
beams, 18 slabs, 12 footings, 30 walls, 164 total members; every
per-construction-stage count matched exactly), not just type-checked.

### What's built

- **`Building Structure`** — the full building rendered in detailed
  multi-material geometry: concrete frame, brick infill walls with real
  window and door openings, glass panes, a wood door. Openings are built
  without CSG boolean subtraction (not available in this Three.js
  version) — each wall panel decomposes into up to 4 solid sub-panels
  framing the opening (a "picture frame" technique), verified in Python
  to tile each wall's area exactly (solid panel area = wall area minus
  opening area, to the fourth decimal, for window, door, and blank-wall
  cases alike) before being trusted in the 3D scene. Controls toggle
  walls on/off (bare frame vs. finished building) and let stories be
  shown incrementally.
- **`Reinforcement Model`** — the same building with a solid/X-ray
  toggle: concrete becomes 15% opacity, rebar cages become visible.
  Column ties and beam stirrups are rendered as genuine rectangular
  loops (4 thin box segments each), not circles — an early draft used
  `torusGeometry` for speed, caught and corrected during review because
  a circular tie around a square column is geometrically wrong, not
  merely simplified, and "detailed fidelity" was the explicit request
  this phase. Longitudinal bars run each member's real full length; only
  tie/stirrup *frequency* is a stated simplification (a handful per
  member, not their real ~150–250mm code spacing — modeling every one
  across 36 columns and 68 beams would add thousands of meshes with no
  teaching value over showing the pattern clearly).
- **`Construction Sequence`** — the same building revealed through a
  10-stage stepper (excavation → footings → ground columns/plinth beams
  → 1st floor slab → 1st-story columns → 2nd floor slab → 2nd-story
  columns → roof slab → walls → parapet/finishing), each stage with real
  sequencing rationale (why columns finish before the slab that caps
  them, why walls come after the frame). Every one of the building's 164
  members is assigned to exactly one stage — verified in Python with
  zero unassigned members, zero duplicates, and a monotonically
  non-decreasing cumulative visible-member count stage over stage (a
  literal "the building never loses a piece already built" check on the
  sequence itself).

All three interactives were added to the existing **RCC Design** course
(not Structural Analysis — traced the actual file to find where
`reinforcement-details-visualizer` already lived, which corrected an
initial wrong assumption before any seed content was written) as a new
**Whole-Building Models** module, directly after Reinforcement Detailing
and Crack Formation.

### Setup — nothing new required

No new npm packages beyond what Reinforcement Details, Load Transfer,
and the other existing 3D visualizations already depend on
(`@react-three/fiber`, `@react-three/drei`), no schema changes:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### A note on verification

Same no-network limitation as every prior phase. This phase's
verification had a different shape than the labs': there's no single
formula to check against a known answer, so the building's *geometry
consistency* was verified instead — every beam endpoint on a real grid
point, every construction stage's member count summing to the whole,
wall-opening decomposition tiling exactly. Most notably, the shared data
model (`building-model.ts`) wasn't just type-checked but actually
**compiled to JavaScript and executed in Node**, with its real runtime
output (member counts, per-stage breakdowns, rebar offsets) compared
directly against the independent Python verification — a stronger check
than `tsc --strict` alone provides, since type-checking confirms a
function has the right shape but not that it computes the right numbers.
All three visualizer components, plus the shared geometry and model
files, pass a strict `tsc` compile against hand-written stub types for
React, `@react-three/fiber`, `@react-three/drei`, and the dictionary
hook — an early version of that check surfaced 100 apparent errors that
turned out to be a stub-completeness gap (a narrow `IntrinsicElements`
interface missing ordinary HTML tags), not real issues, caught by
fixing the stub and re-running to a clean result. The full
`prisma/seed.ts` (now 1982 lines) and the full `dictionary-type.ts` +
`en.ts` + `bn.ts` pass a clean strict compile with zero errors, and all
13 `interactiveKey` values in seed.ts were cross-checked one-to-one
against all 13 `VISUALIZATION_REGISTRY` entries. The project is now 108
TypeScript/TSX files.

## Phase 12 — Engineering Tools (blueprint Part 12, all 12 tools)

Starts a genuinely new blueprint Part rather than finishing an
already-open one — Part 6 and Part 7 were both fully complete after
Phase 11. Picked over the other unstarted Parts (5, 8, 9, 10, 11, 13,
15) for a concrete reason, not just convenience: `/tools` was already a
live link in the site header (`dict.nav.tools`) pointing at a route that
didn't exist yet — the only dead nav link, of the four checked
(`/practical`, `/tools`, `/ai`, `/community`), that's fully buildable
end-to-end with verified engineering logic and no real photos, live AI
API access, or social/user-generated infrastructure required.

### What's built

All 12 tools from blueprint 12.1–12.3, every formula independently
verified in Python before any TypeScript existed, then the actual
compiled TypeScript **run in Node** and cross-checked against the
Python output directly (not just type-checked) for all 12:

- **Basic (12.1):** Unit Converter (length/area/volume/mass/pressure/
  force, including Bangladesh's katha land unit), Area Calculator
  (rectangle/triangle/circle/trapezoid), Volume Calculator (box/
  cylinder/cone/sphere, plus the average-end-area earthwork cut/fill
  method).
- **Civil (12.2):** Steel Weight Calculator (exact physics, cross-
  checked against the d²/162.2 industry rule of thumb to within
  0.01%), Concrete Calculator (mix-ratio quantities with stated dry-
  volume-factor and cement-density assumptions), Brick Calculator
  (wall volume ÷ brick+mortar unit volume, with brick size and mortar
  thickness as tunable inputs), Stair Calculator (riser/tread from the
  2R+T≈600mm walking-line comfort rule), Slope Calculator (ratio ↔
  percent ↔ angle, exact trig), Water Tank Calculator (demand-based
  sizing into a cylindrical or rectangular tank).
- **Advanced (12.3):** Beam Calculator (simply-supported, UDL + point
  load, max moment/shear via support reactions — verified to correctly
  identify which support governs even when a point load sits close to
  one end, not just for the symmetric textbook case), Load Calculator
  (BNBC 2020 / ACI 318-19 strength-level combination, 1.2D+1.6L),
  Soil Bearing Calculator (Terzaghi's bearing capacity equation).

New shared **`ToolFrame`** chrome (title, optional reference note,
inputs panel, results panel) — deliberately simpler than `LabFrame`
(no equipment/procedure staging — there's no physical apparatus for a
calculator) and simpler than `VisualizationFrame` (no canvas — most of
these are a straight calculation, not something inherently spatial).
New routes: `/tools` (grid listing, grouped by category) and
`/tools/[toolSlug]` (individual tool), following the same server-
component-renders-client-component pattern already used by the lesson
viewer for labs and visualizations. Tools are deliberately **stateless
utilities** this phase — no save-to-database, no lesson/course tie-in
— a scoped decision stated here rather than left implicit, matching
Part 12's own framing as quick everyday calculators, not graded lab
exercises.

### A real bug caught before any TypeScript was written

The Soil Bearing Calculator's Nc and Nq bearing capacity factors have
clean closed-form expressions that matched the standard published
Terzaghi table closely (checked to within 0.1 at every table entry).
Nγ does not — Terzaghi derived it graphically in 1943, which is exactly
why every geotechnical textbook tabulates it rather than computing it.
A first-draft closed-form approximation for Nγ (a Meyerhof-style
`(Nq-1)tan(1.4φ)` formula) was off by as much as 30% against the
standard table at some friction angles. Caught during the Python
verification pass, before any TypeScript existed, and replaced with
the actual tabulated Terzaghi values (general shear case), linearly
interpolated between table entries — verified for monotonicity across
every interval and exact agreement at table boundaries.

### Setup — one new dependency category, otherwise nothing new

No schema changes (tools don't persist to the database this phase).
The tools use only packages already present for the rest of the site
(`lucide-react` for icons); no new npm install required:

```bash
npx prisma generate
```

### A note on verification

Same no-network limitation as every prior phase. All 12 calculation-
logic files pass a standalone strict `tsc` compile with zero errors,
then were compiled to real JavaScript and **executed in Node**, with
every result cross-checked against independent Python verification
directly — including the Beam Calculator's support-reaction logic,
specifically re-verified against an asymmetric case (a point load
positioned near one support, combined with a UDL) after an
implementation change mid-build, to confirm the more general
"maximum of the two combined support reactions" approach — rather
than summing each load type's own individual maximum — was still
correct, not just correct by coincidence for the symmetric textbook
case. All 12 tool UI components, the shared `ToolFrame`, the registry,
and both route pages pass a strict `tsc` compile against hand-written
stub types for React, `lucide-react`, and the dictionary hook, with
zero errors beyond the same stub-fidelity artifacts documented in
every prior phase (JSX-runtime module resolution, implicit-any on
untyped DOM event parameters). The full `dictionary-type.ts` + `en.ts`
+ `bn.ts`, including the complete new `tools` namespace (13 sections),
pass a clean strict compile against the `Dictionary` interface, and
every dictionary key referenced by name in all 12 tool components and
both route pages was cross-checked against the definitions. The
project is now 136 TypeScript/TSX files.

## Phase 13 — Tools Save-to-History (completing what Phase 12 explicitly deferred)

Phase 12 shipped all 12 tools as stateless calculators and said so
plainly rather than leaving it implicit: "no save-to-database, no
lesson/course tie-in." This phase closes that gap, finishing Part 12
before opening any new scope — the same instinct as Phase 5 and Phase
10 finishing out Part 7's remaining labs, and Phase 11 finishing Part
6's remaining interactive models, rather than leaving a phase's own
stated leftovers for later.

### What's built

- **`ToolResult` model** — new, alongside `LabResult` rather than
  reusing it, because `LabResult.lessonId` is a required foreign key
  to `Lesson`, and tools aren't lessons: they're standalone utilities
  defined in a static TypeScript registry
  (`components/tools/registry.tsx`), not database-backed content.
  `ToolResult.toolSlug` is a plain string for the same reason
  `Lesson.labKey`/`interactiveKey` are plain strings, not foreign
  keys — the thing being referenced lives in code, not a table.
- **`/api/tools/[toolSlug]/save`** — POST to save, GET to list recent
  results, mirroring `/api/lessons/[lessonId]/lab-result` field-for-
  field (auth check, `inputData`/`results` JSON blobs, same 401/400
  responses).
- **Save logic centralized in `ToolFrame`**, not duplicated per tool —
  a deliberate difference from how labs handle it. Each lab file
  already carries its own multi-stage flow (equipment → procedure →
  data-entry → report) and reasonably owns its save button as part of
  that flow. Every tool's save behavior is identical by contrast — POST
  `inputData`+`results`, show saved/error state — so centralizing it
  in the shared frame means 12 tools stay simple (pass a `saveConfig`
  object) instead of reimplementing the same fetch/loading/error
  boilerplate 12 times. `ToolFrame` now takes an optional `saveConfig:
  { toolSlug, loggedIn, inputData, results }` and renders the save
  footer only when it's provided.
- All 12 tool components updated to accept a `loggedIn` prop (threaded
  from the tool detail page, which now calls `getCurrentUser()` — the
  same server-side auth check every lesson page already does) and pass
  their current inputs/results through to `ToolFrame`.

No new dictionary keys were needed — the save UI reuses
`dict.lab.loginToSave`/`saveError`/`savedToHistory`/`saveThisRun`/
`saveReport`/`saving` and `dict.dashboard.saved` directly, since
"save this calculation" is exactly the same user-facing concept for a
tool as it already is for a lab, confirmed present before reuse rather
than assumed.

### Setup — one schema change

```bash
npx prisma db push
npx prisma generate
```

### A note on verification

Same no-network limitation as every prior phase. The updated
`ToolFrame`, the registry's updated `ToolMeta` type, and all 12 tool
components pass a strict `tsc` compile with zero new errors introduced
— the exact same stub-fidelity error count (14 JSX-runtime, 9
implicit-any-on-event-handlers) as the pre-change baseline, confirming
the `loggedIn`/`saveConfig` wiring didn't break anything already
verified clean in Phase 12. The new API route and the tool detail
page's conversion to an async server component (to call
`getCurrentUser()`) were checked against hand-written stubs for
`next/server`, `next/navigation`, and the project's auth/prisma
modules, with zero errors. `prisma/schema.prisma`'s brace balance was
checked directly, and the new `ToolResult` model's shape was compared
field-by-field against the existing, already-working `LabResult`
model rather than designed from scratch. The project is now 137
TypeScript/TSX files.

## Phase 14 — Practice & Exam System (blueprint Part 14)

Another genuinely new blueprint Part, chosen for the same kind of
concrete reason Part 12 was — `Quiz`, `Question`, and `QuizAttempt`
were already fully scaffolded in `prisma/schema.prisma` with zero
routes, components, or nav entry referencing any of them anywhere in
the codebase. Picked over content-heavy Parts (9, 10) still open after
the person confirmed Bengali lesson-body translation should wait,
since building the quiz *mechanics* — scoring, timing, auto-evaluation
— is systems work in the same vein as every phase so far, not the
long-form writing task that was explicitly deferred.

### What's built

Three question types this phase — **MCQ** and **Numerical** are
auto-graded; **CQ** (Creative Questions, the standard Bangladesh
curriculum format: a stimulus with knowledge/comprehension/
application/higher-order-thinking sub-parts) is self-reviewed against
a shown model answer, since free-text grading isn't something this can
auto-check reliably. Viva/Interview question banks and Mock Test
bundling are a natural next addition, not built this phase — stated
here rather than left implicit.

- **Scoring engine** (`quiz-logic.ts`) — MCQ exact-match (order-
  independent for multi-select), Numerical percent-tolerance matching,
  and a combined score that only counts auto-gradable questions
  (a CQ-only quiz correctly reports "no auto-graded score" rather than
  0%). A genuine floating-point bug was caught here — see below.
- **Timed exams** — countdown from `Quiz.timedSeconds`, clamped to
  never go negative or exceed the total, with a live per-second display
  and automatic submission at zero.
- **Quiz-taking flow** — one question at a time with a progress bar,
  Previous/Next navigation, and a results screen with per-question
  review (correct/incorrect/not-yet-self-reviewed).
- **New routes**: `/practice` (listing, grouped by category — real
  Prisma queries via a new `lib/queries/practice.ts`, matching the
  existing `lib/queries/learning.ts` convention) and
  `/practice/[quizId]` (take a quiz). Added `/practice` to the site nav
  (`dict.nav.practice`) — unlike `/tools`, this one wasn't already a
  dead link waiting to be filled, so adding the nav entry is this
  phase's own addition, not a restoration.
- **`/api/quizzes/[quizId]/attempt`** — POST to record a finished
  attempt, mirroring the lab-result and tool-result save routes.
- **Two real quizzes seeded** — "Structural Analysis Fundamentals" and
  "Geotechnical & Materials Basics," 10 questions total. Every
  numerical answer reuses a value already independently verified
  elsewhere in this platform's build — the beam moment/shear from the
  Beam Calculator, the bearing capacity from the Soil Bearing
  Calculator, the bar weight from the Steel Weight Calculator — rather
  than being computed fresh for the quiz, so a quiz answer can never
  quietly drift from the tool that taught the same number. A starting
  set, not comprehensive coverage across every subject — the same
  "structure now, content later" honesty as the rest of this seed
  file.

### A real bug caught before any TypeScript was written

The numerical-answer tolerance check (`diffPercent <= tolerancePercent`)
rejected a value sitting exactly at the tolerance boundary — 45.45
against a target of 45.0 with 1% tolerance computed to
`1.0000000000000062`, not exactly `1.0`, due to ordinary
floating-point division and multiplication rounding. Caught in the
Python verification pass before any TypeScript existed and fixed with
the same small-epsilon pattern already used in the Bitumen Test's
repeatability check (`<= tolerancePercent + EPS`) — a genuine
recurrence of a bug class this platform has hit before, not a new
category of mistake.

### Setup — no new dependency, one schema push if not already current

`Quiz`/`Question`/`QuizAttempt` already existed in the schema before
this phase — only `ToolResult` (Phase 13) needed pushing if that
hasn't been run yet:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### A note on verification

Same no-network limitation as every prior phase. The scoring engine
was verified the same way Phase 11's building-model and Phase 12's
tools were — not just type-checked, but **compiled to JavaScript and
executed in Node**, run against a perfect attempt (100%), a realistic
near-miss attempt (one answer just outside tolerance, correctly scored
75% with that specific question flagged wrong), and an all-wrong
attempt (0%, with an unanswered CQ correctly showing "not yet
reviewed" rather than "incorrect") — checking the actual scoring
behavior end-to-end, not just that the function compiles. All new
files — `quiz-logic.ts`, `quiz-taking.tsx`, the query layer, both
routes, and the API route — pass a strict `tsc` compile against
hand-written stubs, confirmed clean both in isolation and, for the
page-to-component boundary specifically, with real local files
resolved via `--baseUrl` rather than stubbed out (the same technique
that gave a clean confirmation for the Tools registry in Phase 12).
The full `dictionary-type.ts` + `en.ts` + `bn.ts`, including the new
`practice` namespace and the updated `nav` namespace, pass a clean
strict compile with matching keys confirmed across all three files.
`prisma/seed.ts` (now 2132 lines, including the new quiz-seeding
section) passes a clean strict compile, and every numerical answer
seeded was independently recomputed in Python immediately before
writing it into the seed data, rather than copied from memory of
earlier phases. The project is now 143 TypeScript/TSX files.

## Phase 15 — Dashboard Wired to Real Data (no new blueprint Part — closing a gap the previous 14 phases all fed into)

Not a new blueprint Part — a different kind of "next step." A schema
sweep (checking which Prisma models had zero references anywhere in
application code, the same signal that found Quiz before Phase 14)
turned up `DailyGoal` and `ActivityEvent`, both unused — but this time
the more telling find was the dashboard page itself: every stat was a
hardcoded literal (`value="0"`, `value="—"`), including a code comment
already flagging it — *"once this section wires up to real
CourseProgress data, it should read Subject.title/titleBn from the
database"* — left by an earlier phase as an explicit, self-documented
TODO. Phase 4 built the courses. Phases 6, 7, 9, 10, 12, 14 built
visualizations, labs, tools, and quizzes that all write completion and
result records. None of it had ever reached the one page meant to
show a learner their own progress.

### What's built

- **`CourseProgress` actually stays in sync.** `markLessonComplete`
  previously only touched `LessonProgress` — `CourseProgress.
  percentComplete` was written by nothing, anywhere, ever. It's now
  recomputed from a real count (completed lessons ÷ total lessons in
  that course) on every completion change, not incremented by one per
  call — incrementing would drift out of sync the moment a lesson was
  marked complete twice or a course's lesson count changed later.
- **Activity logging, centralized.** A new `logActivityEvent` helper,
  called from lesson completion and from the lab-result, tool-result,
  and quiz-attempt save routes alike — one shared definition of "the
  user did something today," not four routes independently deciding
  whether their action counts toward a streak.
- **Streak calculation** — consecutive calendar days of activity
  ending at the most recent activity day, broken (reset to zero) only
  by missing a *full* day, not simply by "haven't done anything yet
  today" (today isn't over). Verified against seven cases including a
  gap in the middle of an activity run (confirms the streak stops
  exactly at the gap, not the older run beyond it) and the "yesterday
  but not yet today" case specifically, since that's the one most
  streak implementations get wrong in either direction.
- **Quiz average, skill-level, and per-subject skill progress** — all
  computed from real `QuizAttempt` and `CourseProgress` records. Skill
  level (beginner/intermediate/advanced) is a stated, simple derivation
  from overall average progress — not a blueprint-specified algorithm,
  said so directly rather than presented as if it were one.
- **`DailyGoal` get/update API** (`/api/dashboard/daily-goal`) — reads
  and writes a per-user target; the dashboard's streak card now shows
  the real configured target instead of a hardcoded "30."
- **Dashboard page converted from a static client component to an
  async server component** — matching the pattern every other data-
  bearing page in this codebase already uses (`/learning`, `/tools`,
  `/practice`), rather than being the one page that still faked its
  data client-side with no fetch at all.
- Notifications, Saved, Upcoming Live Classes, and AI Chat History stay
  as empty states this phase — there's no backing model for
  notifications yet, and `Post`/`AiChatSession` remain as unwired as
  `DailyGoal`/`ActivityEvent` were before this phase. Left as-is
  rather than half-wired, consistent with "structure now, content
  later."

### Setup — no schema changes

Every model this phase uses (`DailyGoal`, `ActivityEvent`,
`CourseProgress`, `LessonProgress`, `QuizAttempt`) already existed —
this phase is entirely application code:

```bash
npx prisma generate
```

### A note on verification

Same no-network limitation as every prior phase. The streak
calculation, course-percent, quiz-average, and daily-goal-progress
functions were verified in Python first (seven streak cases, four
percent-complete cases including the 0/0 division guard, three
quiz-average cases including the all-null/no-attempts case), then the
actual TypeScript was compiled to JavaScript and **run in Node**
against the identical inputs, with output compared line-for-line
against the Python results — not just type-checked. All modified and
new files — the dashboard query layer, the activity-logging helper,
the updated `learning.ts`, the three updated save routes, the new
daily-goal route, and the converted dashboard page — pass a strict
`tsc` compile with real local files resolved (not stubbed) via the
same `--baseUrl` technique that gave clean confirmations in Phases 12
and 14; an earlier pass with weaker stubs surfaced four apparent
errors that all traced to stub fidelity (a bare `prisma: any` losing
real Prisma Client return types, plus `@/` path-alias resolution) —
confirmed by the fact that using real files instead of stubs made
every one of them disappear. The full `dictionary-type.ts` + `en.ts` +
`bn.ts`, including the updated `dashboard` namespace (7 new keys), pass
a clean strict compile with matching keys confirmed across all three
files, and the stale placeholder copy ("Once the Learning System
ships…") that predated the Learning System's own existence was caught
and rewritten while touching that section, not left in place. The
project is now 146 TypeScript/TSX files.

## Phase 16 — Search System (blueprint Part 21)

A directly requested blueprint Part this time, not a self-chosen one —
Smart Search, Topic Search, Formula Search, Course Search, Engineering
Term Search, and AI Search, per the blueprint's own six-item list. A
genuine blank slate: no nav entry, no dictionary key, no schema model
anticipated any of this beforehand, unlike Tools (`/tools` was already
a dead nav link) or Practice (`Quiz` already existed in the schema).

### What "Smart Search" means here

One relevance-ranked result list merged from every real source —
courses, lessons, tools, formulas, and terms — rather than a separate
seventh feature layered on top of the other five. A single scoring
function (`scoreMatch`, in `lib/search/scoring.ts`) ranks all of them
consistently: exact title match scores highest, then title-starts-
with, then title-contains, then description match, then body match —
verified against seven cases (including case/whitespace normalization
and a multi-item ranking check) before being wired into the unified
query layer.

### What's built

- **Course Search & Topic Search** — real Prisma queries against
  `Course`/`Lesson` (case-insensitive `contains` across both English
  and Bengali fields, PostgreSQL-native) narrow candidates at the
  database level, then the same `scoreMatch` ranking re-sorts that
  smaller set by relevance. Topic Search specifically — browsing by
  subject rather than a text query — is served by the existing
  `/learning` page's subject grouping plus a new `searchByTopic()`
  query function, rather than a redundant parallel browse UI; every
  course result in unified search is also tagged with its subject as
  the visible category, so topic context surfaces everywhere, not just
  in one dedicated place. Stated here as the interpretation taken,
  not left ambiguous.
- **Formula Search** — a new 17-entry reference dataset
  (`lib/search/formulas.ts`), browsable at `/search/formulas`. Every
  formula was already independently verified in Python at the point it
  was first built into this platform across Phases 9–15 — this file
  restates them for reference and links back to the calculator or lab
  that uses each one (`relatedToolSlug`/`relatedLabSlug`, kept as two
  separate fields after an early draft mixed lab slugs and tool slugs
  under one name — caught and fixed by cross-checking all 10 slugs
  against the real `TOOL_REGISTRY`/`LAB_REGISTRY` one by one before
  trusting either field). Nothing here is a new, unverified formula.
- **Engineering Term Search** — a new 23-term glossary
  (`lib/search/terms.ts`), browsable at `/search/terms`. Definitions
  restate how each term was already explained in the lesson content
  that first taught it, not fresh independent definitions that could
  drift from what a learner already read.
- **A search entry point in the site header** (desktop icon + mobile
  menu item) — genuinely new nav, not a restoration, since nothing
  pointed here before.
- **`/search`** — debounced live query (300ms), category filter tabs
  that only show categories with actual results, links out to the
  dedicated formula/term browse pages.

### AI Search — built honestly, not built to look finished

`/api/search/ai` is a real route that returns a real, correct
`501 Not Implemented`-style response, not a fake success. Every other
piece of this Search System is deterministic and fully verifiable
offline; natural-language AI search needs a live LLM API call this
environment has no access to and no way to test — shipping a response
that merely *looks* like AI search would actively mislead a learner
with an unverifiable or hallucinated result, which is worse than
shipping nothing. The route file documents exactly what plugging in a
real provider would take (API key, calling `unifiedSearch()` for
candidate context rather than asking a model to invent results from
nothing, updating the frontend's "not configured" notice). The search
page itself shows this notice plainly rather than hiding the gap.

### Setup — no schema changes

Formulas and terms are static TypeScript data, not database tables; no
new Prisma models:

```bash
npx prisma generate
```

### A note on verification

Same no-network limitation as every prior phase. The scoring function
was verified in Python first (eight cases: exact/starts-with/contains/
description-match/body-match/no-match/empty-query/case-normalization,
plus a multi-item ranking check), then the actual TypeScript was
compiled and **run in Node** against the identical cases, matching
exactly. A real data-integrity bug was caught and fixed before any
compile check: an early draft of the formula reference stored every
related feature under one `relatedToolSlug` field, which silently
mixed in three entries that actually pointed to Labs, not Tools
(Flexural Test, Atterberg Limits, Traverse) — caught by cross-
referencing all ten related-feature slugs against the real
`TOOL_REGISTRY` and `LAB_REGISTRY` contents directly, not by
inspection, and fixed by splitting into `relatedToolSlug` and
`relatedLabSlug`. A nullable-field type mismatch (`Course.description`
is optional in the schema; the search result type wasn't) was also
caught at this stage and fixed with an explicit fallback rather than
a silent `as` cast. All new files — the scoring/formula/term modules,
the unified query layer, all three search pages, both API routes, and
the updated site header — pass a strict `tsc` compile with real local
files resolved via `--baseUrl` rather than stubbed, the same
confirmation method used since Phase 12. The full `dictionary-type.ts`
+ `en.ts` + `bn.ts`, including the new `search` namespace (19 keys)
and the updated `nav` namespace, pass a clean strict compile with
matching keys confirmed across all three files. The project is now
155 TypeScript/TSX files.




