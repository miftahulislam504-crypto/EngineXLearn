import { ALL_COURSES } from '@/lib/content';
import {
  getLessonProgress,
  getCompletedLessonIds,
  getCourseProgressPercent,
  getLabResults,
  getToolResults,
  getQuizAttempts,
} from '@/lib/progress/store';
import { getDashboardStats } from '@/lib/progress/dashboard';

/**
 * Certification System (blueprint Part 19). Built entirely client-side
 * on top of the existing localStorage progress data — no new storage
 * bucket, no server. That constraint shapes every piece of this file,
 * most importantly the Verification System, so read the note on
 * `verifyCertificateId` before assuming this behaves like a normal
 * issuer-backed certificate system.
 */

// ---------------------------------------------------------------------------
// Course Certificates
// ---------------------------------------------------------------------------

export interface CourseCertificate {
  courseSlug: string;
  courseTitle: string;
  courseTitleBn: string | null;
  /** ISO timestamp of whichever lesson in the course was completed last. */
  completedAt: string;
  certificateId: string;
}

/** A course counts as certificate-eligible at 100% lesson completion —
 * the same `getCourseProgressPercent` the dashboard and Profile page
 * already use, so "100% complete" can never disagree between pages. */
export function getCourseCertificates(uid: string): CourseCertificate[] {
  const progress = getLessonProgress(uid);
  const certificates: CourseCertificate[] = [];

  for (const course of ALL_COURSES) {
    const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (lessonIds.length === 0) continue;
    const percent = getCourseProgressPercent(uid, lessonIds);
    if (percent < 100) continue;

    const completionDates = lessonIds
      .map((id) => progress[id]?.completedAt)
      .filter((d): d is string => !!d);
    const completedAt = completionDates.sort().at(-1) ?? new Date().toISOString();

    certificates.push({
      courseSlug: course.slug,
      courseTitle: course.title,
      courseTitleBn: course.titleBn,
      completedAt,
      certificateId: generateCertificateId(course.slug, completedAt),
    });
  }

  return certificates;
}

// ---------------------------------------------------------------------------
// Certificate ID: format-checkable, NOT a real anti-forgery mechanism
// ---------------------------------------------------------------------------

/**
 * IMPORTANT — read before treating this as "real" verification:
 *
 * There is no server, so there is no central ledger of who was actually
 * issued which certificate. `generateCertificateId` produces an ID
 * that *encodes* the course and completion date and is internally
 * consistent (a checksum derived from those same two parts), so
 * `verifyCertificateId` can confirm an ID is well-formed and wasn't
 * typo'd or hand-fabricated from nothing — but it CANNOT confirm which
 * real person the certificate belongs to, or that this platform
 * actually recorded that completion anywhere outside that one person's
 * own browser. The checksum salt below is plain, readable client-side
 * code, not a secret — anyone reading this file could compute a
 * "valid" ID for a course they never completed. This is stated plainly
 * on the /certificates/verify page itself, not just in this comment,
 * because a verification feature that quietly overclaims what it
 * verifies is worse than not having one.
 */
const CHECKSUM_SALT = 'enginexlearn-cert-v1';

function simpleChecksum(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36).slice(0, 5).toUpperCase().padStart(5, '0');
}

function courseSlugAbbrev(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.slice(0, 3))
    .join('')
    .toUpperCase()
    .slice(0, 10);
}

export function generateCertificateId(courseSlug: string, completedAtISO: string): string {
  const datePart = completedAtISO.slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const slugPart = courseSlugAbbrev(courseSlug);
  const checksum = simpleChecksum(`${CHECKSUM_SALT}:${courseSlug}:${datePart}`);
  return `EXL-${slugPart}-${datePart}-${checksum}`;
}

export interface CertificateVerifyResult {
  wellFormed: boolean;
  courseSlugAbbrevPart: string | null;
  datePart: string | null;
  matchedCourse: { slug: string; title: string; titleBn: string | null } | null;
}

/** Recomputes the checksum from the ID's own course-abbreviation and
 * date parts and compares. Also tries to match the abbreviation back
 * to a real course in the catalog, for a more useful display — but a
 * match there is circumstantial (several courses could theoretically
 * abbreviate the same way), not proof of anything. */
export function verifyCertificateId(id: string): CertificateVerifyResult {
  const parts = id.trim().toUpperCase().split('-');
  if (parts.length !== 4 || parts[0] !== 'EXL') {
    return { wellFormed: false, courseSlugAbbrevPart: null, datePart: null, matchedCourse: null };
  }
  const [, slugPart, datePart, checksum] = parts;

  const matchedCourse = ALL_COURSES.find((c) => courseSlugAbbrev(c.slug) === slugPart);
  const wellFormed = matchedCourse
    ? simpleChecksum(`${CHECKSUM_SALT}:${matchedCourse.slug}:${datePart}`) === checksum
    : false;

  return {
    wellFormed,
    courseSlugAbbrevPart: slugPart,
    datePart,
    matchedCourse: matchedCourse
      ? { slug: matchedCourse.slug, title: matchedCourse.title, titleBn: matchedCourse.titleBn }
      : null,
  };
}

// ---------------------------------------------------------------------------
// Progress Certificate — a snapshot, not gated on 100% of anything
// ---------------------------------------------------------------------------

export interface ProgressSnapshot {
  lessonsCompleted: number;
  coursesInProgress: number;
  coursesCompleted: number;
  streakDays: number;
  generatedAt: string;
}

export function getProgressSnapshot(uid: string): ProgressSnapshot {
  const stats = getDashboardStats(uid);
  return {
    lessonsCompleted: getCompletedLessonIds(uid).size,
    coursesInProgress: stats.coursesInProgress,
    coursesCompleted: getCourseCertificates(uid).length,
    streakDays: stats.streakDays,
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Skill Badges — rule-based, derived entirely from existing progress data
// ---------------------------------------------------------------------------

export type BadgeId =
  | 'first-course'
  | 'five-courses'
  | 'streak-7'
  | 'streak-30'
  | 'first-quiz'
  | 'ten-quizzes'
  | 'lab-explorer'
  | 'tool-user';

const BADGE_IDS: BadgeId[] = [
  'first-course',
  'five-courses',
  'streak-7',
  'streak-30',
  'first-quiz',
  'ten-quizzes',
  'lab-explorer',
  'tool-user',
];

/** Every badge is a pure function of data that already exists elsewhere
 * (course certificates, streak, quiz attempts, lab/tool result counts)
 * — no separate "badges earned" storage bucket, so a badge can never
 * drift out of sync with the underlying progress it represents. */
export function getEarnedBadges(uid: string): BadgeId[] {
  const stats = getDashboardStats(uid);
  const courseCount = getCourseCertificates(uid).length;
  const labCount = getLabResults(uid).length;
  const toolCount = getToolResults(uid).length;
  const quizCount = getQuizAttempts(uid).length;

  const checks: Record<BadgeId, boolean> = {
    'first-course': courseCount >= 1,
    'five-courses': courseCount >= 5,
    'streak-7': stats.streakDays >= 7,
    'streak-30': stats.streakDays >= 30,
    'first-quiz': quizCount >= 1,
    'ten-quizzes': quizCount >= 10,
    'lab-explorer': labCount >= 5,
    'tool-user': toolCount >= 5,
  };

  return BADGE_IDS.filter((id) => checks[id]);
}

export function getAllBadgeIds(): BadgeId[] {
  return BADGE_IDS;
}
