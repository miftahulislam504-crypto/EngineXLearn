import { Space_Grotesk, Inter, JetBrains_Mono, Hind_Siliguri } from 'next/font/google';
import './globals.css';

/**
 * The single root layout — owns <html>/<body> and font loading, which
 * Next.js only allows one layout in the tree to do. Locale-specific
 * concerns (dictionary provider, AuthProvider) live one level down in
 * app/[locale]/layout.tsx — but `lang` has to be set here, since it's an
 * attribute on <html> itself.
 *
 * Next.js layouts receive `params` matching every dynamic segment in the
 * matched route, including segments defined by a child layout/page (not
 * just ones the layout file itself declares) — so this root layout can
 * read the [locale] segment even though [locale] is a folder one level
 * below it, without needing a client-side effect or a second render pass.
 */

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600'],
  variable: '--font-bengali',
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  // Falls back to 'en' for any route that somehow renders without a
  // resolved [locale] segment (shouldn't happen once middleware.ts is in
  // place, but a missing/invalid lang attribute is a worse failure mode
  // than defaulting it, so this stays defensive rather than throwing).
  const lang = params?.locale === 'bn' ? 'bn' : 'en';

  return (
    <html
      lang={lang}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${hindSiliguri.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
