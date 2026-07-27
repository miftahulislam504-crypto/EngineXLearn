'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  Flame,
  Target,
  Trophy,
  Bookmark,
  MessageSquare,
  Bell,
  Calendar,
} from 'lucide-react';
import { Link } from '@/components/i18n/link';
import { StatCard, ProgressCard, EmptyStateCard } from '@/components/dashboard/stat-cards';
import { useAuth } from '@/lib/auth-context';
import { getDashboardStats, type DashboardStats } from '@/lib/progress/dashboard';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';

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

export default function DashboardOverviewPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();

  // Stats depend on localStorage, so they're only knowable client-side —
  // start with the same all-zero shape the old server render used for a
  // logged-out visitor, then fill in real numbers after mount.
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);

  useEffect(() => {
    if (user) setStats(getDashboardStats(user.uid));
  }, [user]);

  const skillLevelLabels = {
    beginner: dict.dashboard.beginner,
    intermediate: dict.dashboard.intermediate,
    advanced: dict.dashboard.advanced,
  };

  return (
    <div className="container max-w-6xl py-8">
      {/* Top stat row — Learning Progress, Daily Goal, Activity streak, Quiz Results */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label={dict.dashboard.courses}
          value={String(stats.coursesInProgress)}
          sublabel={stats.coursesInProgress === 0 ? dict.dashboard.notStartedYet : undefined}
        />
        <StatCard
          icon={Flame}
          label={dict.dashboard.streak}
          value={`${stats.streakDays} ${dict.dashboard.days}`}
          sublabel={dict.dashboard.dailyGoalMinutesLabel(stats.dailyGoalTargetMinutes)}
        />
        <StatCard
          icon={Target}
          label={dict.dashboard.skillLevel}
          value={skillLevelLabels[stats.skillLevel]}
          sublabel={dict.dashboard.acrossAllSubjects}
        />
        <StatCard
          icon={Trophy}
          label={dict.dashboard.quizAverage}
          value={stats.quizAveragePercent !== null ? `${stats.quizAveragePercent}%` : '—'}
          sublabel={
            stats.quizAttemptCount > 0
              ? dict.dashboard.basedOnAttempts(stats.quizAttemptCount)
              : dict.dashboard.noAttemptsYet
          }
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Continue Learning / Learning Progress */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            {dict.dashboard.continueLearning}
          </h2>
          {stats.continueLearning ? (
            <Link href={`/learning`} className="block">
              <ProgressCard
                title={stats.continueLearning.courseTitle}
                percent={stats.continueLearning.percent}
                detail={dict.dashboard.resumeLesson}
              />
            </Link>
          ) : (
            <EmptyStateCard
              icon={BookOpen}
              title={dict.dashboard.noCoursesInProgress}
              description={dict.dashboard.noCoursesDescription}
            />
          )}

          {stats.skillProgress.length > 0 && (
            <>
              <h2 className="pt-2 font-display text-lg font-semibold tracking-tight">
                {dict.dashboard.skillProgress}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.skillProgress.map((s) => (
                  <ProgressCard
                    key={s.subjectTitle}
                    title={locale === 'bn' && s.subjectTitleBn ? s.subjectTitleBn : s.subjectTitle}
                    percent={s.percent}
                    detail={`${s.courseCount} ${dict.dashboard.modulesCount}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right rail — Notifications, Saved, Upcoming Live Classes, Activity Timeline */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 font-display text-base font-semibold tracking-tight">
              {dict.dashboard.notifications}
            </h2>
            <EmptyStateCard
              icon={Bell}
              title={dict.dashboard.allCaughtUp}
              description={dict.dashboard.notificationsDescription}
            />
          </div>

          <div>
            <h2 className="mb-3 font-display text-base font-semibold tracking-tight">
              {dict.dashboard.saved}
            </h2>
            <EmptyStateCard
              icon={Bookmark}
              title={dict.dashboard.nothingSaved}
              description={dict.dashboard.savedDescription}
            />
          </div>

          <div>
            <h2 className="mb-3 font-display text-base font-semibold tracking-tight">
              {dict.dashboard.upcomingLiveClasses}
            </h2>
            <EmptyStateCard
              icon={Calendar}
              title={dict.dashboard.noClassesScheduled}
              description={dict.dashboard.liveClassesDescription}
            />
          </div>

          <div>
            <h2 className="mb-3 font-display text-base font-semibold tracking-tight">
              {dict.dashboard.aiChatHistory}
            </h2>
            <EmptyStateCard
              icon={MessageSquare}
              title={dict.dashboard.noConversationsYet}
              description={dict.dashboard.aiChatDescription}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
