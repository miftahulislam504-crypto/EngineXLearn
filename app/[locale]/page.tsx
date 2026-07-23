'use client';

import {
  BookOpen,
  HardHat,
  FlaskConical,
  Wrench,
  Users,
  Newspaper,
  Award,
  Sparkles,
} from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Hero } from '@/components/home/hero';
import { SectionShell } from '@/components/home/section-shell';
import { PlaceholderGrid } from '@/components/home/placeholder-grid';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export default function HomePage() {
  const dict = useDictionary();
  const c = dict.home.cards;

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        {/* Featured Courses — blueprint Part 2 */}
        <SectionShell
          eyebrow={dict.home.coursesEyebrow}
          title={dict.home.coursesTitle}
          description={dict.home.coursesDescription}
        >
          <PlaceholderGrid
            items={[
              { icon: BookOpen, title: c.structuralAnalysisTitle, description: c.coursesLandHere },
              { icon: BookOpen, title: c.soilMechanicsTitle, description: c.coursesLandHere },
              { icon: BookOpen, title: c.rccDesignTitle, description: c.coursesLandHere },
            ]}
          />
        </SectionShell>

        {/* Practical Engineering Highlights — blueprint Part 2 / Part 5 */}
        <SectionShell
          eyebrow={dict.home.practicalEyebrow}
          title={dict.home.practicalTitle}
          description={dict.home.practicalDescription}
        >
          <PlaceholderGrid
            items={[
              { icon: HardHat, title: c.siteWorkTitle, description: c.siteWorkDesc },
              { icon: HardHat, title: c.reinforcementTitle, description: c.reinforcementDesc },
              { icon: HardHat, title: c.concreteTechTitle, description: c.concreteTechDesc },
            ]}
            columns={3}
          />
        </SectionShell>

        {/* Experiment & Lab preview — blueprint Part 7 */}
        <SectionShell
          eyebrow={dict.home.labEyebrow}
          title={dict.home.labTitle}
          description={dict.home.labDescription}
        >
          <PlaceholderGrid
            items={[
              { icon: FlaskConical, title: c.concreteLabTitle, description: c.concreteLabDesc },
              { icon: FlaskConical, title: c.soilLabTitle, description: c.soilLabDesc },
            ]}
            columns={2}
          />
        </SectionShell>

        {/* Engineering Tools preview — blueprint Part 12 */}
        <SectionShell
          eyebrow={dict.home.toolsEyebrow}
          title={dict.home.toolsTitle}
          description={dict.home.toolsDescription}
        >
          <PlaceholderGrid
            items={[
              { icon: Wrench, title: c.steelWeightCalcTitle, description: c.toolsShipLater },
              { icon: Wrench, title: c.concreteCalcTitle, description: c.toolsShipLater },
              { icon: Wrench, title: c.loadCalcTitle, description: c.toolsShipLater },
              { icon: Wrench, title: c.soilBearingCalcTitle, description: c.toolsShipLater },
            ]}
            columns={4}
          />
        </SectionShell>

        {/* AI Assistant preview — blueprint Part 13 */}
        <SectionShell
          eyebrow={dict.home.aiEyebrow}
          title={dict.home.aiTitle}
          description={dict.home.aiDescription}
        >
          <PlaceholderGrid
            items={[
              { icon: Sparkles, title: c.aiTutorTitle, description: c.aiShipsLater },
              { icon: Sparkles, title: c.aiProblemSolverTitle, description: c.aiShipsLater },
            ]}
            columns={2}
          />
        </SectionShell>

        {/* Community + News — blueprint Part 2 / Part 15 */}
        <SectionShell
          eyebrow={dict.home.communityEyebrow}
          title={dict.home.communityTitle}
          description={dict.home.communityDescription}
        >
          <PlaceholderGrid
            items={[
              { icon: Users, title: c.discussionsTitle, description: c.communityShipsLater },
              { icon: Newspaper, title: c.engineeringNewsTitle, description: c.communityShipsLater },
              { icon: Award, title: c.topContributorsTitle, description: c.communityShipsLater },
            ]}
            columns={3}
          />
        </SectionShell>
      </main>
      <SiteFooter />
    </>
  );
}
