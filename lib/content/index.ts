import { rawSubjects, type SubjectSeed, type CourseSeed, type ModuleSeed, type LessonSeed } from './course-data';
import { rawQuizzes, type QuizSeed } from './quiz-data';

/**
 * Hydrates the raw hardcoded content (course-data.ts, quiz-data.ts) with
 * stable ids and resolved parent references, and is what every page in
 * the app actually imports — nothing outside this file (and the two raw
 * data files) needs to know content used to live in a database.
 *
 * Ids are derived deterministically from each item's position (course
 * slug + module index + lesson index), not randomly generated, so a
 * lesson's id/URL never changes between builds or deploys — that
 * stability is what a database's auto-increment/cuid id gave for free,
 * and what a hardcoded catalog has to reproduce by hand.
 */

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  titleBn: string | null;
  contentType: LessonSeed['contentType'];
  durationMin: number;
  body: string | null;
  interactiveKey: string | null;
  labKey: string | null;
  order: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  titleBn: string | null;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  subjectId: string;
  subjectSlug: string;
  slug: string;
  title: string;
  titleBn: string | null;
  description: string;
  published: boolean;
  order: number;
  modules: Module[];
}

export interface Subject {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  description: string;
  order: number;
  courses: Course[];
}

function hydrateLesson(courseSlug: string, moduleIdx: number, lessonIdx: number, l: LessonSeed): Lesson {
  return {
    id: `${courseSlug}--m${moduleIdx}--l${lessonIdx}`,
    moduleId: `${courseSlug}--m${moduleIdx}`,
    title: l.title,
    titleBn: l.titleBn ?? null,
    contentType: l.contentType,
    durationMin: l.durationMin ?? 10,
    body: l.body ?? null,
    interactiveKey: l.interactiveKey ?? null,
    labKey: l.labKey ?? null,
    order: lessonIdx,
  };
}

function hydrateModule(courseSlug: string, moduleIdx: number, m: ModuleSeed): Module {
  return {
    id: `${courseSlug}--m${moduleIdx}`,
    courseId: courseSlug,
    title: m.title,
    titleBn: m.titleBn ?? null,
    order: moduleIdx,
    lessons: m.lessons.map((l, lIdx) => hydrateLesson(courseSlug, moduleIdx, lIdx, l)),
  };
}

function hydrateCourse(subjectSlug: string, courseIdx: number, c: CourseSeed): Course {
  return {
    id: c.slug,
    subjectId: subjectSlug,
    subjectSlug,
    slug: c.slug,
    title: c.title,
    titleBn: c.titleBn ?? null,
    description: c.description,
    published: c.published,
    order: courseIdx,
    modules: c.modules.map((m, mIdx) => hydrateModule(c.slug, mIdx, m)),
  };
}

function hydrateSubject(subjectIdx: number, s: SubjectSeed): Subject {
  return {
    id: s.slug,
    slug: s.slug,
    title: s.title,
    titleBn: s.titleBn,
    description: s.description,
    order: subjectIdx,
    courses: s.courses.map((c, cIdx) => hydrateCourse(s.slug, cIdx, c)),
  };
}

/** The full, hydrated content tree — computed once at module load, since
 * it's pure data with no per-request variation. */
export const SUBJECTS: Subject[] = rawSubjects.map((s, i) => hydrateSubject(i, s));

export const ALL_COURSES: Course[] = SUBJECTS.flatMap((s) => s.courses);

export const ALL_LESSONS: (Lesson & { courseSlug: string; courseTitle: string })[] = ALL_COURSES.flatMap((c) =>
  c.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, courseSlug: c.slug, courseTitle: c.title })))
);

export function getSubjectBySlug(slug: string): Subject | null {
  return SUBJECTS.find((s) => s.slug === slug) ?? null;
}

export function getCourseBySlug(slug: string): Course | null {
  return ALL_COURSES.find((c) => c.slug === slug) ?? null;
}

/** Looks up a lesson by id and returns it with its resolved module,
 * course, and subject — the same shape the old `getLessonById` (Prisma)
 * returned via `include`, but from an in-memory array scan instead of a
 * database join. */
export function getLessonById(
  lessonId: string
): (Lesson & { module: Module & { course: Course & { subject: Subject } } }) | null {
  for (const subject of SUBJECTS) {
    for (const course of subject.courses) {
      for (const module of course.modules) {
        const lesson = module.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          return { ...lesson, module: { ...module, course: { ...course, subject } } };
        }
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------

export interface Question {
  id: string;
  quizId: string;
  type: QuizSeed['questions'][number]['type'];
  prompt: string;
  choices: { id: string; text: string }[] | null;
  answer: Record<string, unknown>;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  timedSeconds: number | null;
  questions: Question[];
}

function hydrateQuiz(quizIdx: number, q: QuizSeed): Quiz {
  const quizId = `quiz-${quizIdx}`;
  return {
    id: quizId,
    title: q.title,
    category: q.category,
    timedSeconds: q.timedSeconds,
    questions: q.questions.map((question, qIdx) => ({
      id: `${quizId}--q${qIdx}`,
      quizId,
      type: question.type,
      prompt: question.prompt,
      choices: question.choices ?? null,
      answer: question.answer,
      order: qIdx,
    })),
  };
}

export const QUIZZES: Quiz[] = rawQuizzes.map((q, i) => hydrateQuiz(i, q));

export function getQuizById(id: string): Quiz | null {
  return QUIZZES.find((q) => q.id === id) ?? null;
}

export function getQuizzesGroupedByCategory(): Map<string, Quiz[]> {
  const grouped = new Map<string, Quiz[]>();
  for (const quiz of QUIZZES) {
    const list = grouped.get(quiz.category) ?? [];
    list.push(quiz);
    grouped.set(quiz.category, list);
  }
  return grouped;
}
