'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/components/i18n/link';
import { FlaskConical, Wrench, ClipboardCheck, Award, LogOut } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressCard, EmptyStateCard } from '@/components/dashboard/stat-cards';
import { useAuth } from '@/lib/auth-context';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import { ALL_COURSES, getLessonById, getQuizById } from '@/lib/content';
import { getToolBySlug } from '@/components/tools/registry';
import {
  getUserRole,
  setUserRole,
  getCompletedLessonIds,
  getCourseProgressPercent,
  getDailyGoalMinutes,
  setDailyGoalMinutes,
  getLabResults,
  getToolResults,
  type UserRole,
} from '@/lib/progress/store';
import { getDashboardStats, getRecentActivity, type DashboardStats, type RecentActivityItem } from '@/lib/progress/dashboard';
import { getCourseCertificates, getEarnedBadges } from '@/lib/progress/certificates';

const DAILY_GOAL_OPTIONS = [15, 30, 45, 60];

const EMPTY_STATS: DashboardStats = {
  coursesInProgress: 0,
  streakDays: 0,
  quizAveragePercent: null,
  quizAttemptCount: 0,
  dailyGoalTargetMinutes: 30,
  skillLevel: 'beginner',
  skillProgress: [],
  continueLearning: null,
};

export default function SettingsPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const { user, signOut } = useAuth();
  const t = dict.profile;

  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [role, setRole] = useState<UserRole>('student');
  const [completedCount, setCompletedCount] = useState(0);
  const [labCount, setLabCount] = useState(0);
  const [toolCount, setToolCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [activity, setActivity] = useState<RecentActivityItem[]>([]);
  const [courseProgress, setCourseProgress] = useState<{ courseTitle: string; courseTitleBn: string | null; percent: number; completedInCourse: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    setStats(getDashboardStats(user.uid));
    setRole(getUserRole(user.uid));
    setActivity(getRecentActivity(user.uid));
    const completedIds = getCompletedLessonIds(user.uid);
    setCompletedCount(completedIds.size);
    setLabCount(getLabResults(user.uid).length);
    setToolCount(getToolResults(user.uid).length);
    setCertificateCount(getCourseCertificates(user.uid).length);
    setBadgeCount(getEarnedBadges(user.uid).length);

    const withProgress = ALL_COURSES.map((c) => {
      const lessonIds = c.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const completedInCourse = lessonIds.filter((id) => completedIds.has(id)).length;
      return {
        courseTitle: c.title,
        courseTitleBn: c.titleBn,
        percent: getCourseProgressPercent(user.uid, lessonIds),
        completedInCourse,
      };
    }).filter((c) => c.percent > 0);
    setCourseProgress(withProgress);
  }, [user]);

  if (!user) return null;

  const skillLevelLabels = {
    beginner: dict.dashboard.beginner,
    intermediate: dict.dashboard.intermediate,
    advanced: dict.dashboard.advanced,
  };

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'student', label: t.roleStudent },
    { value: 'engineer', label: t.roleEngineer },
    { value: 'teacher', label: t.roleTeacher },
    { value: 'professional', label: t.roleProfessional },
  ];

  function handleRoleChange(next: UserRole) {
    if (!user) return;
    setRole(next);
    setUserRole(user.uid, next);
  }

  function handleDailyGoalChange(minutes: number) {
    if (!user) return;
    setDailyGoalMinutes(user.uid, minutes);
    setStats((prev) => ({ ...prev, dailyGoalTargetMinutes: minutes }));
  }

  const initials = (user.displayName ?? user.email ?? '?').slice(0, 1).toUpperCase();

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">{t.pageTitle}</h1>

        {/* Identity */}
        <Card className="mb-6">
          <CardContent className="flex items-center gap-4 p-5">
            <Avatar className="h-14 w-14">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName ?? ''} />}
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold">{user.displayName ?? user.email}</p>
              <p className="truncate text-xs text-muted-foreground">
                {t.signedInAs} {user.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Self-declared role */}
        <section className="mb-6">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.roleLabel}</h2>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                size="sm"
                variant={role === opt.value ? 'default' : 'outline'}
                onClick={() => handleRoleChange(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{t.roleSelfDeclaredNote}</p>
        </section>

        {/* Daily goal */}
        <section className="mb-6">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">
            {dict.dashboard.dailyGoalMinutesLabel(stats.dailyGoalTargetMinutes)}
          </h2>
          <div className="flex flex-wrap gap-2">
            {DAILY_GOAL_OPTIONS.map((minutes) => (
              <Button
                key={minutes}
                type="button"
                size="sm"
                variant={stats.dailyGoalTargetMinutes === minutes ? 'default' : 'outline'}
                onClick={() => handleDailyGoalChange(minutes)}
              >
                {minutes} min
              </Button>
            ))}
          </div>
        </section>

        {/* Skill level */}
        <section className="mb-6">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.skillLevelHeading}</h2>
          <p className="text-sm text-muted-foreground">{skillLevelLabels[stats.skillLevel]}</p>
        </section>

        {/* Skill progress by course (finer-grained than the dashboard's per-subject view) */}
        <section className="mb-6">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.skillProgressHeading}</h2>
          {courseProgress.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noSkillProgressYet}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {courseProgress.map((c) => (
                <ProgressCard
                  key={c.courseTitle}
                  title={locale === 'bn' && c.courseTitleBn ? c.courseTitleBn : c.courseTitle}
                  percent={c.percent}
                  detail={t.lessonsCompletedCount(c.completedInCourse)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Learning history */}
        <section className="mb-6">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.learningHistoryHeading}</h2>
          {completedCount === 0 ? (
            <EmptyStateCard icon={ClipboardCheck} title={t.noHistoryYet} description={t.noHistoryDescription} />
          ) : (
            <p className="text-sm text-muted-foreground">{t.lessonsCompletedCount(completedCount)}</p>
          )}
        </section>

        {/* Activity stats */}
        <section className="mb-6">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.activityStatsHeading}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBlock label={t.currentStreak} value={`${stats.streakDays}`} />
            <StatBlock label={t.quizzesAttempted} value={`${stats.quizAttemptCount}`} />
            <StatBlock label={t.labResultsSaved} value={`${labCount}`} />
            <StatBlock label={t.toolResultsSaved} value={`${toolCount}`} />
          </div>

          {activity.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {activity.map((item) => (
                <ActivityRow key={`${item.type}-${item.key}-${item.createdAt}`} item={item} />
              ))}
            </ul>
          )}
        </section>

        {/* Certificates & achievements (Part 19) */}
        <section className="mb-8">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.certificatesHeading}</h2>
          {certificateCount === 0 && badgeCount === 0 ? (
            <EmptyStateCard icon={Award} title={t.noCertificatesYet} description={t.certificatesEmptyHint} />
          ) : (
            <p className="mb-2 text-sm text-muted-foreground">{t.certificatesSummary(certificateCount, badgeCount)}</p>
          )}
          <Link
            href="/certificates"
            className="mt-2 inline-block text-sm text-steel-500 underline-offset-2 hover:underline"
          >
            {t.viewCertificates}
          </Link>
        </section>

        <Button variant="outline" className="gap-2" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
          {t.signOutButton}
        </Button>
      </main>
    </AppShell>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="font-display text-xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/** Resolves each activity item's title from its owning system (lesson,
 * tool, or quiz) rather than storing display text in the activity log
 * itself — the log only ever needs to identify *which* lesson/tool/quiz,
 * never say its name in a particular language. */
function ActivityRow({ item }: { item: RecentActivityItem }) {
  const dict = useDictionary();
  const locale = useLocale();

  if (item.type === 'lab') {
    const lesson = getLessonById(item.key);
    if (!lesson) return null;
    const title = locale === 'bn' && lesson.titleBn ? lesson.titleBn : lesson.title;
    return (
      <li>
        <Link
          href={`/learning/${lesson.module.course.slug}/${lesson.id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <FlaskConical className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{title}</span>
        </Link>
      </li>
    );
  }

  if (item.type === 'tool') {
    const tool = getToolBySlug(item.key);
    if (!tool) return null;
    return (
      <li>
        <Link
          href={`/tools/${tool.slug}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Wrench className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{dict.tools.toolTitles[tool.slug as keyof typeof dict.tools.toolTitles]}</span>
        </Link>
      </li>
    );
  }

  const quiz = getQuizById(item.key);
  if (!quiz) return null;
  return (
    <li>
      <Link
        href={`/practice/${quiz.id}`}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{quiz.title}</span>
      </Link>
    </li>
  );
}
