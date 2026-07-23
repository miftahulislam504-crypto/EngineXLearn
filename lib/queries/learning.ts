import { prisma } from '@/lib/prisma';
import { logActivityEvent } from '@/lib/queries/activity';

/**
 * Query layer for the Learning System (blueprint Part 4). Every function
 * here does a real Prisma query — this is what the Phase 1 home-page
 * placeholder arrays get replaced with once a page actually needs data.
 */

export async function getSubjectsWithCourseCounts() {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { courses: true } },
    },
  });
  return subjects;
}

export async function getSubjectBySlug(slug: string) {
  return prisma.subject.findUnique({
    where: { slug },
    include: {
      courses: {
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { modules: true } },
        },
      },
    },
  });
}

export async function getAllPublishedCoursesGrouped() {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: 'asc' },
    include: {
      courses: {
        orderBy: { order: 'asc' },
        include: {
          modules: {
            select: { id: true },
          },
        },
      },
    },
  });
  return subjects;
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      subject: true,
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
}

export async function getLessonById(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            include: { subject: true },
          },
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
}

/**
 * Returns the full module/lesson tree for a course alongside this user's
 * completion state per lesson, so the Lesson Viewer sidebar can show
 * checkmarks without a separate round trip per lesson.
 */
export async function getCourseWithProgress(courseSlug: string, userId: string | null) {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      subject: true,
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  if (!course) return null;

  if (!userId) {
    return { course, completedLessonIds: new Set<string>() };
  }

  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

  const progressRows = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: lessonIds },
      completed: true,
    },
    select: { lessonId: true },
  });

  return {
    course,
    completedLessonIds: new Set(progressRows.map((p) => p.lessonId)),
  };
}

/** Recomputes and upserts CourseProgress.percentComplete for the course
 * containing the given lesson, based on actual completed-vs-total lesson
 * counts — not incremented/decremented by one each call, which would
 * drift out of sync with reality if a lesson were ever completed twice
 * or a course's lesson count changed. */
async function syncCourseProgress(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { moduleId: true, module: { select: { courseId: true } } },
  });
  if (!lesson) return;
  const courseId = lesson.module.courseId;

  const courseLessons = await prisma.lesson.findMany({
    where: { module: { courseId } },
    select: { id: true },
  });
  const lessonIds = courseLessons.map((l) => l.id);
  const totalLessonCount = lessonIds.length;

  const completedCount = await prisma.lessonProgress.count({
    where: { userId, lessonId: { in: lessonIds }, completed: true },
  });

  const percentComplete = totalLessonCount === 0 ? 0 : Math.round((completedCount / totalLessonCount) * 100);

  await prisma.courseProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { percentComplete, lastLessonId: lessonId },
    create: { userId, courseId, percentComplete, lastLessonId: lessonId },
  });
}

export async function markLessonComplete(userId: string, lessonId: string) {
  const result = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
  });
  await syncCourseProgress(userId, lessonId);
  await logActivityEvent(userId, 'lesson_completed', { lessonId });
  return result;
}

export async function markLessonIncomplete(userId: string, lessonId: string) {
  const result = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: false, completedAt: null },
    create: { userId, lessonId, completed: false },
  });
  await syncCourseProgress(userId, lessonId);
  return result;
}
