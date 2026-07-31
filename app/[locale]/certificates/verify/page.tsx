'use client';

import { useState } from 'react';
import { Link } from '@/components/i18n/link';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import { verifyCertificateId, type CertificateVerifyResult } from '@/lib/progress/certificates';

export default function VerifyCertificatePage() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.certificates;

  const [input, setInput] = useState('');
  const [result, setResult] = useState<CertificateVerifyResult | null>(null);

  function handleCheck() {
    if (!input.trim()) return;
    setResult(verifyCertificateId(input));
  }

  function formatDatePart(datePart: string | null): string {
    if (!datePart || datePart.length !== 8) return datePart ?? '';
    const year = datePart.slice(0, 4);
    const month = datePart.slice(4, 6);
    const day = datePart.slice(6, 8);
    const date = new Date(`${year}-${month}-${day}`);
    if (Number.isNaN(date.getTime())) return datePart;
    return date.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <AppShell>
      <main className="container max-w-md py-10 md:py-14">
        <Link
          href="/certificates"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.backToCertificates}
        </Link>

        <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight">{t.verifyPageTitle}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{t.verifyPageDescription}</p>

        <div className="mb-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.verifyInputPlaceholder}
            className="font-mono text-sm"
          />
          <Button onClick={handleCheck}>{t.verifyButton}</Button>
        </div>

        {result && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                {result.wellFormed ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-steel-500" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {result.wellFormed ? t.verifyResultWellFormed : t.verifyResultNotWellFormed}
                  </p>
                  {result.wellFormed && result.matchedCourse && (
                    <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      <p>
                        {t.verifyResultCourse(
                          locale === 'bn' && result.matchedCourse.titleBn
                            ? result.matchedCourse.titleBn
                            : result.matchedCourse.title
                        )}
                      </p>
                      <p>{t.verifyResultDate(formatDatePart(result.datePart))}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs leading-relaxed text-muted-foreground">{t.verifyHonestNote}</p>
      </main>
    </AppShell>
  );
}
