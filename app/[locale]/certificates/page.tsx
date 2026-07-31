'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/components/i18n/link';
import { Award, Download, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyStateCard } from '@/components/dashboard/stat-cards';
import { useAuth } from '@/lib/auth-context';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import {
  getCourseCertificates,
  getEarnedBadges,
  getAllBadgeIds,
  getProgressSnapshot,
  type CourseCertificate,
  type BadgeId,
} from '@/lib/progress/certificates';
import { renderCertificatePng, downloadDataUrl } from '@/lib/certificates/render-certificate';

export default function CertificatesPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();
  const t = dict.certificates;

  const [certificates, setCertificates] = useState<CourseCertificate[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<BadgeId[]>([]);

  useEffect(() => {
    if (!user) return;
    setCertificates(getCourseCertificates(user.uid));
    setEarnedBadges(getEarnedBadges(user.uid));
  }, [user]);

  if (!user) return null;

  const displayName = user.displayName ?? user.email ?? 'Learner';

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function handleDownloadCourseCertificate(cert: CourseCertificate) {
    const title = locale === 'bn' && cert.courseTitleBn ? cert.courseTitleBn : cert.courseTitle;
    const dataUrl = renderCertificatePng({
      eyebrow: t.certificateEyebrow,
      recipientName: displayName,
      bodyLine: t.certificateBodyLine,
      subjectLine: title,
      dateLine: formatDate(cert.completedAt),
      certificateId: cert.certificateId,
      footer: 'EngineXLearn',
    });
    downloadDataUrl(dataUrl, `${cert.courseSlug}-certificate.png`);
  }

  function handleGenerateProgressCertificate() {
    if (!user) return;
    const snapshot = getProgressSnapshot(user.uid);
    const dataUrl = renderCertificatePng({
      eyebrow: t.progressCertificateEyebrow,
      recipientName: displayName,
      bodyLine: '',
      subjectLine: t.progressCertificateBodyLine(snapshot.lessonsCompleted),
      dateLine: formatDate(snapshot.generatedAt),
      certificateId: `EXL-PROGRESS-${snapshot.generatedAt.slice(0, 10).replace(/-/g, '')}`,
      footer: 'EngineXLearn',
    });
    downloadDataUrl(dataUrl, 'progress-certificate.png');
  }

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <div className="mb-8">
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">{t.eyebrow}</span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">{t.pageTitle}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t.pageDescription}</p>
        </div>

        {/* Course Certificates */}
        <section className="mb-8">
          <h2 className="mb-3 font-display text-sm font-semibold tracking-tight">{t.courseCertificatesHeading}</h2>
          {certificates.length === 0 ? (
            <EmptyStateCard
              icon={Award}
              title={t.noCourseCertificatesYet}
              description={t.noCourseCertificatesDescription}
            />
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => {
                const title = locale === 'bn' && cert.courseTitleBn ? cert.courseTitleBn : cert.courseTitle;
                return (
                  <Card key={cert.courseSlug}>
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-semibold">{title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{t.completedOn(formatDate(cert.completedAt))}</p>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={() => handleDownloadCourseCertificate(cert)}>
                        <Download className="h-3.5 w-3.5" />
                        {t.downloadButton}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Skill Badges */}
        <section className="mb-8">
          <h2 className="mb-3 font-display text-sm font-semibold tracking-tight">{t.skillBadgesHeading}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {getAllBadgeIds().map((badgeId) => {
              const earned = earnedBadges.includes(badgeId);
              const badge = t.badges[badgeId];
              return (
                <div
                  key={badgeId}
                  className={`rounded-md border p-3 text-center ${
                    earned ? 'border-steel-400/60 bg-steel-500/5' : 'border-border opacity-40'
                  }`}
                >
                  <Award className={`mx-auto h-5 w-5 ${earned ? 'text-steel-500' : 'text-muted-foreground'}`} />
                  <p className="mt-1.5 text-xs font-semibold leading-snug">{badge.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{badge.description}</p>
                </div>
              );
            })}
          </div>
          {earnedBadges.length === 0 && <p className="mt-3 text-xs text-muted-foreground">{t.noBadgesYetNote}</p>}
        </section>

        {/* Progress Certificate */}
        <section className="mb-8">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.progressCertificateHeading}</h2>
          <p className="mb-3 text-xs text-muted-foreground">{t.progressCertificateDescription}</p>
          <Button className="gap-1.5" onClick={handleGenerateProgressCertificate}>
            <Download className="h-4 w-4" />
            {t.generateProgressCertificate}
          </Button>
        </section>

        <Link
          href="/certificates/verify"
          className="inline-flex items-center gap-1.5 text-sm text-steel-500 underline-offset-2 hover:underline"
        >
          <ShieldCheck className="h-4 w-4" />
          {t.verifyLinkText}
        </Link>
      </main>
    </AppShell>
  );
}
