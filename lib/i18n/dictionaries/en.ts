import type { Dictionary } from '../dictionary-type';

const en: Dictionary = {
  nav: {
    learning: 'Learning',
    practical: 'Practical',
    tools: 'Tools',
    practice: 'Practice',
    search: 'Search',
    aiAssistant: 'AI Assistant',
    community: 'Community',
    login: 'Log in',
    startLearning: 'Start learning',
    dashboard: 'Dashboard',
    visualizations: 'Visualizations',
    resources: 'Resources',
    materials: 'Materials',
    premium: 'Premium',
    projects: 'Projects',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  footer: {
    tagline: 'Built to BNBC 2020 standards. From first principles to production-ready engineering tools.',
    platformHeading: 'Platform',
    ecosystemHeading: 'Ecosystem',
    communityHeading: 'Community',
    discussions: 'Discussions',
    sharedProjects: 'Shared Projects',
    careerHub: 'Career Hub',
    copyright: 'CivilLearn. Reference: BNBC 2020 · ACI 318-19.',
  },
  hero: {
    badge: 'BNBC 2020 · ACI 318-19 aligned',
    titleLine1: 'Structural thinking,',
    titleLine2: 'not just structural facts.',
    description:
      'From beam theory to BNBC-compliant design — learn civil engineering the way it actually behaves: visually, interactively, and grounded in real site practice.',
    startLearning: 'Start learning',
    browseCurriculum: 'Browse curriculum',
    beamCaption: "Drag the load — this is a live diagram, not a picture",
    beamDiagramAria: 'Interactive simply-supported beam with draggable point load and live bending-moment diagram',
  },
  home: {
    coursesEyebrow: 'Curriculum',
    coursesTitle: 'Featured courses',
    coursesDescription:
      'Structural, geotechnical, transportation, and construction engineering — from fundamentals to BNBC-compliant design.',
    practicalEyebrow: 'Practical Engineering Hub',
    practicalTitle: 'Learn from the site, not just the textbook',
    practicalDescription:
      'Real site photos, videos, mistakes, and case studies — reinforcement work, concrete technology, foundation systems.',
    labEyebrow: 'Experiment & Lab',
    labTitle: 'Virtual labs, real procedures',
    labDescription:
      'Concrete, soil, highway, and survey labs with step-by-step simulation and auto-generated reports.',
    toolsEyebrow: 'Engineering Tools',
    toolsTitle: 'Calculators built for the job site',
    toolsDescription:
      'Unit conversion, steel weight, concrete volume, load and soil-bearing calculators.',
    aiEyebrow: 'AI Engineering Assistant',
    aiTitle: 'Stuck on a problem? Ask.',
    aiDescription: 'Formula explanations, step-by-step problem solving, and site-issue guidance.',
    communityEyebrow: 'Community',
    communityTitle: 'Ask, share, and learn together',
    communityDescription:
      'Student and engineer communities, project sharing, and mentor support.',
    comingLater: 'ships in a later phase.',
    cards: {
      structuralAnalysisTitle: 'Structural Analysis',
      soilMechanicsTitle: 'Soil Mechanics',
      rccDesignTitle: 'RCC Design',
      coursesLandHere: 'Courses land here once the Learning System backend is wired up.',
      siteWorkTitle: 'Site Work',
      siteWorkDesc: 'Excavation through finishing — populated once site-content module ships.',
      reinforcementTitle: 'Reinforcement',
      reinforcementDesc: 'Bar bending, lapping, anchorage — populated once site-content module ships.',
      concreteTechTitle: 'Concrete Technology',
      concreteTechDesc: 'Mix design through curing — populated once site-content module ships.',
      concreteLabTitle: 'Concrete Lab',
      concreteLabDesc: 'Slump, compression, flexural tests — lab engine ships in a later phase.',
      soilLabTitle: 'Soil Lab',
      soilLabDesc: 'Sieve analysis, Atterberg limits — lab engine ships in a later phase.',
      steelWeightCalcTitle: 'Steel Weight Calculator',
      concreteCalcTitle: 'Concrete Calculator',
      loadCalcTitle: 'Load Calculator',
      soilBearingCalcTitle: 'Soil Bearing Calculator',
      toolsShipLater: 'Tools ship with the Math Engine integration in a later phase.',
      aiTutorTitle: 'AI Tutor',
      aiProblemSolverTitle: 'AI Problem Solver',
      aiShipsLater: 'Wired up once the OpenAI API integration lands.',
      discussionsTitle: 'Discussions',
      engineeringNewsTitle: 'Engineering News',
      topContributorsTitle: 'Top Contributors',
      communityShipsLater: 'Community backend arrives in a later phase.',
    },
  },
  auth: {
    welcomeBack: 'Welcome back',
    loginDescription: "Log in to continue where you left off.",
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    createAccount: 'Create your account',
    signupDescription: 'Start with structural thinking, not memorization.',
    haveAccount: 'Already have an account?',
    logIn: 'Log in',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    passwordPlaceholderNew: 'At least 8 characters',
    fullName: 'Full name',
    fullNamePlaceholder: 'Miftahul Islam',
    or: 'OR',
    continueWithGoogle: 'Continue with Google',
    loggingIn: 'Logging in…',
    creatingAccount: 'Creating account…',
    errorGeneric: 'Something went wrong. Please try again.',
    errorWrongPassword: 'Incorrect email or password.',
    errorUserNotFound: 'No account found with that email.',
    errorTooManyRequests: 'Too many attempts. Please wait a moment and try again.',
    errorEmailInUse: 'An account with that email already exists.',
    errorWeakPassword: 'Please choose a stronger password.',
    errorInvalidEmail: 'Please enter a valid email address.',
    errorPasswordLength: 'Password must be at least 8 characters.',
    errorGoogleFailed: 'Google sign-in failed. Please try again.',
  },
  dashboard: {
    welcomeBack: 'Welcome back',
    welcomeBackName: (name) => `Welcome back, ${name}`,
    courses: 'Courses',
    notStartedYet: 'Not started yet',
    streak: 'Streak',
    days: 'days',
    dailyLearningGoal: 'Daily learning goal',
    skillLevel: 'Skill level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    acrossAllSubjects: 'Across all subjects',
    quizAverage: 'Quiz avg.',
    noAttemptsYet: 'No attempts yet',
    basedOnAttempts: (n) => `Based on ${n} attempt${n === 1 ? '' : 's'}`,
    continueLearning: 'Continue learning',
    noCoursesInProgress: 'No courses in progress',
    noCoursesDescription: 'Start any lesson in the Learning System and it will show up here with a resume point.',
    resumeLesson: 'Resume lesson',
    dailyGoalMinutesLabel: (minutes) => `${minutes} min/day goal`,
    skillProgress: 'Skill progress',
    modulesCount: 'modules',
    notifications: 'Notifications',
    allCaughtUp: "You're all caught up",
    notificationsDescription: 'Course updates and reminders will appear here.',
    saved: 'Saved',
    nothingSaved: 'Nothing saved yet',
    savedDescription: 'Bookmark notes, projects, and lessons to find them quickly.',
    upcomingLiveClasses: 'Upcoming live classes',
    noClassesScheduled: 'No classes scheduled',
    liveClassesDescription: 'Live Learning ships in a later phase.',
    aiChatHistory: 'AI chat history',
    noConversationsYet: 'No conversations yet',
    aiChatDescription: 'Your AI Assistant sessions will be listed here.',
    overview: 'Overview',
    practical: 'Practical',
    labNav: 'Experiment & Lab',
    toolsNav: 'Tools',
    aiNav: 'AI Assistant',
    communityNav: 'Community',
    certificates: 'Certificates',
    settings: 'Settings',
    logOut: 'Log out',
    notificationsAria: 'Notifications',
  },
  profile: {
    pageTitle: 'Profile',
    signedInAs: 'Signed in as',
    roleLabel: 'I am a...',
    roleSelfDeclaredNote: 'Self-declared — used only to tailor what the platform shows you, not verified against any record.',
    roleStudent: 'Student',
    roleEngineer: 'Engineer',
    roleTeacher: 'Teacher',
    roleProfessional: 'Professional',
    skillLevelHeading: 'Skill Level',
    skillProgressHeading: 'Skill Progress by Subject',
    noSkillProgressYet: 'Start a course to see your skill progress by subject here.',
    learningHistoryHeading: 'Learning History',
    lessonsCompletedCount: (n) => `${n} lesson${n === 1 ? '' : 's'} completed`,
    noHistoryYet: 'No lessons completed yet',
    noHistoryDescription: 'Finish your first lesson and it will show up here.',
    activityStatsHeading: 'Activity',
    currentStreak: 'Current streak',
    quizzesAttempted: 'Quizzes attempted',
    labResultsSaved: 'Lab results saved',
    toolResultsSaved: 'Tool results saved',
    certificatesHeading: 'Certificates & Achievements',
    noCertificatesYet: 'No certificates yet',
    certificatesEmptyHint: 'Complete a course or earn a badge to see them here.',
    certificatesSummary: (certs, badges) => `${certs} certificate${certs === 1 ? '' : 's'} · ${badges} badge${badges === 1 ? '' : 's'} earned`,
    viewCertificates: 'View all certificates & badges',
    signOutButton: 'Sign out',
  },
  learning: {
    curriculumEyebrow: 'Learning System',
    curriculumTitle: 'Curriculum',
    curriculumDescription:
      'Eight subject areas, from first-year mathematics through BNBC-compliant structural design.',
    courseCount: (n) => `${n} course${n !== 1 ? 's' : ''}`,
    moduleCount: (n) => `${n} module${n !== 1 ? 's' : ''}`,
    structureOnly: 'structure only',
    backToCurriculum: 'Curriculum',
    startCourse: 'Start course',
    continueCourse: 'Continue course',
    noLessonsYet: 'No lessons yet',
    percentComplete: (pct, done, total) => `${pct}% complete · ${done}/${total} lessons`,
  },
  lesson: {
    minutes: (n) => `${n} min`,
    markComplete: 'Mark as complete',
    completed: 'Completed',
    loginToTrack: 'Log in to track your progress through this lesson.',
    previous: 'Previous',
    next: 'Next',
    finishCourse: 'Finish course',
    readingNotWritten:
      "This lesson's content hasn't been written yet — it's seeded as structure so the course outline is real, but the reading material lands in a later phase.",
    videoNotWired:
      'Video player wires up once the Multimedia System (blueprint Part 23) ships. This slot is reserved and correctly typed.',
    interactiveNotWired:
      'Interactive visualization wires up once the Visual Learning System (blueprint Part 6) ships.',
    labNotWired:
      'Virtual lab simulation wires up once the Experiment & Lab System (blueprint Part 7) ships.',
  },
  visualization: {
    notRegistered:
      'This lesson is marked interactive, but no visualization is registered for it yet.',
    resetAria: 'Reset visualization',
  },
  visualizations: {
    momentDiagram: {
      title: 'Moment Diagram Explorer',
      reference: 'Simply-supported beam, single point load',
      loadPositionLabel: 'Load position (a)',
    },
    columnBuckling: {
      title: 'Column Buckling Visualizer',
      reference: 'Euler buckling — P_cr = π²EI / (KL)²',
      slendernessLabel: 'Slenderness (KL/r)',
      shortColumn: 'Short column — crushing governs',
      intermediate: 'Intermediate',
      slenderColumn: 'Slender — buckling governs',
    },
    loadTransfer: {
      title: 'Load Transfer',
      reference: 'Slab → Beam → Column → Foundation → Soil',
      slabLoadLabel: 'Slab load',
      bearingCapacityLabel: 'Bearing capacity',
      slabStage: 'Slab',
      beamStage: 'Beam',
      columnStage: 'Column',
      foundationStage: 'Foundation',
      soilStage: 'Soil',
      slabDesc: 'Dead + live load, distributed over the slab area.',
      beamDesc: (width) => `Slab load collected over a ${width}m tributary width becomes a line load along the beam.`,
      columnDesc: (total, span) => `The beam's total load (${total} kN over ${span}m) splits between its two end supports.`,
      foundationDesc: 'The column transmits the load unchanged (axial compression) down to the footing.',
      soilDesc: (area, capacity) => `The footing spreads the point load back over ${area} m² to keep pressure within the ${capacity} kN/m² safe bearing capacity.`,
    },
    columnFailure: {
      title: 'Column Failure: Crushing vs. Buckling',
      reference: (s) => `Crossover at slenderness ≈ ${s}`,
      slendernessLabel: 'Slenderness (KL/r)',
      crushingLabel: 'Crushing',
      bucklingLabel: 'Buckling',
      governs: (mode) => `${mode} governs`,
      crushingGoverns: 'Crushing',
      bucklingGoverns: 'Buckling',
    },
    foundationPressure: {
      title: 'Foundation Pressure Distribution',
      reference: 'Middle-third rule — soil pressure under eccentric loading',
      eccentricityLabel: 'Eccentricity (e)',
      middleThirdLimitLabel: 'Middle-third limit',
      uniformDesc: "Load applied at the footing's center — pressure is uniform across the full area.",
      trapezoidalDesc: (limit) => `Eccentricity is within the middle third (e ≤ B/6 = ${limit}m) — pressure is trapezoidal but stays compressive across the full footing width.`,
      uplift: (width, fullWidth) => `Eccentricity exceeds the middle third (e > B/6) — the low side would need tensile pressure to stay trapezoidal, which soil can't provide. The footing lifts off on that side, and pressure redistributes as a triangle over a ${width}m contact width instead of the full ${fullWidth}m.`,
      overturns: 'Eccentricity is so large the resultant load falls outside the footing entirely — this footing would overturn, not just lift off on one side.',
    },
    reinforcementDetails: {
      title: 'Reinforcement Details',
      reference: 'ACI 318-19 §9.6.1 — minimum reinforcement and bar spacing',
      barCountLabel: 'Number of bars',
      barsUnit: (n) => `${n} bar${n !== 1 ? 's' : ''}`,
      asMinLabel: 'min',
      clearSpacingLabel: 'Clear spacing',
      minLabel: 'min',
      bothPass: 'Both checks pass — this layout satisfies minimum reinforcement and minimum bar spacing simultaneously, which a real design has to do at once, not one at a time.',
      failsMinimum: "This layout doesn't provide enough steel area — fewer or smaller bars than the section's minimum reinforcement ratio requires.",
      failsSpacing: "The bars are packed too tightly — concrete can't flow properly around reinforcement this close together during casting.",
    },
    crackFormation: {
      title: 'Crack Formation: Flexural vs. Shear',
      reference: 'Simplified crack-angle model — same beam as the moment diagram',
      loadPositionLabel: 'Load position',
      inspectPositionLabel: 'Inspect at',
      crackAngleLabel: 'Crack angle',
      shearDominated: 'Near the support, shear dominates over moment — cracks form close to 45° diagonal, which is exactly why stirrups (vertical shear reinforcement) are concentrated in this zone.',
      flexureDominated: 'Near midspan, moment dominates and shear is small — cracks form nearly vertical, perpendicular to the bottom-fiber tension from bending.',
      transitionZone: "Between the support and midspan, shear and moment both matter — crack angle transitions smoothly between the two extremes rather than switching abruptly.",
    },
    waterFlow: {
      title: 'Open Channel Flow',
      reference: "Manning's Equation — V = (1/n)·R^(2/3)·S^(1/2)",
      depthLabel: 'Flow depth',
      concreteLabel: 'Concrete',
      earthLabel: 'Earth',
      gravelLabel: 'Gravel',
    },
    earthquakeMotion: {
      title: 'Earthquake Motion & Resonance',
      reference: 'SDOF dynamic amplification — DAF = 1/√[(1−r²)²+(2ζr)²]',
      buildingPeriodLabel: 'Building period (T)',
      groundMotionPeriodLabel: 'Ground motion period',
      resonanceWarning: "The building's period matches the ground motion's period closely — this is resonance, and it's why the sway amplitude is spiking well beyond what the ground itself is moving.",
      offResonance: "The building's period and the ground motion's period are far enough apart that the response stays close to (or below) the ground motion's own amplitude — no resonant amplification here.",
      svgCaption: 'Ground motion (base) vs. building response (roof)',
    },
    soilLayers: {
      title: 'Soil Layers & Effective Stress',
      reference: "Terzaghi's principle — σᵥ′ = σᵥ − u",
      probeDepthLabel: 'Probe depth',
      layerLabel: 'Layer',
      sandLabel: 'Sand',
      clayLabel: 'Clay',
      denseSandLabel: 'Dense sand',
      aboveWaterTable: 'Above the water table — pore pressure is zero here, so total and effective stress are equal.',
      belowWaterTable: 'Below the water table — pore water pressure reduces effective stress below the total stress at this depth, which is what actually governs soil strength here.',
    },
    buildingStructure: {
      title: 'Building Structure',
      reference: 'G+2 RC frame, 3×2 bays — BNBC 2020 proportioning checks',
      toggleWalls: 'Toggle walls',
      toggleFootings: 'Toggle footings',
      storiesShownLabel: 'Stories shown',
      levelGround: 'Ground',
      level1: '+ 1st floor',
      level2: '+ 2nd floor',
      levelRoof: '+ Roof',
      explanation: 'The bare frame (columns, beams, slabs, footings) is a complete, stable load path on its own — toggle the walls off to see it standing without them. The infill walls add weather protection and room division in this construction type, not structural capacity.',
    },
    reinforcementModel: {
      title: 'Reinforcement Model',
      reference: 'Same building — ACI 318-19 / BNBC 2020 detailing, extended to full members',
      toggleXrayOn: 'X-ray view: on',
      toggleXrayOff: 'X-ray view: off',
      columnLabel: 'Column',
      beamLabel: 'Beam',
      tiesLabel: 'ties',
      stirrupsLabel: 'stirrups',
      simplificationNote: 'Longitudinal bars run each member\'s real full length. Ties and stirrups are shown at a reduced, representative frequency — not their real ~150–250mm code spacing — since modeling every one across 36 columns and 68 beams would add thousands of meshes with no extra teaching value over showing the pattern clearly.',
      explanation: 'This is the direct extension of the Reinforcement Detailing module\'s single beam cross-section to an entire building — the same cover, spacing, and bar-count logic, just placed throughout every column and beam rather than one.',
    },
    constructionSequence: {
      title: 'Construction Sequence',
      reference: 'Same building — typical RC frame construction order',
      stageProgress: (current, total) => `Stage ${current} of ${total}`,
      stageExcavation: 'Excavation',
      stageFootings: 'Footings Cast',
      stageGroundColumns: 'Ground-Story Columns + Plinth Beams',
      stageFloor1Slab: '1st Floor Beams + Slab',
      stageStory1Columns: '1st-Story Columns',
      stageFloor2Slab: '2nd Floor Beams + Slab',
      stageStory2Columns: '2nd-Story Columns',
      stageRoofSlab: 'Roof Beams + Slab',
      stageWalls: 'Infill Walls',
      stageParapetFinishing: 'Parapet + Finishing',
      explainExcavation: 'Pits are excavated at every footing location first — the building starts below ground, not above it.',
      explainFootings: 'Footings are cast in the excavated pits, spreading each column\'s load over enough soil area to stay under the assumed safe bearing capacity.',
      explainGroundColumns: 'Ground-story columns rise from the footings, tied together near their base by plinth beams — a standard detailing practice that stiffens the column bases against relative movement before any floor load arrives.',
      explainFloor1Slab: 'The 1st floor beams and slab cast together, integrally, capping the ground-story columns. The columns had to be finished first — the slab needs something to bear on.',
      explainStory1Columns: '1st-story columns rise from the 1st floor slab up to the 2nd floor level, continuing the same load path one story higher.',
      explainFloor2Slab: 'The 2nd floor beams and slab cast together, capping the 1st-story columns — the same pattern repeating one level up.',
      explainStory2Columns: '2nd-story columns rise to the roof level, the last story of the vertical load path.',
      explainRoofSlab: 'The roof beams and slab cap the top story, completing the structural frame — everything from here on is non-structural.',
      explainWalls: 'Infill walls fill in around the completed frame, on every story — built after the frame, not before, since they carry no structural load and don\'t need to be in place for the frame above to stand.',
      explainParapetFinishing: 'A parapet wall caps the roof edge and finishing work follows — the building is structurally complete; what remains is protection, access, and appearance.',
    },
  },
  visualizationGallery: {
    eyebrow: 'Visual Learning',
    pageTitle: 'Visualizations',
    pageDescription:
      'Every interactive 2D and 3D visualization on the platform, browsable on its own — each one also lives inside the lesson that teaches it.',
    category2d: '2D Visualizations',
    category3d: '3D Visualizations',
    count: (n) => `${n} visualization${n === 1 ? '' : 's'}`,
    backToGallery: 'Back to visualizations',
    usedInLessons: 'Used in lesson',
    noLessonYet: 'Not yet linked to a lesson',
    descriptions: {
      'moment-diagram-explorer': 'Drag a point load along a simply-supported beam and watch the bending-moment diagram redraw live.',
      'column-buckling-visualizer': "Euler's critical buckling load in 3D — see the column's deflected shape change as slenderness changes.",
      'load-transfer-visualizer': 'Follow one load path — slab to beam to column to foundation to soil — as an area load becomes a line, then a point, then an area again.',
      'column-failure-comparator': 'Crushing capacity versus Euler buckling capacity, plotted together, with the real crossover point that decides which mode governs.',
      'foundation-pressure-visualizer': 'How bearing pressure redistributes under an eccentrically-loaded footing — uniform, trapezoidal, or triangular with uplift.',
      'reinforcement-details-visualizer': 'A real beam cross-section with rebar placed exactly where the minimum-reinforcement and spacing checks put it.',
      'crack-formation-visualizer': 'Crack angle rotating from vertical (flexural) to diagonal (shear) along a beam span, and why stirrup spacing isn\'t uniform.',
      'water-flow-visualizer': "Open-channel flow via Manning's Equation, with an animated water surface whose speed matches the real computed velocity.",
      'earthquake-motion-visualizer': "A single-degree-of-freedom oscillator under ground shaking — watch resonance spike when periods match.",
      'soil-layers-visualizer': "Drag a depth probe through stratified soil layers and see Terzaghi's effective stress build up through a water table.",
      'building-structure-visualizer': 'A full G+2 reinforced concrete building in detailed 3D — toggle walls and stories on a real structural frame.',
      'reinforcement-model-visualizer': 'The same building in X-ray mode — concrete turns translucent to reveal the actual rebar cage inside.',
      'construction-sequence-visualizer': 'The same building built up stage by stage, from excavation to finishing, in real construction order.',
    },
  },
  labGallery: {
    eyebrow: 'Experiment & Lab',
    pageTitle: 'Virtual Labs',
    pageDescription:
      'Every virtual lab on the platform, browsable on its own — each one also lives inside the lesson that teaches it.',
    categorySoil: 'Soil Mechanics Labs',
    categoryConcrete: 'Concrete Labs',
    categoryHighway: 'Highway Engineering Labs',
    categorySurvey: 'Surveying Labs',
    count: (n) => `${n} lab${n === 1 ? '' : 's'}`,
    backToGallery: 'Back to labs',
    usedInLessons: 'Used in lesson',
    noLessonYet: 'Not yet linked to a lesson',
    descriptions: {
      'sieve-analysis': 'Shake a soil sample through a stack of sieves and plot the real particle-size distribution curve.',
      'atterberg-limits': "Find a soil's liquid limit, plastic limit, and plasticity index from simulated Casagrande-cup and thread-rolling tests.",
      'compaction-test': 'Run a Proctor compaction test across moisture contents and locate the real optimum moisture content and maximum dry density.',
      'direct-shear': "Shear a soil sample under different normal loads and read off its friction angle and cohesion from the failure envelope.",
      'slump-test': 'Fill a slump cone with a simulated concrete mix and measure how far it slumps — the standard workability check on any site.',
      'compression-test': 'Load a concrete cylinder to failure and read its compressive strength straight off the simulated testing machine.',
      'flexural-test': 'Load a concrete beam at third points until it cracks and compute the modulus of rupture from the failure load.',
      'aggregate-impact-value': 'Drop a hammer on an aggregate sample repeatedly and compute its impact value — a direct measure of toughness for pavement material.',
      'bitumen-penetration': 'Track a standard needle sinking into a bitumen sample and read its penetration grade — the core quality check for road binder.',
      levelling: 'Take a series of staff readings between benchmarks and reduce them to real elevations, height-of-instrument style.',
      'total-station': 'Take simulated angle and distance readings from a total station and compute real coordinates for each point.',
      traverse: 'Close a survey traverse — sum the angles, balance the latitudes and departures, and check it closes within tolerance.',
    },
  },
  resourceLibrary: {
    eyebrow: 'Resource Library',
    pageTitle: 'Resources',
    pageDescription: 'Checklists, site formats, templates, and reference material for civil engineering practice.',
    categoryPdfNotes: 'PDF Notes',
    categoryHandNotes: 'Hand Notes',
    categoryCadFiles: 'CAD Files',
    categoryExcelSheets: 'Excel Sheets',
    categoryTemplates: 'Templates',
    categoryChecklists: 'Checklists',
    categorySiteFormats: 'Site Formats',
    categoryEngineeringBooks: 'Engineering Books',
    categoryCodeBooks: 'Code Books',
    count: (n) => `${n} resource${n === 1 ? '' : 's'}`,
    downloadButton: 'Download',
    notAvailableYet: 'Not available yet — needs file hosting this build doesn\'t have',
    referenceOnlyNote: 'Reference only — a real published title, not distributed here',
    items: {
      'concrete-pour-checklist': {
        title: 'Concrete Pour Checklist',
        description: 'Pre-pour, during-pour, and after-pour verification points for a standard RCC pour.',
      },
      'site-safety-checklist': {
        title: 'Daily Site Safety Checklist',
        description: 'A general daily walk-around safety check covering PPE, site conditions, equipment, and emergency readiness.',
      },
      'foundation-inspection-checklist': {
        title: 'Foundation Inspection Checklist',
        description: 'Verification points for excavation, reinforcement, and formwork before a foundation pour.',
      },
      'daily-site-report-format': {
        title: 'Daily Site Report Format',
        description: 'A standard format for recording daily progress, manpower, and activity on site.',
      },
      'material-requisition-format': {
        title: 'Material Requisition Format',
        description: 'A request form for materials needed at site, ready for store or procurement approval.',
      },
      'concrete-pour-record-format': {
        title: 'Concrete Pour Record Format',
        description: 'A record format for slump, cube samples, and pour details, for QA/QC and as-built records.',
      },
      'boq-template': {
        title: 'Bill of Quantities (BOQ) Template',
        description: 'A fillable spreadsheet with quantity × rate calculated automatically and a running total.',
      },
      'material-estimate-template': {
        title: 'Material Estimate Template',
        description: 'Estimate material quantities with wastage percentage and cost, calculated automatically.',
      },
      'soil-classification-quick-notes': {
        title: 'Soil Classification — Quick Notes',
        description: 'A one-page revision summary of grain-size groups, Atterberg limits, and USCS group symbols.',
      },
      'rcc-design-quick-notes': {
        title: 'RCC Design — Quick Notes',
        description: 'A revision summary of reinforced concrete design essentials.',
      },
      'surveying-quick-notes': {
        title: 'Surveying — Quick Notes',
        description: 'A revision summary of levelling, traversing, and total station basics.',
      },
      'structural-analysis-hand-notes': {
        title: 'Structural Analysis — Hand Notes',
        description: 'Worked hand-written examples covering structural analysis methods.',
      },
      'soil-mechanics-hand-notes': {
        title: 'Soil Mechanics — Hand Notes',
        description: 'Worked hand-written examples covering soil mechanics fundamentals.',
      },
      'standard-foundation-details-dwg': {
        title: 'Standard Foundation Details (DWG)',
        description: 'Typical foundation detail drawings for common footing types.',
      },
      'standard-stair-details-dwg': {
        title: 'Standard Stair Details (DWG)',
        description: 'Typical staircase detail drawings with standard riser/tread proportions.',
      },
      'rebar-development-length-sheet': {
        title: 'Rebar Development Length Sheet',
        description: 'A reference spreadsheet for development length by bar size and concrete grade.',
      },
      'earthwork-volume-sheet': {
        title: 'Earthwork Volume Sheet',
        description: 'A reference spreadsheet for cut/fill volume calculation by the average end area method.',
      },
      'design-of-reinforced-concrete': {
        title: 'Design of Reinforced Concrete',
        description: 'Jack C. McCormac & Russell H. Brown — a widely used RCC design textbook.',
      },
      'soil-mechanics-and-foundations': {
        title: 'Soil Mechanics and Foundations',
        description: 'Muni Budhu — a standard soil mechanics and foundation engineering textbook.',
      },
      'surveying-theory-and-practice': {
        title: 'Surveying: Theory and Practice',
        description: 'James M. Anderson & Edward M. Mikhail — a standard surveying reference.',
      },
      'bnbc-2020': {
        title: 'BNBC 2020',
        description: 'Bangladesh National Building Code, 2020 — the code this entire platform is built to.',
      },
      'aci-318-19': {
        title: 'ACI 318-19',
        description: 'Building Code Requirements for Structural Concrete, American Concrete Institute.',
      },
      'aashto-lrfd': {
        title: 'AASHTO LRFD Bridge Design Specifications',
        description: 'American Association of State Highway and Transportation Officials — bridge design specification.',
      },
    },
  },
  materialLibrary: {
    eyebrow: 'Material Library',
    pageTitle: 'Engineering Materials',
    pageDescription: 'Properties, advantages, uses, and testing for the 10 materials every civil engineer works with.',
    count: (n) => `${n} material${n === 1 ? '' : 's'}`,
    propertiesHeading: 'Properties',
    advantagesHeading: 'Advantages',
    disadvantagesHeading: 'Disadvantages',
    usesHeading: 'Uses',
    testingHeading: 'Testing',
    marketInfoHeading: 'Market Information',
    relatedLabsHeading: 'Try it in a lab',
    relatedToolsHeading: 'Related tool',
    backToMaterials: 'Back to materials',
    materials: {
      cement: {
        title: 'Cement',
        summary: "The binding agent in concrete and mortar — reacts with water to form a hardened matrix that binds aggregate together.",
        properties: [
          'Initial setting time around 30 minutes, final setting around 10 hours for Ordinary Portland Cement',
          'Specific gravity approximately 3.15',
          'Fineness affects the rate of strength gain',
          'Hydration is an exothermic reaction — generates heat as it cures',
        ],
        advantages: [
          'Widely available and factory-produced with consistent quality',
          'Develops high compressive strength',
          'Versatile — different types and grades suit different needs',
        ],
        disadvantages: [
          'Very low tensile strength on its own',
          'Shrinks while drying, which can cause cracking',
          'Manufacturing has a high carbon footprint',
          'Sensitive to water-cement ratio errors on site',
        ],
        uses: ['Concrete and mortar production', 'Plastering', 'Grouting', 'Precast elements'],
        testing: [
          'Fineness test',
          'Setting time test (Vicat apparatus)',
          'Soundness test',
          'Compressive strength of cement mortar cubes',
        ],
        marketInfo:
          'Sold in standard 50 kg bags in Bangladesh. Common types are OPC (Ordinary Portland Cement) and PCC (Portland Composite Cement). Always check the manufacture date — cement loses strength if stored too long.',
      },
      sand: {
        title: 'Sand (Fine Aggregate)',
        summary: 'Fine aggregate used in concrete, mortar, and plaster — fills voids between coarse aggregate and improves workability.',
        properties: [
          'Grain size between 0.075 mm and 4.75 mm',
          'Fineness modulus typically 2.2–3.2 for concrete sand',
          'Specific gravity approximately 2.6–2.7',
          'Volume increases ("bulks") with moisture content',
        ],
        advantages: [
          'Improves workability of concrete and mortar',
          'Fills voids between coarse aggregate, reducing porosity',
          'Locally available and relatively low cost',
        ],
        disadvantages: [
          'Excess silt or clay content weakens concrete',
          'River sand extraction raises environmental concerns',
          'Quality varies significantly by source',
        ],
        uses: ['Concrete', 'Mortar', 'Plaster', 'Filling', 'Brick work'],
        testing: ['Sieve analysis (grading)', 'Silt content test', 'Bulking test', 'Specific gravity test'],
        marketInfo:
          'Sold by truck-load, measured in CFT or cubic meter, in Bangladesh. Sylhet sand is prized for concrete work due to its low silt content; other local sand often needs washing before quality use.',
      },
      aggregate: {
        title: 'Aggregate (Coarse Aggregate)',
        summary: "Crushed stone or gravel forming the load-bearing skeleton of concrete — occupies roughly 60–75% of concrete's volume.",
        properties: [
          'Typical size 10–40 mm for structural concrete',
          'Angular particles bond better with cement paste than rounded ones',
          'Hardness and toughness resist crushing and impact',
          'Specific gravity approximately 2.6–2.9',
        ],
        advantages: [
          'Provides bulk volume economically',
          'Contributes most of concrete\'s compressive strength',
          'Angular aggregate improves bond with cement paste',
        ],
        disadvantages: [
          'Soft or weathered aggregate significantly weakens concrete',
          'Transportation cost is high due to weight and bulk',
          'Flaky or elongated particles reduce workability',
        ],
        uses: ['Concrete', 'Road base and sub-base', 'Drainage and filter media'],
        testing: [
          'Sieve analysis',
          'Aggregate impact value test',
          'Aggregate crushing value test',
          'Specific gravity and water absorption test',
        ],
        marketInfo:
          'Sold by truck-load (CFT or cubic meter) in Bangladesh. Natural stone deposits are limited domestically, so crushed stone is often imported, with brick khoa used as a substitute in some applications.',
      },
      steel: {
        title: 'Steel (Reinforcement)',
        summary: 'A high-strength, tension-resisting material embedded in concrete — concrete handles compression, steel handles tension.',
        properties: [
          'Common yield strength grades of 400 or 500 MPa (locally referred to as Grade 60 / Grade 75)',
          'High tensile strength',
          'Ductile — deforms noticeably before failure, giving warning',
          'Thermal expansion similar to concrete, which is why the two bond well together',
        ],
        advantages: [
          'Excellent tensile strength',
          'Ductility provides a safety margin before collapse',
          'Recyclable',
          'Widely standardized across manufacturers',
        ],
        disadvantages: [
          'Corrodes if concrete cover or quality is inadequate',
          'Expensive relative to other structural materials',
          'Heavy, which affects transport and handling',
          'Loses strength rapidly at high fire temperatures',
        ],
        uses: ['Reinforced concrete beams, columns, slabs, and footings', 'Structural steel framing', 'Rebar cages'],
        testing: [
          'Tensile test',
          'Bend test',
          'Visual corrosion check',
          'Weight-per-meter check against the nominal value',
        ],
        marketInfo:
          'Sold by weight (per ton or per kg) in Bangladesh. Common grades are 60 Grade and 500W. Brand reputation matters heavily — under-weight or under-strength rebar is a known quality risk in the local market.',
      },
      brick: {
        title: 'Brick',
        summary: 'A common masonry unit made from fired clay — used for walls and partitions, and in Bangladesh often as a substitute for coarse aggregate (brick khoa).',
        properties: [
          'Compressive strength varies widely by class (1st / 2nd / 3rd class)',
          'Good quality brick should have water absorption within about 20%',
          'Uniform size, shape, and colour indicate good, even firing',
        ],
        advantages: [
          'Manufactured locally almost everywhere in Bangladesh',
          'Low cost',
          'Good thermal mass',
          'Easy to work with by hand, no special equipment needed',
        ],
        disadvantages: [
          'Lower strength than concrete block or stone',
          'Quality is highly inconsistent between kilns',
          'High water absorption reduces durability if not well-fired',
          'Brick-making consumes significant topsoil and fuel',
        ],
        uses: ['Masonry walls', 'Partitions', 'Brick khoa (as aggregate substitute)', 'Pavement and soling'],
        testing: ['Compressive strength test', 'Water absorption test', 'Efflorescence test', 'Dimension and shape check'],
        marketInfo:
          'Sold per piece or per 1000 pieces in Bangladesh, graded 1st / 2nd / 3rd class by quality — 1st class for exposed or structural work, lower classes for filling or non-critical work.',
      },
      concrete: {
        title: 'Concrete',
        summary: 'The composite of cement, sand, aggregate, and water that forms the structural backbone of most modern buildings — strong in compression, weak in tension.',
        properties: [
          'Compressive strength defined by grade — e.g. M20 means 20 MPa at 28 days',
          'Workability measured by the slump test',
          'Density roughly 2400 kg/m³',
          'Gains strength progressively over time, strongly dependent on curing',
        ],
        advantages: [
          'Moldable into almost any shape',
          'High compressive strength',
          'Fire resistant',
          'Relatively low maintenance once cured',
        ],
        disadvantages: [
          'Weak in tension without steel reinforcement',
          'Shrinks and can crack if not cured properly',
          'Heavy',
          'Quality is highly dependent on mix proportioning and site curing practice',
        ],
        uses: ['Foundations', 'Columns', 'Beams', 'Slabs', 'Pavements', 'Precast elements'],
        testing: ['Slump test', 'Compressive strength test (cube or cylinder)', 'Flexural strength test', 'Water-cement ratio verification'],
        marketInfo:
          'Mix design is normally specified by grade (M15 / M20 / M25 and so on). Ready-mix concrete is available in major Bangladeshi cities; site-mixed concrete is still more common elsewhere.',
      },
      asphalt: {
        title: 'Asphalt (Bitumen)',
        summary: 'A viscous, petroleum-derived binder mixed with aggregate to form flexible pavement — the standard surfacing material for most roads.',
        properties: [
          'Penetration grade indicates hardness (e.g. 60/70, 80/100)',
          'Softens with heat, becomes brittle in cold',
          'Viscoelastic behaviour under traffic load',
        ],
        advantages: [
          'Flexible — tolerates minor ground movement without cracking',
          'Relatively quick to lay and open to traffic',
          'Recyclable as reclaimed asphalt pavement (RAP)',
          'Produces a smooth riding surface',
        ],
        disadvantages: [
          'Softens in high heat, creating rutting risk',
          'Petroleum-based, so price is tied to the oil market',
          'Needs periodic resurfacing and maintenance',
          'Less durable than concrete pavement under heavy, repeated loading',
        ],
        uses: ['Road surfacing', 'Waterproofing (in modified forms)', 'Pavement binder courses'],
        testing: ['Penetration test', 'Softening point (ring and ball) test', 'Ductility test', 'Viscosity test'],
        marketInfo:
          'Sold by drum or in bulk (per ton) in Bangladesh, commonly sourced through Roads and Highways Department-approved suppliers for public works.',
      },
      wood: {
        title: 'Wood (Timber)',
        summary: 'A natural, renewable structural and finishing material — used in Bangladesh mainly for formwork, roofing members, doors, windows, and traditional construction.',
        properties: [
          'Strength varies significantly by species',
          'Anisotropic — strength differs along the grain versus across it',
          'Moisture content strongly affects strength and dimensional stability',
          'Naturally combustible',
        ],
        advantages: [
          'Renewable resource',
          'Good strength-to-weight ratio',
          'Easy to work with hand tools',
          'Aesthetically warm finish',
        ],
        disadvantages: [
          'Susceptible to decay, termite attack, and fire',
          'Strength and durability vary by species and treatment',
          'Dimensional changes with moisture',
          'Increasingly costly as quality timber becomes scarcer',
        ],
        uses: ['Formwork / shuttering', 'Roof trusses and purlins', 'Doors and windows', 'Furniture', 'Scaffolding (bamboo is often used similarly)'],
        testing: ['Moisture content test', 'Density test', 'Bending / flexural strength test', 'Visual grading for defects (knots, splits)'],
        marketInfo:
          'Sold by cubic foot in Bangladesh. Sal and Segun (teak) are valued for structural and finishing use, though imported timber is common for higher grades.',
      },
      glass: {
        title: 'Glass',
        summary: 'A brittle, transparent material used mainly for windows, facades, and increasingly structural facade systems in modern buildings.',
        properties: [
          'High compressive strength but very low tensile strength — fails suddenly (brittle)',
          'Transparent or translucent',
          'Poor thermal insulator unless treated (e.g. low-E coating, double glazing)',
          'Non-combustible',
        ],
        advantages: [
          'Allows natural light into a building',
          'Aesthetically modern',
          'Recyclable',
          'Can be treated (tempered or laminated) for improved safety',
        ],
        disadvantages: [
          'Brittle — fails suddenly without warning',
          'Tempering and lamination add cost',
          'Poor insulator in untreated form — a real concern in Bangladesh\'s climate',
          'Heavy, requiring careful handling and installation',
        ],
        uses: ['Windows', 'Doors', 'Curtain wall facades', 'Partitions', 'Balustrades (when tempered or laminated)'],
        testing: ['Thickness and dimension check', 'Visual defect inspection', 'Impact / safety-glass certification check'],
        marketInfo:
          'Sold by square foot in Bangladesh, priced by thickness and type — float glass versus tempered versus laminated. Tempered and laminated cost significantly more but are required for safety-critical applications.',
      },
      aluminum: {
        title: 'Aluminum',
        summary: 'A lightweight, corrosion-resistant metal increasingly used for window and door frames, facade systems, and roofing sheets.',
        properties: [
          'About one-third the density of steel',
          'Naturally forms a protective oxide layer — corrosion resistant',
          'High strength-to-weight ratio',
          'High thermal conductivity and thermal expansion',
        ],
        advantages: [
          'Lightweight yet strong',
          'Corrosion resistant without painting',
          'Low maintenance',
          'Recyclable',
          'Easy to extrude into complex profiles',
        ],
        disadvantages: [
          'More expensive than steel for the strength delivered',
          'Lower stiffness than steel — more deflection under load',
          'Softens and loses strength at high fire temperatures',
          'Risk of galvanic corrosion if in direct contact with dissimilar metals',
        ],
        uses: ['Window and door frames', 'Curtain wall / facade systems', 'Roofing sheets', 'False ceiling framing'],
        testing: ['Anodizing / coating thickness check', 'Dimension and profile check', 'Alloy grade verification'],
        marketInfo:
          'Sold by kg or by running foot (for extruded profiles) in Bangladesh. Profile quality and anodizing thickness vary significantly by brand, which affects long-term corrosion performance.',
      },
    },
  },
  certificates: {
    eyebrow: 'Certification',
    pageTitle: 'Certificates & Badges',
    pageDescription: 'Course certificates, skill badges, and a progress snapshot — generated from your real activity on this platform.',
    courseCertificatesHeading: 'Course Certificates',
    noCourseCertificatesYet: 'No course certificates yet',
    noCourseCertificatesDescription: 'Complete every lesson in a course to earn its certificate.',
    downloadButton: 'Download',
    completedOn: (date) => `Completed ${date}`,
    skillBadgesHeading: 'Skill Badges',
    noBadgesYetNote: 'Badges are earned automatically from your activity — streaks, quizzes, labs, tools, and completed courses. None yet, but they\'ll appear here as you go.',
    progressCertificateHeading: 'Progress Certificate',
    progressCertificateDescription: 'A snapshot of your overall progress right now — not gated on finishing anything, generated on demand.',
    generateProgressCertificate: 'Generate progress certificate',
    verifyLinkText: 'Verify a certificate',
    verifyPageTitle: 'Verify a Certificate',
    verifyPageDescription: 'Check whether a certificate ID is well-formed.',
    verifyInputPlaceholder: 'e.g. EXL-STE-20260715-A3F9C',
    verifyButton: 'Check',
    verifyResultWellFormed: 'This ID is well-formed and matches a real course on this platform.',
    verifyResultNotWellFormed: 'This ID is not well-formed, or doesn\'t match any course on this platform.',
    verifyResultCourse: (title) => `Course: ${title}`,
    verifyResultDate: (date) => `Date encoded in ID: ${date}`,
    verifyHonestNote:
      'This checks only that the ID is correctly formatted and matches a real course — it cannot confirm who the certificate belongs to. This platform has no central server, so there is no record of who was actually issued which certificate outside that person\'s own device. Treat this as a format check, not proof of identity.',
    backToCertificates: 'Back to certificates',
    certificateEyebrow: 'Certificate of Completion',
    certificateBodyLine: 'has successfully completed the course',
    progressCertificateEyebrow: 'Certificate of Progress',
    progressCertificateBodyLine: (n) => `has completed ${n} lesson${n === 1 ? '' : 's'} on EngineXLearn as of`,
    badges: {
      'first-course': {
        title: 'First Course',
        description: 'Completed your first full course.',
      },
      'five-courses': {
        title: 'Five Courses',
        description: 'Completed five full courses.',
      },
      'streak-7': {
        title: '7-Day Streak',
        description: 'Stayed active for 7 days in a row.',
      },
      'streak-30': {
        title: '30-Day Streak',
        description: 'Stayed active for 30 days in a row.',
      },
      'first-quiz': {
        title: 'First Quiz',
        description: 'Attempted your first quiz.',
      },
      'ten-quizzes': {
        title: 'Ten Quizzes',
        description: 'Attempted ten quizzes.',
      },
      'lab-explorer': {
        title: 'Lab Explorer',
        description: 'Saved results from five different virtual labs.',
      },
      'tool-user': {
        title: 'Tool User',
        description: 'Saved results from five different engineering tools.',
      },
    },
  },
  premium: {
    eyebrow: 'Premium',
    pageTitle: 'Premium Features',
    pageDescription: "A preview of what a paid tier would include — this platform doesn't sell anything yet.",
    noBackendNote:
      'This platform has no payment processor and no subscription system. Nothing below can actually be purchased right now — this page previews what a premium tier would include if one is ever built, and everything on the platform today remains fully free.',
    previewAvailableLabel: 'Preview available today, fully free',
    dependsOnUnbuiltLabel: (part) => `Not started — depends on ${part}, which isn't built yet`,
    advancedCoursesHeading: 'Advanced Courses',
    advancedCoursesDescription:
      'Specialized software courses like Civil 3D, STAAD Pro, SAP2000, and Primavera P6 are the kind of content a future "Advanced" tier might include. Right now, they\'re already part of the free Software Learning Center.',
    viewAdvancedCourses: 'View these courses now',
    exclusiveProjectsHeading: 'Exclusive Projects',
    exclusiveProjectsDescription: 'Real, detailed worked project case studies for premium members.',
    aiPremiumToolsHeading: 'AI Premium Tools',
    aiPremiumToolsDescription: 'Advanced AI-assisted features beyond the basic AI Assistant.',
    liveMentorshipHeading: 'Live Mentorship',
    liveMentorshipDescription: 'One-on-one or small-group sessions with practicing engineers.',
    downloadAccessHeading: 'Download Access',
    downloadAccessDescription:
      'Priority or expanded access to downloadable templates, checklists, and formats. The Resource Library already has real, free downloads today.',
    viewResources: 'View the Resource Library now',
  },
  projects: {
    eyebrow: 'Real Project Experience',
    pageTitle: 'Projects',
    pageDescription: 'Walk through four project types the way they actually unfold on site — planning, structure, sequencing, and the decisions in between.',
    backToProjects: 'Back to projects',
    representativeNote:
      'This is a representative example built to show how a real project of this type typically unfolds — not documentation of one specific, named building. Real drawings, site photos, and construction video would come from an actual completed project; see the note at the bottom of this page for why none of that is included here.',
    mediaHeading: 'Real Drawings, Site Photos & Construction Video',
    mediaNote:
      'This platform has no real completed project behind it, and no way to produce a genuine site photograph or construction video — those would need to come from an actual project. Rather than substitute stock imagery and present it as "real," this section is left honestly empty until real project documentation is available to add.',
    relatedVisualizationsHeading: 'See it in 3D',
    relatedLabsHeading: 'Related lab',
    relatedMaterialsHeading: 'Related materials',
    list: {
      residential: {
        title: 'Residential Building',
        summary: 'A typical G+3 residential building, from site selection through finishing.',
      },
      commercial: {
        title: 'Commercial Building',
        summary: 'A multi-story commercial building — structural system choices and a busier, more constrained site.',
      },
      bridge: {
        title: 'Bridge Project',
        summary: 'A simple-span bridge, and the construction sequence that gets it from ground to deck.',
      },
      road: {
        title: 'Road Project',
        summary: 'A flexible pavement road — the layer system beneath the surface most people never think about.',
      },
    },
    sections: {
      planning: {
        title: 'Planning',
        body: `Before any drawing is finalized, a residential project's planning
phase settles questions that are expensive to change later. A soil
investigation (at minimum a few trial pits, ideally a proper boring
log for anything beyond 2-3 stories) tells the structural designer
what foundation type is realistic — an isolated footing on firm soil
versus a raft or piled foundation where the soil is soft, which is
common across much of Bangladesh's floodplain geology.

Setback rules from the local authority (RAJUK in Dhaka, or the
relevant Pourashava/City Corporation elsewhere) fix how much of the
plot can actually be built on, which in turn fixes the building
footprint before architectural planning can really start. For a
typical urban plot, front/rear/side setbacks combined with a
Floor Area Ratio (FAR) limit often constrain the design more than
the client's own preferences do.

Architectural and structural coordination has to start here, not
after drawings are "finished" — a column grid that looks clean on an
architectural plan can be structurally awkward (long unsupported
spans, columns that land inside a stairwell) if structure isn't
consulted while the layout is still flexible.`,
      },
      construction: {
        title: 'Construction',
        body: `Construction on a typical residential project follows a fairly
fixed sequence: earthwork and foundation first, then the structural
frame rises story by story, with each story's slab and beam cast
before the columns above it start. This is exactly the sequence the
platform's Construction Sequence visualizer (Part 6) shows stage by
stage — worth reviewing alongside this section.

A few things repeatedly separate a well-run residential site from a
troubled one in practice: curing discipline (concrete that isn't kept
wet for the first 7 days loses strength it can never fully recover,
and Bangladesh's heat makes this worse, not better), reinforcement
cover control (spacers that go missing mid-pour lead to exposed,
corroding rebar years later), and realistic sequencing of MEP
rough-in — electrical conduit and plumbing sleeves need to go in
*before* a slab is cast, not chased into it afterward, which is both
weaker and uglier.

Site supervision matters more than site technology here — a
supervisor physically checking formwork alignment and rebar spacing
before every pour catches most of the errors that would otherwise
only show up as cracks or leaks years later.`,
      },
      finishing: {
        title: 'Finishing',
        body: `Finishing is where a structurally sound building either becomes a
pleasant place to live or a source of years of small complaints —
plastering, tiling, painting, and fitting out electrical and plumbing
fixtures. The most common real-world mistake here isn't a finishing
defect itself; it's sequencing: rushing finishing work before the
structure has fully cured and settled leads to cracked plaster and
tile that has nothing to do with the finishing crew's skill and
everything to do with starting too early.

Plastering needs a properly cured, cleaned masonry surface — plaster
applied over dusty or freshly-wet brick work debonds later. Tiling
needs a level, properly-cured screed underneath; skipping the screed
or rushing its curing is why so many tiled floors develop hollow
spots within a year. Electrical and plumbing fixtures generally go in
after first-coat painting but before the final coat, so damage during
fixture installation can be touched up rather than requiring a full
repaint.`,
      },
      'structural-system': {
        title: 'Structural System',
        body: `A commercial building's structural system usually faces different
demands than a residential one: higher live loads (retail, office, or
assembly occupancies all load higher than residential per BNBC),
often larger clear spans (a retail floor plate wants fewer columns,
not more), and frequently a request for future flexibility — the
tenant layout today may not be the tenant layout in five years.

This pushes many commercial buildings toward either a conventional
RCC frame with strategically placed shear walls (for lateral
stability without columns blocking every possible layout) or a flat
slab system (no beams, more ceiling height per floor, simpler
formwork) where spans allow it. The Building Structure and
Reinforcement Model visualizers (Part 6) show exactly this kind of
full 3D frame — worth reviewing here for how a real multi-story frame
is actually organized.

Parking floors specifically often drive their own structural
decisions — a ground or basement parking floor typically wants a
wider column grid than the floors above, which means a transfer
structure (a transfer beam or transfer slab) carrying the upper
floors' columns down to a sparser parking-floor grid — one of the more
technically demanding parts of a commercial building's design.`,
      },
      'site-management': {
        title: 'Site Management',
        body: `A commercial site is frequently in a denser, busier location than a
residential plot — less room to stage material, less room for crane
swing radius, and often direct proximity to a public footpath or
active road that residential sites in newer areas don't have to
contend with.

This changes how the site actually runs day to day: material
deliveries need scheduling (not just showing up and hoping there's
room), hoarding/site boundary fencing becomes a real safety and legal
requirement rather than a formality, and a lot more coordination goes
into simply sequencing which trade works where on a given day, since
there's less physical space for multiple trades to work in parallel
without getting in each other's way.

Public safety around the site perimeter also becomes a genuine,
ongoing site management task, not a one-time setup — falling debris,
crane operation over a public path, and dust/noise affecting
neighboring properties all need active daily management on a
commercial urban site in a way a residential plot on a quieter street
usually doesn't.`,
      },
      'construction-sequence': {
        title: 'Construction Sequence',
        body: `A simple-span bridge's construction sequence is structured almost
entirely around getting the substructure right before the
superstructure ever starts, since every later stage depends on the
one before it being both correct and fully cured.

**Substructure first:** piling (if the soil needs it) is driven or
bored first, then pile caps are cast on top of the piles, then
abutments and/or piers are built up from the pile caps to the
elevation where the superstructure will sit. Each of these needs to
cure and gain strength before the next stage loads it.

**Superstructure next:** depending on span and site access, this is
either cast-in-situ (falsework/staging built up from the ground to
support formwork for the deck, used where ground access below the
span is available) or precast (girders cast off-site or on a nearby
casting yard, then lifted into place with a crane — the more common
choice where the span crosses a river or a road that can't be
obstructed by falsework).

**Deck and finishing:** the deck slab is cast on top of the girders
(or as part of a cast-in-situ pour), followed by wearing surface,
parapets/railings, and expansion joints at the abutments — the detail
most responsible for a bridge deck's long-term ride quality, since a
poorly detailed expansion joint is one of the most common sources of
early bridge deck deterioration.

No visualization on this platform currently models bridge
construction specifically — the Construction Sequence visualizer in
the Learning System is built around a *building's* stage-by-stage
construction, which is a different enough process (no piling/pier
sequence, no girder erection) that linking it here would be
misleading rather than helpful.`,
      },
      'pavement-layers': {
        title: 'Pavement Layers',
        body: `A road's pavement is a layered system, and the layer nobody sees —
everything under the wearing surface — is usually what actually
determines whether a road lasts 15 years or fails in 3.

From the bottom up: the **subgrade** (the prepared, compacted natural
ground) has to be brought to a consistent, adequate strength first —
a soft or inconsistent subgrade undermines every layer above it no
matter how well those layers are built. The **sub-base** (typically a
granular layer) spreads load from the layers above across a wider
area of the subgrade and improves drainage. The **base course**
(often a stronger granular material, sometimes stabilized) carries
most of the structural load transfer. The **binder course** and
**wearing course** (both asphalt/bitumen-bound layers) sit on top —
the wearing course is the only layer road users ever see or feel, but
it's carrying the least structural responsibility of the whole
system, which is a common misconception among people encountering
pavement design for the first time.

Material quality at every layer matters, not just the visible wearing
surface — an aggregate that fails the impact or crushing value test in
the base course causes exactly the kind of premature failure (rutting,
potholing) that gets blamed on "bad asphalt" when the real cause was
several layers down.`,
      },
    },
  },
  practical: {
    eyebrow: 'Practical Engineering Hub',
    pageTitle: 'Practical Hub',
    pageDescription: 'How things actually get done on a real site — 42 practical topics across 6 areas, plus the mistakes that keep repeating and how to avoid them.',
    backToHub: 'Back to Practical Hub',
    mediaHeading: 'Real Photos, Real Videos & Drone Views',
    mediaNote:
      'This platform has no real site behind it and no way to produce genuine site photography, video, or drone footage — those would need to come from an actual, ongoing project. Rather than substitute stock imagery and present it as real site documentation, this section is left honestly empty until real site media is available to add.',
    relatedVisualizationsHeading: 'See it in 3D',
    relatedLabsHeading: 'Related lab',
    relatedMaterialsHeading: 'Related materials',
    relatedToolsHeading: 'Related tool',
    commonMistakesHeading: 'Common Site Mistakes',
    categories: {
      'site-engineering': {
        title: 'Site Engineering / Site Work',
        summary: 'From site setup through finishing — the full sequence of a typical building site, stage by stage.',
      },
      'reinforcement-work': {
        title: 'Reinforcement Work',
        summary: 'Cutting, bending, placing, and detailing rebar — the practical side of what a structural drawing specifies.',
      },
      'concrete-technology': {
        title: 'Concrete Technology',
        summary: 'Mixing, casting, compacting, and curing — the practical decisions that determine whether concrete reaches its design strength.',
      },
      'foundation-systems': {
        title: 'Foundation Systems',
        summary: 'Isolated, combined, raft, and pile foundations — which one fits which site condition, and why.',
      },
      'road-construction': {
        title: 'Road Construction',
        summary: 'Subgrade through asphalt — building a road layer by layer, and compacting each one correctly.',
      },
      'site-safety': {
        title: 'Site Safety',
        summary: 'PPE, scaffolding, electrical and crane safety, and managing site risk day to day.',
      },
    },
    topics: {
      'site-setup': {
        title: 'Site Setup',
        body: `Before any excavation starts, a site needs its boundary clearly
marked, a temporary site office, material storage areas planned (so
delivered cement and steel aren't dumped wherever there's space),
water and electricity connections arranged, and a site safety
boundary (hoarding/fencing) up if the site is anywhere near a public
path. Rushing past site setup to "start real work" sooner is a common
temptation that usually costs more time later, once material is
already piled in the wrong place or a delivery truck can't access the
site.`,
      },
      excavation: {
        title: 'Excavation',
        body: `Excavation depth and width need to match the foundation drawing
exactly, with extra working space (typically 300–450 mm) on each side
of the foundation for formwork and worker access. In loose or
water-bearing soil, side slopes or shoring/timbering are needed to
stop the excavation face from collapsing — skipping this to save time
is one of the more dangerous shortcuts taken on small sites. Excavated
soil that will be reused as backfill should be stockpiled separately
from soil meant for disposal, not mixed together.`,
      },
      'layout-work': {
        title: 'Layout Work',
        body: `Layout work transfers the drawing's grid and building outline onto
the actual ground, using a theodolite/total station or, on smaller
sites, batter boards and string lines referenced from a fixed
benchmark. Every column position, wall line, and grid intersection
gets marked and checked against the drawing before any excavation or
foundation work starts on that line — an error caught at layout stage
costs almost nothing to fix; the same error caught after a foundation
is cast can mean demolition.`,
      },
      'foundation-work': {
        title: 'Foundation Work',
        body: `Foundation work follows layout and excavation: a blinding/PCC layer
first (to give a clean, level base for reinforcement, not to carry
structural load itself), then reinforcement placed per the
foundation drawing with cover blocks maintaining the specified cover,
then formwork, then the pour itself. Every stage here should be
inspected before the next one covers it up — reinforcement placement
especially, since once concrete is poured, checking bar size or
spacing is no longer possible without breaking it out.`,
      },
      'column-casting': {
        title: 'Column Casting',
        body: `Column formwork needs to be plumb (vertically true) and well-braced
— a column that leans even slightly at the base compounds that lean
up every story above it. Concrete is placed in layers and vibrated
each layer, not dropped in from height in one go, which causes
segregation (coarse aggregate separating from the mortar). Formwork
is struck (removed) only after the concrete has gained enough early
strength to support itself, not on a fixed schedule regardless of
site conditions — hot weather speeds this up, cold weather slows it
down.`,
      },
      'beam-casting': {
        title: 'Beam Casting',
        body: `Beam and slab are usually cast together as one monolithic pour where
the design assumes monolithic action — casting a beam alone and the
slab days later (an unplanned "cold joint") can weaken the connection
unless it's specifically designed and prepared for it (roughened
surface, added shear reinforcement). Beam soffit (bottom) formwork
needs to stay propped until the concrete has gained sufficient
strength to span on its own — removing props too early is a common
cause of beam deflection or cracking that only becomes visible weeks
later.`,
      },
      'slab-casting': {
        title: 'Slab Casting',
        body: `Slab casting needs the reinforcement mesh (or crossed bars) checked
for correct spacing and cover before the pour, with cover blocks/chairs
holding the top reinforcement layer at its correct height — top steel
that sinks to the bottom during the pour (from workers walking on it
without proper walkways, or from cover chairs failing) stops doing
its job of resisting negative moment over supports. Slabs are
finished (screeded and floated) promptly after casting, before the
concrete starts to set, and then covered/cured immediately after.`,
      },
      pcc: {
        title: 'PCC (Plain Cement Concrete)',
        body: `Plain Cement Concrete (PCC) — concrete with no reinforcement — is
used where only compressive strength matters and there's no tension
to resist: blinding layers under foundations, flooring sub-base, and
some pavement applications. Because it has no reinforcement to
redistribute stress, PCC needs a properly prepared, uniform sub-base
underneath it; PCC cast directly over soft or uneven ground will
crack in an uncontrolled pattern rather than a designed one.`,
      },
      'rcc-work': {
        title: 'RCC Work',
        body: `Reinforced Cement Concrete (RCC) is what carries both compression
(via the concrete) and tension (via the embedded steel) — the
combination that makes modern beams, slabs, and columns possible.
Getting RCC right on site means three things happening correctly at
once: the concrete mix reaching its design strength, the
reinforcement being the right size and in the right position, and
the two bonding properly (which needs clean, uncorroded, unpainted
bar surfaces and adequate concrete cover, not too much and not too
little).`,
      },
      brickwork: {
        title: 'Brickwork',
        body: `Brick masonry is built in courses with staggered (bonded) vertical
joints so no continuous vertical joint runs up through multiple
courses, which would create a plane of weakness. Bricks are
pre-wetted before laying (dry bricks pull water out of the fresh
mortar too fast, weakening the bond) but not soaked to the point of
being saturated. Mortar joints are kept consistent in thickness
(typically around 10 mm) — inconsistent joint thickness both looks
poor and performs inconsistently.`,
      },
      plastering: {
        title: 'Plastering',
        body: `Plastering needs the masonry surface properly cured, cleaned of
dust and loose material, and dampened (not soaking wet) before the
first coat goes on — plaster applied to a dry, dusty wall debonds
later, often showing up as hollow-sounding patches or delamination
months after the work looked fine. Plaster is normally applied in two
coats (a rougher base coat, then a finer finishing coat) rather than
one thick coat, which is more prone to cracking and sagging.`,
      },
      'tile-work': {
        title: 'Tile Work',
        body: `Tile work needs a level, properly cured screed or bedding layer
underneath — tiles laid directly on an uneven or uncured base
develop hollow spots and eventually crack or pop loose. Adhesive or
mortar needs full, even coverage under each tile (checked by
occasionally lifting a tile during laying), not just dabs at the
corners, since uneven coverage is exactly what causes a hollow sound
under one part of a tile and not another.`,
      },
      waterproofing: {
        title: 'Waterproofing',
        body: `Waterproofing at roof slabs, bathrooms, and water tanks needs the
surface properly prepared (cleaned, cracks and honeycombing repaired)
before any waterproofing membrane or coating is applied — coating over
an unrepaired crack simply bridges it temporarily until the membrane
itself cracks at the same spot. Waterproofing details at
penetrations (pipes passing through a roof slab or bathroom floor)
are where leaks most often start in practice, not in the middle of
an otherwise flat surface, so those details deserve disproportionate
attention relative to their size.`,
      },
      painting: {
        title: 'Painting',
        body: `Painting needs fully cured, dry plaster or concrete underneath —
painting over a wall that's still releasing moisture from curing
traps that moisture in and causes peeling or blistering later,
regardless of paint quality. A primer/sealer coat suited to the
substrate comes first, then normally two finish coats, with adequate
drying time between coats rather than rushing to a second coat while
the first is still tacky.`,
      },
      'finishing-work': {
        title: 'Finishing Work',
        body: `Finishing work (final touch-ups, fixture installation, cleaning,
snag-list corrections) is where a project's overall quality
impression is actually formed for the client, even though it
represents a small fraction of total site effort — a structurally
excellent building with careless finishing reads as a poor-quality
building to almost everyone who experiences it, since very few
occupants ever directly evaluate the structural work underneath.`,
      },
      'bar-cutting': {
        title: 'Bar Cutting',
        body: `Reinforcement bars are cut to the exact lengths shown in the bar
bending schedule (BBS), accounting for bend deductions (a bent bar
needs a slightly shorter straight length than its nominal dimension,
because the bend itself takes up length) — cutting bars to nominal
length without bend deductions is a common source of bars that end
up slightly too long once bent, causing cover or spacing problems on
site.`,
      },
      'bar-bending': {
        title: 'Bar Bending',
        body: `Bars are bent to standard hook and bend shapes (90°, 135°, 180°
hooks) using a bar bender, with bend radii that meet code minimums —
bending too sharply (too small a radius) can crack or weaken the
bar at the bend, especially in larger diameter bars. Bends are
planned before cutting, from the BBS, not improvised on site, since
an incorrectly bent bar usually can't be re-bent to the correct shape
without weakening it.`,
      },
      'bar-placement': {
        title: 'Bar Placement',
        body: `Bars are placed at the spacing and position shown on the
reinforcement drawing, tied at intersections with binding wire (not
just laid loose, which lets them shift during the pour), and held at
the correct height and cover using cover blocks or chairs — placement
is the stage where a design's careful calculations either survive
contact with the real site or don't; bars placed in the wrong
position deliver a different, weaker structural behavior than the
one that was actually designed and checked.`,
      },
      lapping: {
        title: 'Lapping',
        body: `Where two bars need to continue a load path but can't be one
continuous length (which is most of the time, since bars come in
limited standard lengths), they're lapped — overlapped by a
calculated development length and tied together. Laps are
deliberately staggered (not all bars in a section lapped at the same
point) and located away from a member's maximum-moment zone wherever
possible, since a lap is inherently a slightly weaker point than
continuous bar and shouldn't coincide with where the member is most
highly stressed.`,
      },
      anchorage: {
        title: 'Anchorage',
        body: `Anchorage is how a bar transfers its force into the surrounding
concrete at its end — through straight embedment length, a hook, or a
mechanical anchor — long enough that the bar can reach its full
design stress before it would pull out of the concrete. Under-length
anchorage (a bar cut too short at a critical end, or a hook omitted
where the drawing calls for one) is a quiet failure mode: it often
doesn't show up until the member is actually loaded near its design
capacity, well after construction is finished and inspected.`,
      },
      'cover-block': {
        title: 'Cover Block',
        body: `Cover blocks (or chairs) hold reinforcement away from the formwork
face by the exact cover distance specified in the drawing — enough to
protect the steel from corrosion and fire, but not so much that the
steel sits too far from where it's structurally needed. Missing or
crushed cover blocks are one of the most common, most preventable
site defects: steel that ends up touching the formwork face has
essentially zero cover once the formwork is struck, and corrodes far
faster than designed.`,
      },
      'reinforcement-detailing': {
        title: 'Reinforcement Detailing',
        body: `Reinforcement detailing is the drawing work that turns a structural
analysis result (this beam needs this much steel) into buildable
instructions (bars of this size, this shape, at these locations, with
these laps and anchorages) — good detailing anticipates real
construction sequence and congestion (can all these bars actually fit
and be tied at a busy beam-column joint?) rather than just satisfying
calculated steel area on paper.`,
      },
      'concrete-mix': {
        title: 'Concrete Mix / Mixing',
        body: `A concrete mix combines cement, sand, aggregate, and water in
proportions designed to hit a target strength grade while staying
workable enough to place and compact properly. Mix proportions are a
design decision, not something to adjust freely on site by feel —
adding extra cement "to be safe" or extra water "to make it easier to
pour" both change the concrete's actual behavior away from what was
designed and tested.`,
      },
      'water-cement-ratio': {
        title: 'Water Cement Ratio',
        body: `The water-cement ratio — how much water is used relative to cement,
by weight — is one of the single most important variables in
concrete strength: too much water (a common site shortcut to make
concrete easier to place) dramatically weakens the hardened concrete,
even though it makes the wet mix look and feel easier to work with.
This is exactly why "just add a bit more water" is one of the most
damaging habits on an unsupervised site, despite seeming harmless in
the moment.`,
      },
      'slump-test-practice': {
        title: 'Slump Test',
        body: `The slump test measures a concrete batch's workability before
placing — filling a standard cone, lifting it, and measuring how much
the concrete slumps down. It's a quick site quality check performed
on every batch (or at defined intervals) specifically to catch a mix
that's drifted from its design water content before it gets poured
into the structure, not just a formality performed for records. This
platform's Slump Test lab (Part 7) lets you run this exact test on
simulated data.`,
      },
      casting: {
        title: 'Casting',
        body: `Casting (placing concrete into formwork) should proceed
continuously for a given structural element wherever possible, in
planned layers, without letting one layer begin to set before the
next is placed on top of it (which would create a weak, poorly-bonded
"cold joint" mid-element rather than at a planned construction
joint). Concrete should be placed as close as possible to its final
position, not dumped from height or dragged long distances with a
vibrator, both of which cause segregation.`,
      },
      'vibrating-compaction': {
        title: 'Vibrating / Compaction',
        body: `Vibration compacts freshly placed concrete, working entrapped air
out and helping the mix flow fully around reinforcement and into
corners of the formwork. Under-vibration leaves voids (visible later
as "honeycombing" — a rough, gap-filled concrete surface) —
over-vibration causes segregation, with heavier aggregate settling
and a weak layer of cement paste rising to the top. Vibration is
applied systematically and briefly at each location, not held in one
spot indefinitely or skipped in hard-to-reach corners.`,
      },
      curing: {
        title: 'Curing',
        body: `Curing keeps concrete moist (and within a reasonable temperature
range) for a sustained period after casting — typically at least 7
days for ordinary conditions — so the cement hydration reaction that
actually builds strength can continue properly. Concrete that's
allowed to dry out early stops gaining strength at whatever point it
dried, permanently, not temporarily — inadequate curing is one of the
most common, most preventable causes of concrete not reaching its
design strength, especially in Bangladesh's hot climate where
surface water evaporates fast.`,
      },
      'concrete-failure': {
        title: 'Concrete Failure / Failures',
        body: `Concrete failures on site show up in recognizable patterns:
honeycombing (poor compaction), plastic shrinkage cracks (surface
drying too fast before the concrete has set), later drying shrinkage
cracks (inadequate curing or joint spacing), and structural cracks
under load (usually a sign of a genuine design, detailing, or
construction defect rather than a material issue alone). Correctly
identifying which pattern is present is the first step to finding the
real cause rather than guessing.`,
      },
      'isolated-footing': {
        title: 'Isolated Footing',
        body: `An isolated footing supports a single column, spreading its point
load over a wider footing area so the resulting pressure on the soil
stays within the soil's safe bearing capacity. It's the simplest,
most economical foundation type where soil is reasonably strong and
columns are far enough apart that individual footings don't
overlap or interfere with each other.`,
      },
      'combined-footing': {
        title: 'Combined Footing',
        body: `A combined footing supports two (or occasionally more) columns on
one shared footing — used when individual isolated footings would be
too close together (would overlap) or when a column sits right at a
property line and its footing can't extend past that line on one
side, so it's combined with the next interior column's footing to
balance the resulting pressure.`,
      },
      'raft-foundation': {
        title: 'Raft Foundation',
        body: `A raft (or mat) foundation is one continuous slab supporting the
entire building footprint, used where soil bearing capacity is low
enough that individual footings would need to be uneconomically large
or would end up covering most of the footprint anyway — at that
point, one continuous raft is usually simpler and more effective than
many overlapping individual footings, and also better distributes
any differential settlement across the whole structure.`,
      },
      'pile-foundation': {
        title: 'Pile Foundation',
        body: `A pile foundation transfers building load down through weak upper
soil layers to either a deeper, stronger bearing stratum (end-bearing
piles) or relies on friction between the pile surface and the
surrounding soil along its length (friction piles) where no strong
stratum exists at a reasonable depth. This is common across much of
Bangladesh's soft, alluvial soil, where a shallow foundation often
can't reach adequate bearing capacity at a practical depth.`,
      },
      subgrade: {
        title: 'Subgrade',
        body: `The subgrade is the prepared, compacted natural ground a road is
built on top of — every layer above it depends on the subgrade being
brought to consistent, adequate strength first. A soft or
inconsistently compacted subgrade undermines the whole pavement
structure regardless of how well the layers above it are built,
which is why subgrade preparation gets disproportionate attention
relative to how little of it is ever visible once the road is
finished.`,
      },
      subbase: {
        title: 'Subbase',
        body: `The sub-base sits directly on the subgrade — typically a granular
material — and serves to spread load from the layers above across a
wider area of subgrade, improve drainage away from the pavement
structure, and provide a stable working platform for constructing the
layers above it. A poorly compacted or contaminated (mixed with
subgrade soil) sub-base loses most of its load-spreading benefit.`,
      },
      'base-course': {
        title: 'Base Course',
        body: `The base course, above the sub-base, is typically a stronger
granular or stabilized material carrying most of the structural load
transfer down through the pavement system. Aggregate quality here
matters directly — material that fails impact or crushing value
testing breaks down under repeated traffic loading, which shows up
later as rutting or potholing that often gets blamed on the visible
asphalt surface when the real cause is several layers below it.`,
      },
      'asphalt-work': {
        title: 'Asphalt Work',
        body: `Asphalt (bituminous) layers — binder course and wearing course —
sit on top of the base course and need to be laid at the correct
temperature (asphalt that's too cool compacts poorly and never
reaches its design density) and compacted promptly before it cools
past a workable temperature. Joints between adjacent paving passes
need particular care, since a poorly compacted longitudinal joint is
a common early failure point.`,
      },
      'road-compaction': {
        title: 'Road Compaction',
        body: `Every pavement layer — subgrade, sub-base, base, and asphalt — needs
compaction checked against a target density (from a compaction test
like the one on this platform's Labs) rather than judged only by
visual appearance or the number of roller passes performed. Under-
compaction at any single layer, even if every other layer is built
perfectly, creates a weak point that leads to premature settlement or
rutting at exactly that depth.`,
      },
      ppe: {
        title: 'PPE (Personal Protective Equipment)',
        body: `Personal Protective Equipment — helmet, safety boots, high-visibility
vest, and task-specific items like harnesses for work at height or
respirators for dusty work — is the minimum baseline for anyone in an
active work area, not an optional extra for particularly hazardous
tasks. The habit that actually prevents injuries is consistent,
site-wide PPE culture enforced for everyone including supervisors and
visitors, not selective enforcement only on visibly risky tasks.`,
      },
      scaffolding: {
        title: 'Scaffolding',
        body: `Scaffolding needs to be erected on stable, level ground with base
plates (and sole boards on soft ground), properly braced, tied to the
structure at regular intervals once it rises beyond a certain height,
and tagged/inspected before use and after any modification. An
untagged or visibly modified scaffold (boards removed for material
access and not replaced, for instance) should be treated as unsafe
until re-inspected, not used based on how it looked last time.`,
      },
      'electrical-safety': {
        title: 'Electrical Safety',
        body: `Site electrical safety means temporary wiring and distribution
boards are protected from water and physical damage, circuits are
protected with appropriate breakers/RCDs, and work near
overhead or buried services accounts for safe clearance distances
before excavation or crane operation nearby. Improvised, exposed, or
water-exposed temporary wiring is a common site hazard precisely
because it's treated as "temporary" and therefore less rigorously
maintained than permanent electrical work.`,
      },
      'crane-safety': {
        title: 'Crane Safety',
        body: `Crane safety on site depends on the crane being set up on
verified-adequate ground bearing capacity (a crane that looks stable
can still tip if the ground beneath its outriggers isn't checked),
load charts being respected for the actual radius and angle being
used (not just the load weight in isolation), and a clear, enforced
exclusion zone under the load path — most serious crane incidents
involve either ground failure under an outrigger or a load path that
wasn't actually kept clear of personnel.`,
      },
      'site-risk-management': {
        title: 'Site Risk Management',
        body: `Site risk management means identifying foreseeable hazards for each
activity before it starts (not generically for the site as a whole),
assigning a clear control measure for each one, and revisiting that
assessment when conditions change — a risk assessment done once at
project start and never revisited stops reflecting the site's actual
current risks within weeks, as the work itself changes from
excavation to structure to finishing, each with genuinely different
hazards.`,
      },
    },
    mistakes: {
      'mistake-curing': {
        title: 'Skipping or shortening curing',
        body: 'Concrete that isn\'t kept moist for the first several days permanently loses strength it can never fully recover — not "some" strength temporarily, but strength gain that stops at whatever point the concrete dried out. This is one of the most common and most avoidable site defects, especially in hot climates where surface water evaporates within hours if curing isn\'t actively maintained. The fix is simple and cheap relative to the cost of the defect: keep every cast surface wet (ponding, wet hessian, or a curing compound) for at least 7 days, not "until it looks dry-ish."',
      },
      'mistake-layout': {
        title: 'Rushing layout to start "real work" sooner',
        body: 'An error in layout — a column position off by even a few centimeters, a grid line misread — costs almost nothing to fix at the layout stage: erase the mark, remeasure, remark. The same error caught after excavation, or worse, after a foundation is cast, can mean expensive rework or, in bad cases, demolition. Layout feels like it isn\'t "real progress" compared to visible excavation or casting, which is exactly why it gets rushed — but it\'s the stage where mistakes are cheapest to catch.',
      },
      'mistake-cover': {
        title: 'Missing or crushed cover blocks',
        body: 'Cover blocks get kicked out of place, crushed underfoot, or simply forgotten during a busy pour, letting reinforcement sag or shift until it touches the formwork face. Once the formwork is struck, that steel has essentially zero cover instead of the specified amount, and corrodes far faster than the design assumed — a defect that\'s invisible on the day of the pour and only becomes visible as rust staining or spalling years later. Checking cover block placement immediately before every pour, not just once during rebar tying, is the practical fix.',
      },
      'mistake-lap-location': {
        title: 'Lapping all bars at the same critical section',
        body: 'A lap is inherently a slightly weaker point in a bar than continuous, unbroken steel — which is exactly why laps are supposed to be staggered and kept away from a member\'s maximum-moment location. Lapping every bar in a section at the same point (often done simply because it\'s the easiest place to plan the cut) concentrates that weakness exactly where the member is least able to tolerate it. The reinforcement detailing (drawing) should show where laps go; site placement should follow that, not default to whatever\'s most convenient to tie.',
      },
      'mistake-water-added': {
        title: '"Just add a bit more water" to make it easier to pour',
        body: 'Extra water makes a concrete batch noticeably easier to place and finish in the moment, which is exactly why this shortcut is so tempting on a hot, tiring pour day — and exactly why it\'s so damaging, since it directly and significantly weakens the hardened concrete\'s final strength regardless of how good the mix looked going in. The slump test exists specifically to catch this before it becomes a permanent, un-fixable part of the structure — a batch that fails its slump test should be rejected, not adjusted with more water on site.',
      },
      'mistake-founding-level': {
        title: 'Casting a footing before confirming the founding level matches the soil report',
        body: 'The founding level (the depth at which a footing actually bears) needs to match what the soil investigation confirmed as adequate bearing capacity — not just whatever depth the excavation happened to reach. Casting blinding concrete and reinforcement before an engineer confirms the exposed soil at the base of the excavation actually matches the assumed bearing condition risks a foundation bearing on weaker soil than it was designed for, a mistake that\'s essentially impossible to correct after the fact without demolition.',
      },
      'mistake-subgrade-skip': {
        title: 'Treating subgrade preparation as a formality',
        body: 'Because the subgrade is invisible once the road is finished, it\'s tempting to treat its preparation as a quick formality before getting to the more visible sub-base and asphalt work. But a soft or inconsistently compacted subgrade undermines every layer built on top of it, no matter how well those layers are constructed — a road that fails within a year or two, when every visible layer looks like it was built correctly, very often traces back to inadequate subgrade preparation that nobody checked at the time.',
      },
      'mistake-ppe-culture': {
        title: 'Enforcing PPE only for visibly risky tasks',
        body: 'PPE compliance that\'s enforced only when a task looks obviously dangerous (working at height, near a crane) while being ignored for routine tasks (walking through a general work area, minor material handling) creates a culture where PPE is seen as task-specific rather than baseline — which means it\'s also skipped on the days a routine task unexpectedly turns hazardous (an unplanned lift, an unexpected fall hazard). Consistent, site-wide enforcement for everyone present, on every task, is what actually builds the habit that holds up when something goes wrong unexpectedly.',
      },
    },
  },
  lab: {
    equipment: 'Equipment',
    procedure: 'Procedure',
    runTest: 'Run Test',
    labReport: 'Lab Report',
    continueButton: 'Continue',
    generateReport: 'Generate report',
    runTheTest: 'Run the test',
    runTheSurvey: 'Run the survey',
    saveReport: 'Save report',
    saving: 'Saving…',
    savedToHistory: 'Saved to your lab history.',
    saveThisRun: 'Save this run to your lab history.',
    loginToSave: 'Log in to save this report to your lab history.',
    saveError: 'Something went wrong saving this report. Try again.',
    notRegistered: 'This lesson is marked as a lab, but no simulation is registered for it yet.',
  },
  sieveAnalysis: {
    title: 'Sieve Analysis (Gradation Test)',
    equipmentIntro: "Before running the test, here's what a soil mechanics lab uses for a sieve analysis:",
    equipmentItems: [
      { name: 'Standard sieve set', detail: '19mm down to 0.075mm (No. 200), stacked coarsest to finest' },
      { name: 'Mechanical sieve shaker', detail: 'Ensures consistent, repeatable agitation time' },
      { name: 'Balance', detail: 'Accurate to 0.1 g, for weighing retained material per sieve' },
      { name: 'Oven', detail: 'For drying the sample to constant mass before testing' },
      { name: 'Sample splitter or quartering cloth', detail: 'To obtain a representative test portion' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Oven-dry the sample and record its total mass.',
      'Arrange sieves in a stack, coarsest opening on top, finest on the bottom, with a pan underneath.',
      'Pour the sample into the top sieve and place the stack in the mechanical shaker.',
      'Shake for a standard duration (commonly 10 minutes) to let particles settle onto the sieve matching their size.',
      'Remove each sieve in turn and weigh the material retained on it.',
      'Record retained mass per sieve, then compute cumulative retained and percent passing.',
    ],
    dataEntryIntro: 'Pre-filled with a representative sample — edit any value to run your own numbers. Retained mass is in grams.',
    totalMassLabel: 'Total sample mass (g)',
    sieveColumnLabel: 'Sieve (mm)',
    retainedColumnLabel: 'Retained (g)',
    sumRetainedLabel: (sum, total) => `Sum retained: ${sum} g / ${total} g`,
    massBalanceWarning: 'Retained mass exceeds total sample mass — check your entries.',
    panLabel: 'Pan (passing finest sieve)',
    classificationInsufficientData:
      'Insufficient data to classify — D10 could not be determined from this curve (less than 10% passed the finest sieve tested).',
    classificationWellGraded:
      'Well-graded (Cu > 4, 1 ≤ Cc ≤ 3) — a broad, continuous range of particle sizes fills voids efficiently, generally favorable for compaction and bearing capacity.',
    classificationPoorlyGraded: (reasons) =>
      `Poorly-graded (uniformly or gap-graded) — ${reasons}. This is a simplified Cu/Cc check; a full USCS classification would also need fines content and plasticity data.`,
    reasonCuNotGreaterThan4: (cu) => `Cu = ${cu} is not greater than 4`,
    reasonCcOutsideRange: (cc) => `Cc = ${cc} is outside the 1–3 range`,
    and: 'and',
  },
  slumpTest: {
    title: 'Slump Test (Workability)',
    equipmentIntro:
      "The slump test needs almost no equipment — that simplicity is exactly why it's the most common field workability check on a construction site.",
    equipmentItems: [
      { name: 'Slump cone (Abrams cone)', detail: '200mm bottom Ø, 100mm top Ø, 300mm height' },
      { name: 'Tamping rod', detail: '16mm diameter, 600mm long, rounded end' },
      { name: 'Base plate', detail: 'Flat, non-absorbent, rigid surface' },
      { name: 'Scoop and rule', detail: 'For filling the cone and measuring the slump' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Dampen the cone and base plate, and place the cone on the base plate.',
      'Fill the cone in three layers of roughly equal volume (about 1/3 the height each).',
      'Tamp each layer 25 times with the rounded end of the rod, distributing strokes evenly across the cross-section.',
      'Strike off excess concrete level with the top of the cone.',
      'Remove the cone by lifting it straight up smoothly, in about 5–10 seconds, with no lateral or twisting motion.',
      'Immediately measure the vertical drop of the center of the slumped concrete relative to the cone height, and observe the shape of the slumped mass.',
    ],
    dataEntryIntro: 'Set how far the concrete slumped, and how it slumped. Real field data — this isn\'t a fixed "correct" reading.',
    centerDropLabel: 'Center drop',
    failureShapeLabel: 'Failure shape observed',
    trueSlump: 'True slump',
    shear: 'Shear',
    collapse: 'Collapse',
    trueSlumpDesc: 'The mass settles evenly, keeping roughly its molded shape — a valid reading.',
    shearDesc: 'One side shears off and slides — this reading is not valid; a real test must be redone with a fresh sample.',
    collapseDesc: 'The mass collapses completely — usually signals a very wet or segregated mix.',
    invalidReading: 'Invalid reading',
    slumpResult: (mm) => `${mm} mm slump`,
    bandVeryLow: 'Very low',
    bandLow: 'Low',
    bandMedium: 'Medium',
    bandHigh: 'High',
    bandVeryHigh: 'Very high (flowing)',
    bandCollapse: 'Collapse',
    descVeryLow: 'Needs mechanical vibration to compact. Typical for road bases and mass concrete.',
    descLow: 'Compacts with normal vibration. Typical for lightly reinforced sections.',
    descMedium: 'Workable by hand compaction. Typical for ordinary reinforced slabs and beams.',
    descHigh: 'For congested reinforcement or where placement is difficult. Common for pumped concrete.',
    descVeryHigh: 'Self-compacting or near self-compacting mix — flows into place with minimal vibration.',
    descCollapseTrue:
      'Collapse — the mix is very wet or segregated. A true collapse slump usually signals too much water or poor aggregate grading rather than a "very high workability" mix in the useful sense.',
    descShearInvalid:
      "Shear slump — one side of the mass sheared off and slid down rather than the whole mass settling evenly. This reading is not representative of the mix's true workability.",
    invalidRetest: 'Invalid — retest with a fresh sample',
  },
  aggregateImpact: {
    title: 'Aggregate Impact Value Test',
    equipmentIntro:
      'This test measures resistance to sudden shock — a different property from resistance to gradual crushing load, which is why road surfacing aggregate is tested this way specifically.',
    equipmentItems: [
      { name: 'Impact testing machine', detail: 'Guided hammer, mass 13.5–14 kg, drop height 380mm' },
      { name: 'Cylindrical steel cup', detail: 'Standard internal diameter and depth per BS 812' },
      { name: '2.36mm and other sieves', detail: 'To prepare the test fraction and sieve the crushed sample after impact' },
      { name: 'Balance', detail: 'Accurate to 1 g' },
      { name: 'Oven', detail: 'For drying the sample to constant mass before testing' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Oven-dry the aggregate sample and sieve to isolate the fraction passing 12.5mm and retained on 10mm.',
      'Fill the cup in three layers, tamping each layer 25 times, then weigh the filled sample.',
      'Place the cup in the impact-testing machine under the guided hammer.',
      'Apply exactly 15 blows, each from a free fall of 380mm, at an interval of about 1 second between blows.',
      'Remove the crushed sample and sieve it through a 2.36mm sieve.',
      'Weigh the material passing the 2.36mm sieve and compute the Aggregate Impact Value.',
    ],
    dataEntryIntro: 'Pre-filled with a representative result — edit either mass to run your own numbers.',
    originalMassLabel: 'Original sample mass (g)',
    passingMassLabel: 'Mass passing 2.36mm sieve (g)',
    massInvalidWarning: "Passing mass can't exceed the original sample mass — check your entries.",
    lowerIsHigher: 'Lower AIV = tougher aggregate',
    gradeExceptional: 'Exceptionally strong',
    gradeStrong: 'Strong',
    gradeSatisfactory: 'Satisfactory for lower-duty use',
    gradeWeak: 'Weak',
    suitExceptional: 'Suitable for heavy-duty concrete floors and road surfacing subject to high impact.',
    suitStrong: 'Suitable for wearing surfaces and road pavement — the typical range for good road aggregate.',
    suitSatisfactory: 'Acceptable for road sub-base and for concrete other than wearing surfaces.',
    suitWeak: 'Generally unsuitable for pavement wearing surfaces; may still suit lower-grade fill or sub-base use.',
  },
  levelling: {
    title: 'Differential Levelling (Rise & Fall)',
    equipmentIntro: 'Equipment for a standard differential levelling survey:',
    equipmentItems: [
      { name: 'Automatic (auto) level or dumpy level', detail: 'Provides a fixed horizontal line of sight' },
      { name: 'Levelling staff', detail: "Graduated rod, commonly 4m or 5m, read against the instrument's crosshair" },
      { name: 'Tripod', detail: 'Stable mounting for the level instrument' },
      { name: 'Field book', detail: 'For recording BS/IS/FS readings in the standard rise-and-fall or HPC format' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Set up the level over a stable position with a clear line of sight to the starting Bench Mark (BM).',
      'Take a Back Sight (BS) reading on the BM — this is the first entry, establishing the starting known elevation.',
      'Take Intermediate Sight (IS) readings on any other visible points from this same setup, without moving the instrument.',
      'Take a Fore Sight (FS) reading on a stable "change point" before moving the instrument to a new setup.',
      'Move the instrument, take a new Back Sight on the same change point, and continue the process to the next points.',
      "Repeat until the last point is reached, then run the arithmetic check (ΣBS − ΣFS = ΣRise − ΣFall = Last RL − First RL) to confirm the booking has no arithmetic error.",
    ],
    dataEntryIntro: 'Pre-filled with a representative 4-station field book — edit any reading to run your own numbers.',
    startingRlLabel: 'Starting RL (BM), m',
    stationColumn: 'Station',
    bsColumn: 'BS (m)',
    isColumn: 'IS (m)',
    fsColumn: 'FS (m)',
    riseColumn: 'Rise',
    fallColumn: 'Fall',
    rlColumn: 'RL',
    checkAgree: (a, b, c) =>
      `ΣBS − ΣFS = ${a}, ΣRise − ΣFall = ${b}, Last RL − First RL = ${c} — all three agree.`,
    checkDisagree: (a, b, c) =>
      `ΣBS − ΣFS = ${a}, ΣRise − ΣFall = ${b}, Last RL − First RL = ${c} — these should match but don't. Check the booking for an arithmetic error.`,
  },
  compressionTest: {
    title: 'Compression Test (Concrete Cube Strength)',
    equipmentIntro:
      'This is the test concrete strength is actually judged on — the slump test checks whether fresh concrete can be placed properly; this checks whether the hardened result meets its specified strength.',
    equipmentItems: [
      { name: 'Cube mould', detail: '150mm × 150mm × 150mm, standard BNBC/BS cube' },
      { name: 'Compression testing machine', detail: 'Calibrated, capable of applying load at a controlled rate to failure' },
      { name: 'Curing tank', detail: 'Water curing at standard temperature until the test age (28 days)' },
      { name: 'Balance and callipers', detail: 'For checking cube mass and dimensions before testing' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Cast the cube in three layers, compacting each layer thoroughly, and cure it in water until the test age.',
      'Remove the cube from the curing tank and wipe off surface water just before testing.',
      'Check the cube dimensions — the area used in the strength calculation should reflect the actual cube tested, not just the nominal mould size.',
      'Place the cube centrally in the compression testing machine, ensuring the load is applied to the cast faces, not the trowelled top.',
      'Apply load at a steady, controlled rate until the cube fails, and record the maximum load reached.',
      'Compute strength as failure load divided by the bearing area, and compare it against the specified grade.',
    ],
    dataEntryIntro: 'Set the failure load and pick the specified grade — pre-filled with a result that clears M20.',
    loadLabel: 'Failure load (kN)',
    gradeLabel: 'Specified grade (fck)',
    areaNote: (sideMm) => `Using a standard ${sideMm}mm cube (area = ${sideMm}² mm²) to convert load to stress.`,
    strengthResult: (mpa) => `${mpa} MPa`,
    acceptMeetsOrExceeds: 'Meets or exceeds the specified grade',
    acceptBelowMargin: 'Below target, within the acceptance margin',
    acceptFails: 'Fails acceptance — well below the specified grade',
    explainMeetsOrExceeds: (fck) =>
      `This result meets or exceeds the M${fck} target — a clean pass for this individual specimen.`,
    explainBelowMargin: (fck, margin) =>
      `This result is below M${fck}, but within the ${margin.toFixed(1)} MPa margin codes allow for a single specimen — not an automatic failure, but worth confirming against the average of 3 consecutive tests before drawing a conclusion.`,
    explainFails: (fck, margin) =>
      `This result falls more than ${margin.toFixed(1)} MPa below the M${fck} target — outside the acceptable margin for even a single specimen. This would trigger further investigation on a real site, not just a "wait and average" response.`,
    singleSpecimenNote:
      'Full batch acceptance (ACI 318-19 §26.12.3.1) also requires the average of 3 consecutive tests to meet the specified strength — this report evaluates one cube at a time.',
  },
  atterbergLimits: {
    title: 'Atterberg Limits (Liquid Limit & Plastic Limit)',
    equipmentIntro:
      'While Sieve Analysis classifies soil by particle size, Atterberg Limits classify fine-grained soil by how it behaves at different moisture contents — a property particle size alone can\'t capture.',
    equipmentItems: [
      { name: 'Casagrande liquid limit device', detail: 'Brass cup, cam-driven drop mechanism, standard 10mm fall height' },
      { name: 'Grooving tool', detail: 'Cuts a standard groove in the soil pat before each blow-count trial' },
      { name: 'Glass plate', detail: 'Flat rolling surface for the plastic limit thread test' },
      { name: 'Moisture tins and oven', detail: 'For determining moisture content of each trial by oven-drying' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Mix the soil sample with water to a firm paste and place it in the Casagrande cup, levelling the surface.',
      'Cut a standard groove down the center of the pat with the grooving tool.',
      'Turn the crank at a steady rate and count the blows needed for the groove to close 13mm along its length.',
      'Take a moisture-content sample from near the closed groove, and repeat at 3–4 different water contents spanning roughly 15–35 blows.',
      'Separately, roll a soil thread on the glass plate to 3mm diameter — the plastic limit is the moisture content at which the thread just crumbles at that diameter.',
      'Plot the trials as a flow curve (moisture % vs. log of blow count) and read the Liquid Limit at N = 25.',
    ],
    dataEntryIntro: 'Pre-filled with 4 representative flow-curve trials and a plastic limit reading — edit any value to run your own numbers.',
    llTrialsLabel: 'Liquid limit trials',
    blowsColumn: 'Blows (N)',
    moistureColumn: 'Moisture (%)',
    plLabel: 'Plastic limit (%)',
    aLineNote: (aLinePi) => `A-line PI at this LL ≈ ${aLinePi.toFixed(1)} — the boundary this sample's PI is compared against.`,
    insufficientData: 'Need at least 2 valid trials with different blow counts to fit a flow curve.',
    groupCL: 'CL — Low-plasticity clay',
    groupCH: 'CH — High-plasticity clay',
    groupML: 'ML — Low-plasticity silt',
    groupMH: 'MH — High-plasticity silt',
    groupNonPlastic: 'Non-plastic to slightly plastic',
    descCL: 'Plasticity Index sits above the A-line with LL under 50 — behaves like a typical lean clay: cohesive, but not as compressible or shrink/swell-prone as a high-plasticity clay.',
    descCH: 'Plasticity Index sits above the A-line with LL at or over 50 — a fat clay, cohesive and notably compressible, with significant shrink/swell behavior that matters for foundation design.',
    descML: 'Plasticity Index sits below the A-line with LL under 50 — behaves like a low-plasticity silt: less cohesive than a clay at the same liquid limit, more prone to losing strength when saturated.',
    descMH: 'Plasticity Index sits below the A-line with LL at or over 50 — an elastic silt, combining high liquid limit with silt-like (not clay-like) plasticity behavior.',
    descNonPlastic: 'Plasticity Index under 4 — this sample barely holds together as a plastic material at all; classification by particle size (sieve analysis) matters more than plasticity here.',
  },
  bitumenPenetration: {
    title: 'Bitumen Penetration Test',
    equipmentIntro: 'This test grades bitumen by hardness — the property that determines which climate and traffic conditions a given batch is suited for.',
    equipmentItems: [
      { name: 'Penetrometer', detail: 'Standard needle assembly, 100g combined load (50g needle + 50g weight)' },
      { name: 'Water bath', detail: 'Maintains the sample at 25°C ± 0.1°C during testing' },
      { name: 'Sample container', detail: 'Standard cup, sample poured molten and cooled before testing' },
      { name: 'Stopwatch', detail: 'Times the standard 5-second penetration duration' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Heat and pour the bitumen sample into the container, then cool it to room temperature and condition it in the water bath at 25°C.',
      'Position the sample under the penetrometer needle so the needle just touches the surface.',
      'Release the needle for exactly 5 seconds under the standard 100g load and measure the penetration depth.',
      'Repeat at a different point on the same sample (at least 10mm from the edge and from any previous mark) for a total of 3 trials.',
      'Average the three readings, after checking they agree closely enough to trust the result.',
      'Compare the average penetration against the standard grade bands to classify the bitumen.',
    ],
    dataEntryIntro: 'Pre-filled with 3 representative trial readings — edit any value to run your own numbers.',
    trialLabel: (n) => `Trial ${n}`,
    repeatabilityWarning: (spread) => `Trials differ by ${spread} units — repeat the test with a fresh sample area before trusting this result.`,
    penetrationResult: (dmm) => `${dmm} (0.1mm units)`,
    spreadNote: (spread) => `Spread across trials: ${spread} units`,
    gradeStandard: (label) => `Classifies as ${label} penetration grade bitumen.`,
    gradeBetween: (lower, upper) => `Falls between the standard ${lower} and ${upper} grades — a real result, but not a standard commercial grade; on a real project this would prompt a supplier check rather than being filed under either band.`,
    gradeBelowRange: 'Below the common penetration-grade range — unusually hard bitumen for standard paving grades.',
    gradeAboveRange: 'Above the common penetration-grade range — unusually soft bitumen for standard paving grades.',
  },
  flexuralTest: {
    title: 'Flexural Test (Modulus of Rupture)',
    equipmentIntro:
      'Compression tells you how concrete handles being squeezed; this test tells you how it handles being bent — the property that actually governs unreinforced elements like pavement slabs.',
    equipmentItems: [
      { name: 'Beam mould', detail: '150mm × 150mm × 750mm standard prism' },
      { name: 'Flexural testing machine', detail: 'Third-point loading rig — two point loads, each L/3 from a support' },
      { name: 'Curing tank', detail: 'Water curing at standard temperature until the test age' },
      { name: 'Callipers', detail: 'For measuring exact beam width, depth, and fracture location' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Cast and cure the beam to the test age, same as a compression cube.',
      'Set the beam on the support rollers with a 450mm span (3× the depth) and position the two load points at the third-points of the span.',
      'Apply load at a steady rate until the beam fractures.',
      'Record the maximum load and measure exactly where the fracture line crosses the tension face, relative to the beam center.',
      'Check whether the fracture falls inside the middle third of the span (between the two load points) or outside it — this determines which formula applies.',
      'Compute the modulus of rupture using the appropriate formula for where the beam actually broke.',
    ],
    dataEntryIntro: 'Pre-filled with a center-of-span fracture — try moving the fracture point out toward a support and watch the formula switch.',
    loadLabel: 'Failure load (kN)',
    fractureOffsetLabel: 'Fracture offset from center (mm)',
    spanNote: (spanMm) => `Standard span = ${spanMm}mm (3× the 150mm depth), third-point loading.`,
    strengthResult: (mpa) => `${mpa} MPa`,
    formulaMiddleThird: 'Fracture within the middle third — R = PL/bd²',
    formulaOutsideMiddleThird: 'Fracture outside the middle third — R = 3Pa/bd²',
    explainMiddleThird:
      'The fracture happened in the middle third of the span, where bending moment is uniform between the two load points — the standard formula applies directly.',
    explainOutsideMiddleThird: (distanceMm) =>
      `The fracture happened outside the middle third, ${distanceMm}mm from the nearest support — bending moment isn't uniform there, so the strength is computed from that distance directly rather than the full span length.`,
    explainInvalid:
      "The fracture is far enough outside the middle third that ASTM C78 calls for discarding this result — something about the specimen or the test setup (a flaw, a loading misalignment) likely affected where it broke, so the number wouldn't reliably represent the concrete's actual flexural strength.",
  },
  compactionTest: {
    title: 'Compaction Test (Standard Proctor)',
    equipmentIntro:
      'Compacted soil needs to be dense enough not to settle or deform under load — this test finds the moisture content that lets a given compactive effort achieve the highest density.',
    equipmentItems: [
      { name: 'Proctor mould', detail: 'Standard 1000 cm³ cylindrical mould with a removable collar' },
      { name: 'Rammer', detail: '2.5 kg standard rammer, 305mm drop height' },
      { name: 'Balance', detail: 'For weighing the compacted wet soil in the mould' },
      { name: 'Moisture tins and oven', detail: 'For determining the moisture content of each trial' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Mix a soil sample to a chosen moisture content and compact it into the mould in three layers, 25 blows per layer with the standard rammer.',
      'Weigh the compacted soil (with the mould) to get the wet mass, then take a moisture-content sample.',
      'Empty the mould and repeat at a different moisture content — wetter or drier than the last trial — for a total of 5 trials spanning a range likely to bracket the peak.',
      'Compute the dry density of each trial and plot it against moisture content.',
      'Fit a curve through the points and read off the peak — the Optimum Moisture Content (OMC) and the Maximum Dry Density (MDD) achieved at that moisture content.',
    ],
    dataEntryIntro: 'Pre-filled with 5 representative trials — edit any value to run your own numbers.',
    moistureColumn: 'Moisture (%)',
    wetMassColumn: 'Wet mass (g)',
    explainResult:
      'The peak of the fitted curve is the Optimum Moisture Content and Maximum Dry Density — compacting at OMC on a real site gets the densest, most stable result for the same compactive effort.',
    reasonNotEnoughTrials: 'Need at least 3 valid trials to fit a curve and locate a peak.',
    reasonNotConcave:
      "These trials don't trace out a peak-shaped curve — dry density needs to rise, then fall, across the tested range for a compaction curve to make sense.",
    reasonPeakOutsideRange:
      "The fitted curve's peak falls outside the range of moisture contents actually tested — the trials likely didn't bracket the true optimum yet. On a real site, this means testing a wider spread of moisture contents, not trusting an extrapolated number.",
  },
  directShear: {
    title: 'Direct Shear Test',
    equipmentIntro:
      "Atterberg Limits describe how a soil behaves at different moisture contents; this test measures the actual strength parameters — cohesion and friction angle — that go directly into a slope stability or foundation bearing capacity calculation.",
    equipmentItems: [
      { name: 'Shear box apparatus', detail: 'Split box, upper half fixed, lower half driven horizontally' },
      { name: 'Loading yoke', detail: 'Applies a fixed normal (vertical) stress to the sample during shearing' },
      { name: 'Proving ring or load cell', detail: 'Measures the horizontal shear force as the box is driven' },
      { name: 'Dial gauges', detail: 'Track horizontal displacement and vertical (volume change) movement' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Place the soil sample in the split shear box and apply the first normal stress via the loading yoke.',
      'Shear the sample by driving the lower half of the box horizontally at a constant rate, recording the shear force at intervals.',
      'Record the peak shear stress the sample resists before failing along the shear plane.',
      'Repeat with a fresh sample at a higher normal stress, for a total of 3 trials spanning a realistic stress range.',
      'Plot peak shear stress against normal stress and fit the Mohr-Coulomb failure line — the intercept gives cohesion, the slope gives the friction angle.',
    ],
    dataEntryIntro: 'Pre-filled with 3 representative trials — edit any value to run your own numbers.',
    normalStressColumn: 'Normal stress σ (kPa)',
    shearStressColumn: 'Shear stress τ (kPa)',
    cohesionClampedNote: (rawC) =>
      `The raw regression line actually crosses the axis at ${rawC} kPa — negative cohesion isn't physically real, so this is reported as 0 kPa. A small negative intercept like this is normal fitting scatter from just 3 points, not evidence the soil has negative cohesion.`,
    rSquaredNote: (r2) => `Fit quality (R²): ${r2} — how closely the three trials actually lie on a straight line.`,
  },
  totalStation: {
    title: 'Total Station Survey',
    equipmentIntro:
      "Traverse builds a network of stations by moving the instrument leg by leg; a total station instead measures every target directly from one fixed setup — angle and distance together, in a single reading.",
    equipmentItems: [
      { name: 'Total station', detail: 'Combined electronic theodolite (angles) and EDM (distance) in one instrument' },
      { name: 'Prism/reflector', detail: 'Mounted on a pole at each target point, at a known height' },
      { name: 'Tripod', detail: 'Levelled and centered over the known station point' },
      { name: 'Field book or data collector', detail: 'Records bearing, vertical angle, slope distance, and target height per reading' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Set up and level the total station over a station of known coordinates and elevation, and record the instrument height.',
      'Sight the target (prism) and record the horizontal bearing, the vertical angle from horizontal, and the slope distance.',
      'Record the target height — how high the prism sits above the actual ground point being surveyed.',
      'Repeat for each target point visible from this setup.',
      'Reduce each reading to horizontal distance and height difference, then combine with the bearing to get the target\'s full 3D coordinates.',
    ],
    dataEntryIntro: 'Pre-filled with a known station and 3 representative target readings — edit any value to run your own numbers.',
    stationSetupLabel: 'Known station',
    elevationLabel: 'Elevation',
    instrumentHeightLabel: 'Instrument height',
    readingsLabel: 'Target readings',
    targetColumn: 'Target',
    bearingColumn: 'Bearing (°)',
    verticalAngleColumn: 'Vert. angle (°)',
    slopeDistColumn: 'Slope dist (m)',
    targetHeightColumn: 'Target ht (m)',
    explainResult:
      'Each target\'s horizontal distance comes from the slope distance and vertical angle together (not the slope distance alone), and its elevation comes from trigonometric leveling using the same vertical angle — one reading genuinely gives a full 3D position.',
  },
  traverse: {
    title: 'Traverse Survey',
    equipmentIntro:
      'A closed traverse measures a loop of stations back to its own starting point — and because it closes on itself, the small gap between where the math says you ended up and where you actually started becomes a direct, measurable check on how good the whole survey was.',
    equipmentItems: [
      { name: 'Total station or theodolite + EDM', detail: 'Measures bearing and distance for each leg of the traverse' },
      { name: 'Prism/reflector', detail: 'Set up at each traverse station in turn' },
      { name: 'Tripods and tribrachs', detail: 'For precise centering over each station point' },
      { name: 'Field book', detail: 'Records bearing and distance for every leg, in order around the loop' },
    ],
    procedureIntro: 'The standard procedure, in order:',
    procedureSteps: [
      'Set up at the first station and measure the bearing and distance to the next station in the loop.',
      'Move to that station and repeat, working around the loop from station to station.',
      'Continue until the last leg measures back to the starting station, closing the loop.',
      'Resolve each leg into latitude (northing component) and departure (easting component), and sum them across the whole loop.',
      'The sums should be zero for a perfectly closed loop — the actual small residual is the misclosure, distributed back across every leg in proportion to its length (the Bowditch rule) to get adjusted coordinates that close exactly.',
    ],
    dataEntryIntro: 'Pre-filled with a 5-sided closed loop and a small realistic measurement error — edit any value to run your own numbers.',
    legColumn: 'Leg',
    bearingColumn: 'Bearing (°)',
    distanceColumn: 'Distance (m)',
    misclosureLabel: 'Misclosure',
    precisionLabel: 'Precision',
    precisionHigh: 'High-precision survey — this level of closure (better than 1:10,000) is what a good total-station traverse should achieve.',
    precisionAcceptable: 'Acceptable precision for ordinary engineering survey work (better than 1:5,000), though not as tight as a precise control survey would require.',
    precisionBelowStandard: "Below the usual minimum standard for engineering survey work — on a real project this would mean re-measuring rather than just accepting the adjustment.",
    closureNote: 'The adjusted coordinates always close exactly, by construction — the misclosure and precision figures above are what actually tell you whether the raw field measurements were good enough to trust.',
    reasonNotEnoughLegs: 'Need at least 3 legs to enclose an area and form a genuine closed loop.',
    reasonZeroDistance: 'All leg distances are zero or missing — enter real distances for each leg.',
  },
  tools: {
    eyebrow: 'Part 12 — Engineering Tools',
    pageTitle: 'Engineering Tools',
    pageDescription: 'Quick, verified calculators for everyday site and design work — unit conversions through structural quick-checks.',
    categoryBasic: 'Basic Tools',
    categoryCivil: 'Civil Tools',
    categoryAdvanced: 'Advanced Tools',
    toolCount: (n) => `${n} tool${n === 1 ? '' : 's'}`,
    backToTools: 'Back to Tools',
    toolTitles: {
      'unit-converter': 'Unit Converter',
      'area-calculator': 'Area Calculator',
      'volume-calculator': 'Volume Calculator',
      'steel-weight-calculator': 'Steel Weight Calculator',
      'concrete-calculator': 'Concrete Calculator',
      'brick-calculator': 'Brick Calculator',
      'stair-calculator': 'Stair Calculator',
      'slope-calculator': 'Slope Calculator',
      'water-tank-calculator': 'Water Tank Calculator',
      'beam-calculator': 'Beam Calculator',
      'load-calculator': 'Load Calculator',
      'soil-bearing-calculator': 'Soil Bearing Calculator',
    },
    unitConverter: {
      title: 'Unit Converter',
      categoryLabel: 'Category',
      categoryLength: 'Length',
      categoryArea: 'Area',
      categoryVolume: 'Volume',
      categoryMass: 'Mass',
      categoryPressure: 'Pressure',
      categoryForce: 'Force',
      valueLabel: 'Value',
      fromLabel: 'From',
      toLabel: 'To',
    },
    areaCalculator: {
      title: 'Area Calculator',
      shapeLabel: 'Shape',
      shapeRectangle: 'Rectangle',
      shapeTriangle: 'Triangle',
      shapeCircle: 'Circle',
      shapeTrapezoid: 'Trapezoid',
      fieldLength: 'Length',
      fieldWidth: 'Width',
      fieldBase: 'Base',
      fieldHeight: 'Height',
      fieldRadius: 'Radius',
      fieldTopWidth: 'Top width',
      fieldBottomWidth: 'Bottom width',
    },
    volumeCalculator: {
      title: 'Volume Calculator',
      shapeLabel: 'Shape',
      shapeBox: 'Box',
      shapeCylinder: 'Cylinder',
      shapeCone: 'Cone',
      shapeSphere: 'Sphere',
      shapeEarthwork: 'Earthwork (cut/fill)',
      fieldLength: 'Length',
      fieldWidth: 'Width',
      fieldHeight: 'Height',
      fieldRadius: 'Radius',
      fieldArea1: 'Area at station 1',
      fieldArea2: 'Area at station 2',
      fieldDistance: 'Distance between stations',
      earthworkNote: 'Average end-area method: V = ((A₁+A₂)/2) × L — the standard quick estimate for cut/fill volume between two surveyed cross-sections.',
    },
    steelWeight: {
      title: 'Steel Weight Calculator',
      reference: 'W = (π/4)×d²×7850 kg/m³ — exact physics, matches the d²/162.2 rule of thumb to within 0.01%',
      diameterLabel: 'Bar diameter',
      lengthLabel: 'Length per bar',
      quantityLabel: 'Number of bars',
      perMeterLabel: 'Weight per meter',
      totalLabel: 'Total weight',
    },
    concreteCalculator: {
      title: 'Concrete Calculator',
      mixLabel: 'Mix ratio',
      volumeLabel: 'Wet concrete volume needed',
      dryVolumeLabel: 'Dry volume (×1.54)',
      cementLabel: 'Cement',
      sandLabel: 'Sand',
      aggregateLabel: 'Aggregate',
      bagsValue: (n) => `${n} bags (50kg)`,
      assumptionsNote: 'Uses a 1.54× dry volume factor and 1440 kg/m³ loose cement bulk density — both commonly-published figures. Different references use slightly different constants for either value, so treat this as a reliable estimate, not a single universal answer.',
    },
    brickCalculator: {
      title: 'Brick Calculator',
      wallSection: 'Wall',
      wallLengthLabel: 'Wall length',
      wallHeightLabel: 'Wall height',
      wallThicknessLabel: 'Wall thickness',
      brickSection: 'Brick (actual size, no mortar)',
      brickLengthLabel: 'Brick length',
      brickWidthLabel: 'Brick width',
      brickHeightLabel: 'Brick height',
      mortarLabel: 'Mortar joint',
      wastageLabel: 'Wastage allowance',
      wallVolumeLabel: 'Wall volume',
      baseCountLabel: 'Bricks (no wastage)',
      withWastageLabel: 'Bricks (with wastage)',
      brickCountValue: (n) => `${n.toLocaleString()}`,
      estimateNote: 'A volumetric estimate (wall volume ÷ brick+mortar unit volume), not a bond-pattern-specific bricklaying count — real patterns (English, Flemish, stretcher bond) shift the exact number slightly. Tune the brick and mortar dimensions to your actual supplier for a closer estimate.',
    },
    stairCalculator: {
      title: 'Stair Calculator',
      reference: 'Walking-line comfort rule: 2×riser + tread ≈ 600mm',
      totalRiseLabel: 'Total floor-to-floor rise',
      targetRiserLabel: 'Target riser height',
      riserCountLabel: 'Number of risers',
      actualRiserLabel: 'Actual riser height',
      treadCountLabel: 'Number of treads',
      treadLabel: 'Tread depth',
      totalGoingLabel: 'Total going (horizontal run)',
      walkingLineLabel: '2R + T (walking line)',
      riserOutOfRangeWarning: 'Riser height falls outside the typical comfortable range (150–180mm) — consider adjusting the target riser or splitting the flight.',
      walkingLineNote: 'Riser count is rounded to the nearest whole step from your target height, then tread depth is derived to keep 2×riser + tread near 600mm — the standard comfort target for a residential stair.',
    },
    slopeCalculator: {
      title: 'Slope Calculator',
      slopeRatioLabel: 'Slope ratio',
      ratioVerticalPrefix: '',
      ratioHorizontalSuffix: '',
      horizontalDistanceLabel: 'Horizontal distance',
      angleLabel: 'Angle',
      percentLabel: 'Percent grade',
      verticalRiseLabel: 'Vertical rise over that distance',
    },
    waterTank: {
      title: 'Water Tank Calculator',
      peopleLabel: 'Number of people',
      demandLabel: 'Demand per person',
      storageDaysLabel: 'Storage days',
      daysUnit: 'days',
      shapeLabel: 'Tank shape',
      shapeCylindrical: 'Cylindrical',
      shapeRectangular: 'Rectangular',
      diameterLabel: 'Diameter',
      lengthLabel: 'Length',
      widthLabel: 'Width',
      dailyDemandLabel: 'Daily demand',
      requiredVolumeLabel: 'Required storage volume',
      tankHeightLabel: 'Required tank height',
    },
    beamCalculator: {
      title: 'Beam Calculator',
      reference: 'Simply-supported beam, statics — UDL and/or a single point load',
      spanLabel: 'Span',
      udlLabel: 'Uniformly distributed load',
      pointLoadLabel: 'Point load (0 = none)',
      pointLoadPositionLabel: 'Point load position (from left)',
      maxMomentLabel: 'Max bending moment',
      maxShearLabel: 'Max shear force',
      reactionALabel: 'Reaction at left support',
      reactionBLabel: 'Reaction at right support',
      scopeNote: 'A quick design-check tool for a simply-supported beam only — no continuous spans, no combined load-case envelopes, no deflection check. Use the Structural Analysis course for the full picture.',
    },
    loadCalculator: {
      title: 'Load Calculator',
      reference: 'BNBC 2020 / ACI 318-19 strength-level load combination',
      deadLoadLabel: 'Dead load (D)',
      liveLoadLabel: 'Live load (L)',
      windLoadLabel: 'Wind load (W)',
      comboService: 'Service (D+L)',
      comboStrength: 'Strength (1.2D+1.6L)',
      comboWind: 'Wind (1.2D+L+W)',
      governingLabel: 'Governing design load',
      scopeNote: 'Covers the common gravity and simplified wind combinations only — a full design also checks seismic, snow (where relevant), and other BNBC load cases not modeled here.',
    },
    soilBearing: {
      title: 'Soil Bearing Calculator',
      reference: "Terzaghi's bearing capacity equation, general shear case",
      cohesionLabel: 'Cohesion (c)',
      frictionAngleLabel: 'Friction angle (φ)',
      unitWeightLabel: 'Soil unit weight (γ)',
      depthLabel: 'Footing depth (Df)',
      widthLabel: 'Footing width (B)',
      shapeLabel: 'Footing shape',
      shapeStrip: 'Strip',
      shapeSquare: 'Square',
      fosLabel: 'Factor of safety',
      overburdenLabel: 'Overburden pressure (q)',
      ultimateLabel: 'Ultimate bearing capacity (qu)',
      safeLabel: 'Safe bearing capacity (qsafe)',
      tableNote: "Nc and Nq use Terzaghi's closed-form expressions; Nγ uses Terzaghi's original tabulated values (interpolated) since it has no clean closed form — different methods (Meyerhof, Hansen, Vesic) give somewhat different Nγ figures, so treat this as one standard, named method, not the only possible answer.",
    },
  },
  practice: {
    eyebrow: 'Part 14 — Practice & Exam System',
    pageTitle: 'Practice',
    pageDescription: 'MCQ, numerical problems, and creative questions — auto-graded where a computer reliably can, self-reviewed against a model answer where it can\'t.',
    noQuizzesYet: 'No practice quizzes published yet — check back soon.',
    questionCount: (n) => `${n} question${n === 1 ? '' : 's'}`,
    minutesUnit: 'min',
    backToPractice: 'Back to Practice',
    questionProgress: (current, total) => `Question ${current} of ${total}`,
    previous: 'Previous',
    next: 'Next',
    submitQuiz: 'Submit',
    numericalPlaceholder: 'Enter a number',
    cqPlaceholder: 'Write your answer here, then reveal the model answer to self-check.',
    revealModelAnswer: 'Reveal model answer',
    modelAnswerLabel: 'Model answer',
    selfMarkPrompt: 'Compare your answer against this, then mark yourself honestly:',
    selfMarkCorrect: 'I got this right',
    selfMarkIncorrect: 'I got this wrong',
    resultsTitle: 'Results',
    scoreDetail: (correct, total) => `${correct} of ${total} auto-graded questions correct`,
    noAutoGradableQuestions: 'This quiz is entirely self-reviewed (Creative Questions) — no auto-graded score to show, review each answer below.',
    questionLabel: (n) => `Question ${n}`,
    saveError: 'Could not save this attempt — your result is still shown below.',
    saving: 'Saving…',
  },
  search: {
    pageTitle: 'Search',
    pageDescription: 'Courses, lessons, tools, formulas, and engineering terms — one search across everything on the platform.',
    searchPlaceholder: 'Search for anything — "beam moment", "bearing capacity", "slump test"…',
    filterAll: 'All',
    typeCourse: 'Course',
    typeLesson: 'Lesson',
    typeTool: 'Tool',
    typeFormula: 'Formula',
    typeTerm: 'Term',
    noResults: 'No results — try a different term, or browse the formula and term references directly.',
    browseFormulas: 'Browse formulas',
    browseTerms: 'Browse glossary',
    openCalculator: 'Open calculator',
    aiSearchNotConfigured: 'AI Search is not yet configured in this deployment — the results above are all real, ranked search, just not natural-language.',
    categoryStructural: 'Structural',
    categoryGeotechnical: 'Geotechnical',
    categoryConcrete: 'Concrete',
    categorySurvey: 'Survey',
    categoryGeneral: 'General',
  },
  languageSwitcher: {
    label: 'Language',
  },
  common: {
    loading: 'Loading…',
  },
};

export default en;
