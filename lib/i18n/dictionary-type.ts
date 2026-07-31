/**
 * The shape every dictionary (en.ts, bn.ts) must satisfy. Organized by
 * feature area, mirroring the component tree, so it's easy to find where
 * a given string is used and easy to tell if a new component needs a new
 * section here.
 *
 * TypeScript enforces that every key present in one dictionary is present
 * in all of them — see lib/i18n/dictionaries/index.ts, where both
 * dictionaries are typed against this same interface. Forgetting to add a
 * Bengali translation for a new English string is a compile error, not a
 * silent fallback to English in production.
 */

/** Shared shape for every entry in materialLibrary.materials — one
 * type used 10 times rather than the same 8 fields spelled out 10
 * times over. */
export interface MaterialContent {
  title: string;
  summary: string;
  properties: string[];
  advantages: string[];
  disadvantages: string[];
  uses: string[];
  testing: string[];
  marketInfo: string;
}
export interface Dictionary {
  nav: {
    learning: string;
    practical: string;
    tools: string;
    practice: string;
    search: string;
    aiAssistant: string;
    community: string;
    login: string;
    startLearning: string;
    dashboard: string;
    visualizations: string;
    resources: string;
    materials: string;
    premium: string;
    projects: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    tagline: string;
    platformHeading: string;
    ecosystemHeading: string;
    communityHeading: string;
    discussions: string;
    sharedProjects: string;
    careerHub: string;
    copyright: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    startLearning: string;
    browseCurriculum: string;
    beamCaption: string;
    beamDiagramAria: string;
  };
  home: {
    coursesEyebrow: string;
    coursesTitle: string;
    coursesDescription: string;
    practicalEyebrow: string;
    practicalTitle: string;
    practicalDescription: string;
    labEyebrow: string;
    labTitle: string;
    labDescription: string;
    toolsEyebrow: string;
    toolsTitle: string;
    toolsDescription: string;
    aiEyebrow: string;
    aiTitle: string;
    aiDescription: string;
    communityEyebrow: string;
    communityTitle: string;
    communityDescription: string;
    comingLater: string;
    cards: {
      structuralAnalysisTitle: string;
      soilMechanicsTitle: string;
      rccDesignTitle: string;
      coursesLandHere: string;
      siteWorkTitle: string;
      siteWorkDesc: string;
      reinforcementTitle: string;
      reinforcementDesc: string;
      concreteTechTitle: string;
      concreteTechDesc: string;
      concreteLabTitle: string;
      concreteLabDesc: string;
      soilLabTitle: string;
      soilLabDesc: string;
      steelWeightCalcTitle: string;
      concreteCalcTitle: string;
      loadCalcTitle: string;
      soilBearingCalcTitle: string;
      toolsShipLater: string;
      aiTutorTitle: string;
      aiProblemSolverTitle: string;
      aiShipsLater: string;
      discussionsTitle: string;
      engineeringNewsTitle: string;
      topContributorsTitle: string;
      communityShipsLater: string;
    };
  };
  auth: {
    welcomeBack: string;
    loginDescription: string;
    noAccount: string;
    signUp: string;
    createAccount: string;
    signupDescription: string;
    haveAccount: string;
    logIn: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    passwordPlaceholderNew: string;
    fullName: string;
    fullNamePlaceholder: string;
    or: string;
    continueWithGoogle: string;
    loggingIn: string;
    creatingAccount: string;
    errorGeneric: string;
    errorWrongPassword: string;
    errorUserNotFound: string;
    errorTooManyRequests: string;
    errorEmailInUse: string;
    errorWeakPassword: string;
    errorInvalidEmail: string;
    errorPasswordLength: string;
    errorGoogleFailed: string;
  };
  dashboard: {
    welcomeBack: string;
    welcomeBackName: (name: string) => string;
    courses: string;
    notStartedYet: string;
    streak: string;
    days: string;
    dailyLearningGoal: string;
    skillLevel: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    acrossAllSubjects: string;
    quizAverage: string;
    noAttemptsYet: string;
    basedOnAttempts: (n: number) => string;
    continueLearning: string;
    noCoursesInProgress: string;
    noCoursesDescription: string;
    resumeLesson: string;
    dailyGoalMinutesLabel: (minutes: number) => string;
    skillProgress: string;
    modulesCount: string;
    notifications: string;
    allCaughtUp: string;
    notificationsDescription: string;
    saved: string;
    nothingSaved: string;
    savedDescription: string;
    upcomingLiveClasses: string;
    noClassesScheduled: string;
    liveClassesDescription: string;
    aiChatHistory: string;
    noConversationsYet: string;
    aiChatDescription: string;
    overview: string;
    practical: string;
    labNav: string;
    toolsNav: string;
    aiNav: string;
    communityNav: string;
    certificates: string;
    settings: string;
    logOut: string;
    notificationsAria: string;
  };
  /**
   * Profile System (blueprint Part 20) — lives at the /settings route,
   * which fixes what was previously a dead 5th bottom-nav destination
   * (BottomNav already linked here; nothing existed at this path
   * before this phase). Reuses lib/progress/dashboard.ts's stats
   * (skill level/progress, streak, quiz average) rather than
   * recomputing them separately, so profile and dashboard can never
   * disagree about the same underlying numbers.
   */
  profile: {
    pageTitle: string;
    signedInAs: string;
    roleLabel: string;
    roleSelfDeclaredNote: string;
    roleStudent: string;
    roleEngineer: string;
    roleTeacher: string;
    roleProfessional: string;
    skillLevelHeading: string;
    skillProgressHeading: string;
    noSkillProgressYet: string;
    learningHistoryHeading: string;
    lessonsCompletedCount: (n: number) => string;
    noHistoryYet: string;
    noHistoryDescription: string;
    activityStatsHeading: string;
    currentStreak: string;
    quizzesAttempted: string;
    labResultsSaved: string;
    toolResultsSaved: string;
    certificatesHeading: string;
    noCertificatesYet: string;
    certificatesEmptyHint: string;
    certificatesSummary: (certs: number, badges: number) => string;
    viewCertificates: string;
    signOutButton: string;
  };
  learning: {
    curriculumEyebrow: string;
    curriculumTitle: string;
    curriculumDescription: string;
    courseCount: (n: number) => string;
    moduleCount: (n: number) => string;
    structureOnly: string;
    backToCurriculum: string;
    startCourse: string;
    continueCourse: string;
    noLessonsYet: string;
    percentComplete: (pct: number, done: number, total: number) => string;
  };
  lesson: {
    minutes: (n: number) => string;
    markComplete: string;
    completed: string;
    loginToTrack: string;
    previous: string;
    next: string;
    finishCourse: string;
    readingNotWritten: string;
    videoNotWired: string;
    interactiveNotWired: string;
    labNotWired: string;
  };
  visualization: {
    notRegistered: string;
    resetAria: string;
  };
  visualizations: {
    momentDiagram: {
      title: string;
      reference: string;
      loadPositionLabel: string;
    };
    columnBuckling: {
      title: string;
      reference: string;
      slendernessLabel: string;
      shortColumn: string;
      intermediate: string;
      slenderColumn: string;
    };
    loadTransfer: {
      title: string;
      reference: string;
      slabLoadLabel: string;
      bearingCapacityLabel: string;
      slabStage: string;
      beamStage: string;
      columnStage: string;
      foundationStage: string;
      soilStage: string;
      slabDesc: string;
      beamDesc: (width: string) => string;
      columnDesc: (total: string, span: string) => string;
      foundationDesc: string;
      soilDesc: (area: string, capacity: string) => string;
    };
    columnFailure: {
      title: string;
      reference: (s: string) => string;
      slendernessLabel: string;
      crushingLabel: string;
      bucklingLabel: string;
      governs: (mode: string) => string;
      crushingGoverns: string;
      bucklingGoverns: string;
    };
    foundationPressure: {
      title: string;
      reference: string;
      eccentricityLabel: string;
      middleThirdLimitLabel: string;
      uniformDesc: string;
      trapezoidalDesc: (limit: string) => string;
      uplift: (width: string, fullWidth: string) => string;
      overturns: string;
    };
    reinforcementDetails: {
      title: string;
      reference: string;
      barCountLabel: string;
      barsUnit: (n: number) => string;
      asMinLabel: string;
      clearSpacingLabel: string;
      minLabel: string;
      bothPass: string;
      failsMinimum: string;
      failsSpacing: string;
    };
    crackFormation: {
      title: string;
      reference: string;
      loadPositionLabel: string;
      inspectPositionLabel: string;
      crackAngleLabel: string;
      shearDominated: string;
      flexureDominated: string;
      transitionZone: string;
    };
    waterFlow: {
      title: string;
      reference: string;
      depthLabel: string;
      concreteLabel: string;
      earthLabel: string;
      gravelLabel: string;
    };
    earthquakeMotion: {
      title: string;
      reference: string;
      buildingPeriodLabel: string;
      groundMotionPeriodLabel: string;
      resonanceWarning: string;
      offResonance: string;
      svgCaption: string;
    };
    soilLayers: {
      title: string;
      reference: string;
      probeDepthLabel: string;
      layerLabel: string;
      sandLabel: string;
      clayLabel: string;
      denseSandLabel: string;
      aboveWaterTable: string;
      belowWaterTable: string;
    };
    buildingStructure: {
      title: string;
      reference: string;
      toggleWalls: string;
      toggleFootings: string;
      storiesShownLabel: string;
      levelGround: string;
      level1: string;
      level2: string;
      levelRoof: string;
      explanation: string;
    };
    reinforcementModel: {
      title: string;
      reference: string;
      toggleXrayOn: string;
      toggleXrayOff: string;
      columnLabel: string;
      beamLabel: string;
      tiesLabel: string;
      stirrupsLabel: string;
      simplificationNote: string;
      explanation: string;
    };
    constructionSequence: {
      title: string;
      reference: string;
      stageProgress: (current: number, total: number) => string;
      stageExcavation: string;
      stageFootings: string;
      stageGroundColumns: string;
      stageFloor1Slab: string;
      stageStory1Columns: string;
      stageFloor2Slab: string;
      stageStory2Columns: string;
      stageRoofSlab: string;
      stageWalls: string;
      stageParapetFinishing: string;
      explainExcavation: string;
      explainFootings: string;
      explainGroundColumns: string;
      explainFloor1Slab: string;
      explainStory1Columns: string;
      explainFloor2Slab: string;
      explainStory2Columns: string;
      explainRoofSlab: string;
      explainWalls: string;
      explainParapetFinishing: string;
    };
  };
  /**
   * The standalone Visualization Gallery (/visualizations) — separate
   * from the `visualizations` section above, which holds each
   * component's in-lesson control labels. This section holds the
   * gallery-card copy (one-line description per visualization) and
   * page-level strings, keyed by the same VisualizationKey registry
   * keys so a missing entry is a compile error, not a silent gap.
   */
  visualizationGallery: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    category2d: string;
    category3d: string;
    count: (n: number) => string;
    backToGallery: string;
    usedInLessons: string;
    noLessonYet: string;
    descriptions: {
      'moment-diagram-explorer': string;
      'column-buckling-visualizer': string;
      'load-transfer-visualizer': string;
      'column-failure-comparator': string;
      'foundation-pressure-visualizer': string;
      'reinforcement-details-visualizer': string;
      'crack-formation-visualizer': string;
      'water-flow-visualizer': string;
      'earthquake-motion-visualizer': string;
      'soil-layers-visualizer': string;
      'building-structure-visualizer': string;
      'reinforcement-model-visualizer': string;
      'construction-sequence-visualizer': string;
    };
  };
  /**
   * The standalone Lab Gallery (/lab) — mirrors visualizationGallery
   * exactly, including keying descriptions by the same LabKey registry
   * keys used in components/labs/registry.tsx.
   */
  labGallery: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    categorySoil: string;
    categoryConcrete: string;
    categoryHighway: string;
    categorySurvey: string;
    count: (n: number) => string;
    backToGallery: string;
    usedInLessons: string;
    noLessonYet: string;
    descriptions: {
      'sieve-analysis': string;
      'atterberg-limits': string;
      'compaction-test': string;
      'direct-shear': string;
      'slump-test': string;
      'compression-test': string;
      'flexural-test': string;
      'aggregate-impact-value': string;
      'bitumen-penetration': string;
      levelling: string;
      'total-station': string;
      traverse: string;
    };
  };
  /**
   * Resource Library (blueprint Part 16, /resources). Item copy is
   * keyed by the same `id` values as RESOURCE_CATALOG in
   * lib/content/resource-catalog.ts, so a missing entry is a compile
   * error rather than a silent gap — same discipline as
   * visualizationGallery/labGallery.
   */
  resourceLibrary: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    categoryPdfNotes: string;
    categoryHandNotes: string;
    categoryCadFiles: string;
    categoryExcelSheets: string;
    categoryTemplates: string;
    categoryChecklists: string;
    categorySiteFormats: string;
    categoryEngineeringBooks: string;
    categoryCodeBooks: string;
    count: (n: number) => string;
    downloadButton: string;
    notAvailableYet: string;
    referenceOnlyNote: string;
    items: {
      'concrete-pour-checklist': { title: string; description: string };
      'site-safety-checklist': { title: string; description: string };
      'foundation-inspection-checklist': { title: string; description: string };
      'daily-site-report-format': { title: string; description: string };
      'material-requisition-format': { title: string; description: string };
      'concrete-pour-record-format': { title: string; description: string };
      'boq-template': { title: string; description: string };
      'material-estimate-template': { title: string; description: string };
      'soil-classification-quick-notes': { title: string; description: string };
      'rcc-design-quick-notes': { title: string; description: string };
      'surveying-quick-notes': { title: string; description: string };
      'structural-analysis-hand-notes': { title: string; description: string };
      'soil-mechanics-hand-notes': { title: string; description: string };
      'standard-foundation-details-dwg': { title: string; description: string };
      'standard-stair-details-dwg': { title: string; description: string };
      'rebar-development-length-sheet': { title: string; description: string };
      'earthwork-volume-sheet': { title: string; description: string };
      'design-of-reinforced-concrete': { title: string; description: string };
      'soil-mechanics-and-foundations': { title: string; description: string };
      'surveying-theory-and-practice': { title: string; description: string };
      'bnbc-2020': { title: string; description: string };
      'aci-318-19': { title: string; description: string };
      'aashto-lrfd': { title: string; description: string };
    };
  };
  /**
   * Engineering Material Library (blueprint Part 10, /materials).
   * MaterialContent is shared across all 10 materials so a missing
   * field on any one material is a compile error, not a silent gap.
   */
  materialLibrary: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    count: (n: number) => string;
    propertiesHeading: string;
    advantagesHeading: string;
    disadvantagesHeading: string;
    usesHeading: string;
    testingHeading: string;
    marketInfoHeading: string;
    relatedLabsHeading: string;
    relatedToolsHeading: string;
    backToMaterials: string;
    materials: {
      cement: MaterialContent;
      sand: MaterialContent;
      aggregate: MaterialContent;
      steel: MaterialContent;
      brick: MaterialContent;
      concrete: MaterialContent;
      asphalt: MaterialContent;
      wood: MaterialContent;
      glass: MaterialContent;
      aluminum: MaterialContent;
    };
  };
  /**
   * Certification System (blueprint Part 19, /certificates and
   * /certificates/verify). Badge copy is keyed by the same BadgeId
   * values as lib/progress/certificates.ts.
   */
  certificates: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    courseCertificatesHeading: string;
    noCourseCertificatesYet: string;
    noCourseCertificatesDescription: string;
    downloadButton: string;
    completedOn: (date: string) => string;
    skillBadgesHeading: string;
    noBadgesYetNote: string;
    progressCertificateHeading: string;
    progressCertificateDescription: string;
    generateProgressCertificate: string;
    verifyLinkText: string;
    verifyPageTitle: string;
    verifyPageDescription: string;
    verifyInputPlaceholder: string;
    verifyButton: string;
    verifyResultWellFormed: string;
    verifyResultNotWellFormed: string;
    verifyResultCourse: (title: string) => string;
    verifyResultDate: (date: string) => string;
    verifyHonestNote: string;
    backToCertificates: string;
    certificateEyebrow: string;
    certificateBodyLine: string;
    progressCertificateEyebrow: string;
    progressCertificateBodyLine: (n: number) => string;
    badges: {
      'first-course': { title: string; description: string };
      'five-courses': { title: string; description: string };
      'streak-7': { title: string; description: string };
      'streak-30': { title: string; description: string };
      'first-quiz': { title: string; description: string };
      'ten-quizzes': { title: string; description: string };
      'lab-explorer': { title: string; description: string };
      'tool-user': { title: string; description: string };
    };
  };
  /**
   * Premium Features preview (blueprint Part 25, /premium). This
   * platform has no payment processor and no subscription backend —
   * see the honesty note in app/[locale]/premium/page.tsx before
   * assuming this gates anything. It's an honest preview of what a
   * premium tier would include, not a working paywall.
   */
  premium: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    noBackendNote: string;
    previewAvailableLabel: string;
    dependsOnUnbuiltLabel: (part: string) => string;
    advancedCoursesHeading: string;
    advancedCoursesDescription: string;
    viewAdvancedCourses: string;
    exclusiveProjectsHeading: string;
    exclusiveProjectsDescription: string;
    aiPremiumToolsHeading: string;
    aiPremiumToolsDescription: string;
    liveMentorshipHeading: string;
    liveMentorshipDescription: string;
    downloadAccessHeading: string;
    downloadAccessDescription: string;
    viewResources: string;
  };
  /**
   * Real Project Experience (blueprint Part 11, /projects). Each
   * project's `sections` record is keyed by that project's
   * sectionKeys in lib/content/project-catalog.ts — different
   * projects have different section keys (Residential: planning/
   * construction/finishing; Bridge: construction-sequence only), so
   * this is one flat record covering every section key used across
   * all 4 projects rather than 4 separate shapes.
   */
  projects: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    backToProjects: string;
    representativeNote: string;
    mediaHeading: string;
    mediaNote: string;
    relatedVisualizationsHeading: string;
    relatedLabsHeading: string;
    relatedMaterialsHeading: string;
    list: {
      residential: { title: string; summary: string };
      commercial: { title: string; summary: string };
      bridge: { title: string; summary: string };
      road: { title: string; summary: string };
    };
    sections: {
      planning: { title: string; body: string };
      construction: { title: string; body: string };
      finishing: { title: string; body: string };
      'structural-system': { title: string; body: string };
      'site-management': { title: string; body: string };
      'construction-sequence': { title: string; body: string };
      'pavement-layers': { title: string; body: string };
    };
  };
  /**
   * Practical Engineering Hub (blueprint Part 5, /practical). `topics`
   * covers all 43 blueprint sub-topics (5.1–5.6) in one flat record,
   * grouped into 6 categories by lib/content/practical-catalog.ts's
   * `topicKeys` per category — same "one dictionary key per real
   * content item" discipline as everywhere else, so a missing
   * translation is a compile error.
   */
  practical: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    backToHub: string;
    mediaHeading: string;
    mediaNote: string;
    relatedVisualizationsHeading: string;
    relatedLabsHeading: string;
    relatedMaterialsHeading: string;
    relatedToolsHeading: string;
    commonMistakesHeading: string;
    categories: {
      'site-engineering': { title: string; summary: string };
      'reinforcement-work': { title: string; summary: string };
      'concrete-technology': { title: string; summary: string };
      'foundation-systems': { title: string; summary: string };
      'road-construction': { title: string; summary: string };
      'site-safety': { title: string; summary: string };
    };
    topics: {
      'site-setup': { title: string; body: string };
      excavation: { title: string; body: string };
      'layout-work': { title: string; body: string };
      'foundation-work': { title: string; body: string };
      'column-casting': { title: string; body: string };
      'beam-casting': { title: string; body: string };
      'slab-casting': { title: string; body: string };
      pcc: { title: string; body: string };
      'rcc-work': { title: string; body: string };
      brickwork: { title: string; body: string };
      plastering: { title: string; body: string };
      'tile-work': { title: string; body: string };
      waterproofing: { title: string; body: string };
      painting: { title: string; body: string };
      'finishing-work': { title: string; body: string };
      'bar-cutting': { title: string; body: string };
      'bar-bending': { title: string; body: string };
      'bar-placement': { title: string; body: string };
      lapping: { title: string; body: string };
      anchorage: { title: string; body: string };
      'cover-block': { title: string; body: string };
      'reinforcement-detailing': { title: string; body: string };
      'concrete-mix': { title: string; body: string };
      'water-cement-ratio': { title: string; body: string };
      'slump-test-practice': { title: string; body: string };
      casting: { title: string; body: string };
      'vibrating-compaction': { title: string; body: string };
      curing: { title: string; body: string };
      'concrete-failure': { title: string; body: string };
      'isolated-footing': { title: string; body: string };
      'combined-footing': { title: string; body: string };
      'raft-foundation': { title: string; body: string };
      'pile-foundation': { title: string; body: string };
      subgrade: { title: string; body: string };
      subbase: { title: string; body: string };
      'base-course': { title: string; body: string };
      'asphalt-work': { title: string; body: string };
      'road-compaction': { title: string; body: string };
      ppe: { title: string; body: string };
      scaffolding: { title: string; body: string };
      'electrical-safety': { title: string; body: string };
      'crane-safety': { title: string; body: string };
      'site-risk-management': { title: string; body: string };
    };
    mistakes: {
      'mistake-curing': { title: string; body: string };
      'mistake-layout': { title: string; body: string };
      'mistake-cover': { title: string; body: string };
      'mistake-lap-location': { title: string; body: string };
      'mistake-water-added': { title: string; body: string };
      'mistake-founding-level': { title: string; body: string };
      'mistake-subgrade-skip': { title: string; body: string };
      'mistake-ppe-culture': { title: string; body: string };
    };
  };
  lab: {
    equipment: string;
    procedure: string;
    runTest: string;
    labReport: string;
    continueButton: string;
    generateReport: string;
    runTheTest: string;
    runTheSurvey: string;
    saveReport: string;
    saving: string;
    savedToHistory: string;
    saveThisRun: string;
    loginToSave: string;
    saveError: string;
    notRegistered: string;
  };
  sieveAnalysis: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    totalMassLabel: string;
    sieveColumnLabel: string;
    retainedColumnLabel: string;
    sumRetainedLabel: (sum: string, total: string) => string;
    massBalanceWarning: string;
    panLabel: string;
    classificationInsufficientData: string;
    classificationWellGraded: string;
    classificationPoorlyGraded: (
      reasons: string,
      cuFailed: boolean,
      ccFailed: boolean
    ) => string;
    reasonCuNotGreaterThan4: (cu: string) => string;
    reasonCcOutsideRange: (cc: string) => string;
    and: string;
  };
  slumpTest: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    centerDropLabel: string;
    failureShapeLabel: string;
    trueSlump: string;
    shear: string;
    collapse: string;
    trueSlumpDesc: string;
    shearDesc: string;
    collapseDesc: string;
    invalidReading: string;
    slumpResult: (mm: number) => string;
    bandVeryLow: string;
    bandLow: string;
    bandMedium: string;
    bandHigh: string;
    bandVeryHigh: string;
    bandCollapse: string;
    descVeryLow: string;
    descLow: string;
    descMedium: string;
    descHigh: string;
    descVeryHigh: string;
    descCollapseTrue: string;
    descShearInvalid: string;
    invalidRetest: string;
  };
  aggregateImpact: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    originalMassLabel: string;
    passingMassLabel: string;
    massInvalidWarning: string;
    lowerIsHigher: string;
    gradeExceptional: string;
    gradeStrong: string;
    gradeSatisfactory: string;
    gradeWeak: string;
    suitExceptional: string;
    suitStrong: string;
    suitSatisfactory: string;
    suitWeak: string;
  };
  levelling: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    startingRlLabel: string;
    stationColumn: string;
    bsColumn: string;
    isColumn: string;
    fsColumn: string;
    riseColumn: string;
    fallColumn: string;
    rlColumn: string;
    checkAgree: (a: string, b: string, c: string) => string;
    checkDisagree: (a: string, b: string, c: string) => string;
  };
  compressionTest: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    loadLabel: string;
    gradeLabel: string;
    areaNote: (sideMm: string) => string;
    strengthResult: (mpa: number) => string;
    acceptMeetsOrExceeds: string;
    acceptBelowMargin: string;
    acceptFails: string;
    explainMeetsOrExceeds: (fck: number) => string;
    explainBelowMargin: (fck: number, margin: number) => string;
    explainFails: (fck: number, margin: number) => string;
    singleSpecimenNote: string;
  };
  atterbergLimits: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    llTrialsLabel: string;
    blowsColumn: string;
    moistureColumn: string;
    plLabel: string;
    aLineNote: (aLinePi: number) => string;
    insufficientData: string;
    groupCL: string;
    groupCH: string;
    groupML: string;
    groupMH: string;
    groupNonPlastic: string;
    descCL: string;
    descCH: string;
    descML: string;
    descMH: string;
    descNonPlastic: string;
  };
  bitumenPenetration: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    trialLabel: (n: number) => string;
    repeatabilityWarning: (spread: number) => string;
    penetrationResult: (dmm: number) => string;
    spreadNote: (spread: number) => string;
    gradeStandard: (label: string) => string;
    gradeBetween: (lower: string, upper: string) => string;
    gradeBelowRange: string;
    gradeAboveRange: string;
  };
  flexuralTest: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    loadLabel: string;
    fractureOffsetLabel: string;
    spanNote: (spanMm: string) => string;
    strengthResult: (mpa: number) => string;
    formulaMiddleThird: string;
    formulaOutsideMiddleThird: string;
    explainMiddleThird: string;
    explainOutsideMiddleThird: (distanceMm: number) => string;
    explainInvalid: string;
  };
  compactionTest: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    moistureColumn: string;
    wetMassColumn: string;
    explainResult: string;
    reasonNotEnoughTrials: string;
    reasonNotConcave: string;
    reasonPeakOutsideRange: string;
  };
  directShear: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    normalStressColumn: string;
    shearStressColumn: string;
    cohesionClampedNote: (rawC: number) => string;
    rSquaredNote: (r2: number) => string;
  };
  totalStation: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    stationSetupLabel: string;
    elevationLabel: string;
    instrumentHeightLabel: string;
    readingsLabel: string;
    targetColumn: string;
    bearingColumn: string;
    verticalAngleColumn: string;
    slopeDistColumn: string;
    targetHeightColumn: string;
    explainResult: string;
  };
  traverse: {
    title: string;
    equipmentIntro: string;
    equipmentItems: { name: string; detail: string }[];
    procedureIntro: string;
    procedureSteps: string[];
    dataEntryIntro: string;
    legColumn: string;
    bearingColumn: string;
    distanceColumn: string;
    misclosureLabel: string;
    precisionLabel: string;
    precisionHigh: string;
    precisionAcceptable: string;
    precisionBelowStandard: string;
    closureNote: string;
    reasonNotEnoughLegs: string;
    reasonZeroDistance: string;
  };
  tools: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    categoryBasic: string;
    categoryCivil: string;
    categoryAdvanced: string;
    toolCount: (n: number) => string;
    backToTools: string;
    toolTitles: {
      'unit-converter': string;
      'area-calculator': string;
      'volume-calculator': string;
      'steel-weight-calculator': string;
      'concrete-calculator': string;
      'brick-calculator': string;
      'stair-calculator': string;
      'slope-calculator': string;
      'water-tank-calculator': string;
      'beam-calculator': string;
      'load-calculator': string;
      'soil-bearing-calculator': string;
    };
    unitConverter: {
      title: string;
      categoryLabel: string;
      categoryLength: string;
      categoryArea: string;
      categoryVolume: string;
      categoryMass: string;
      categoryPressure: string;
      categoryForce: string;
      valueLabel: string;
      fromLabel: string;
      toLabel: string;
    };
    areaCalculator: {
      title: string;
      shapeLabel: string;
      shapeRectangle: string;
      shapeTriangle: string;
      shapeCircle: string;
      shapeTrapezoid: string;
      fieldLength: string;
      fieldWidth: string;
      fieldBase: string;
      fieldHeight: string;
      fieldRadius: string;
      fieldTopWidth: string;
      fieldBottomWidth: string;
    };
    volumeCalculator: {
      title: string;
      shapeLabel: string;
      shapeBox: string;
      shapeCylinder: string;
      shapeCone: string;
      shapeSphere: string;
      shapeEarthwork: string;
      fieldLength: string;
      fieldWidth: string;
      fieldHeight: string;
      fieldRadius: string;
      fieldArea1: string;
      fieldArea2: string;
      fieldDistance: string;
      earthworkNote: string;
    };
    steelWeight: {
      title: string;
      reference: string;
      diameterLabel: string;
      lengthLabel: string;
      quantityLabel: string;
      perMeterLabel: string;
      totalLabel: string;
    };
    concreteCalculator: {
      title: string;
      mixLabel: string;
      volumeLabel: string;
      dryVolumeLabel: string;
      cementLabel: string;
      sandLabel: string;
      aggregateLabel: string;
      bagsValue: (n: number) => string;
      assumptionsNote: string;
    };
    brickCalculator: {
      title: string;
      wallSection: string;
      wallLengthLabel: string;
      wallHeightLabel: string;
      wallThicknessLabel: string;
      brickSection: string;
      brickLengthLabel: string;
      brickWidthLabel: string;
      brickHeightLabel: string;
      mortarLabel: string;
      wastageLabel: string;
      wallVolumeLabel: string;
      baseCountLabel: string;
      withWastageLabel: string;
      brickCountValue: (n: number) => string;
      estimateNote: string;
    };
    stairCalculator: {
      title: string;
      reference: string;
      totalRiseLabel: string;
      targetRiserLabel: string;
      riserCountLabel: string;
      actualRiserLabel: string;
      treadCountLabel: string;
      treadLabel: string;
      totalGoingLabel: string;
      walkingLineLabel: string;
      riserOutOfRangeWarning: string;
      walkingLineNote: string;
    };
    slopeCalculator: {
      title: string;
      slopeRatioLabel: string;
      ratioVerticalPrefix: string;
      ratioHorizontalSuffix: string;
      horizontalDistanceLabel: string;
      angleLabel: string;
      percentLabel: string;
      verticalRiseLabel: string;
    };
    waterTank: {
      title: string;
      peopleLabel: string;
      demandLabel: string;
      storageDaysLabel: string;
      daysUnit: string;
      shapeLabel: string;
      shapeCylindrical: string;
      shapeRectangular: string;
      diameterLabel: string;
      lengthLabel: string;
      widthLabel: string;
      dailyDemandLabel: string;
      requiredVolumeLabel: string;
      tankHeightLabel: string;
    };
    beamCalculator: {
      title: string;
      reference: string;
      spanLabel: string;
      udlLabel: string;
      pointLoadLabel: string;
      pointLoadPositionLabel: string;
      maxMomentLabel: string;
      maxShearLabel: string;
      reactionALabel: string;
      reactionBLabel: string;
      scopeNote: string;
    };
    loadCalculator: {
      title: string;
      reference: string;
      deadLoadLabel: string;
      liveLoadLabel: string;
      windLoadLabel: string;
      comboService: string;
      comboStrength: string;
      comboWind: string;
      governingLabel: string;
      scopeNote: string;
    };
    soilBearing: {
      title: string;
      reference: string;
      cohesionLabel: string;
      frictionAngleLabel: string;
      unitWeightLabel: string;
      depthLabel: string;
      widthLabel: string;
      shapeLabel: string;
      shapeStrip: string;
      shapeSquare: string;
      fosLabel: string;
      overburdenLabel: string;
      ultimateLabel: string;
      safeLabel: string;
      tableNote: string;
    };
  };
  practice: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    noQuizzesYet: string;
    questionCount: (n: number) => string;
    minutesUnit: string;
    backToPractice: string;
    questionProgress: (current: number, total: number) => string;
    previous: string;
    next: string;
    submitQuiz: string;
    numericalPlaceholder: string;
    cqPlaceholder: string;
    revealModelAnswer: string;
    modelAnswerLabel: string;
    selfMarkPrompt: string;
    selfMarkCorrect: string;
    selfMarkIncorrect: string;
    resultsTitle: string;
    scoreDetail: (correct: number, total: number) => string;
    noAutoGradableQuestions: string;
    questionLabel: (n: number) => string;
    saveError: string;
    saving: string;
  };
  search: {
    pageTitle: string;
    pageDescription: string;
    searchPlaceholder: string;
    filterAll: string;
    typeCourse: string;
    typeLesson: string;
    typeTool: string;
    typeFormula: string;
    typeTerm: string;
    noResults: string;
    browseFormulas: string;
    browseTerms: string;
    openCalculator: string;
    aiSearchNotConfigured: string;
    categoryStructural: string;
    categoryGeotechnical: string;
    categoryConcrete: string;
    categorySurvey: string;
    categoryGeneral: string;
  };
  languageSwitcher: {
    label: string;
  };
  common: {
    loading: string;
  };
}
