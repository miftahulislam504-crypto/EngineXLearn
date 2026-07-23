import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Search (Part 21) — intentionally NOT a working feature in this
 * build. Every other Search System component (Smart/Topic/Course/
 * Formula/Engineering Term Search) is deterministic — real data,
 * real ranking logic, fully verifiable offline. Natural-language AI
 * search needs a live LLM API call this environment has no access to
 * and, just as importantly, no way to test or verify — shipping a
 * response here that merely *looks* like it works would be worse than
 * shipping nothing, since a wrong or hallucinated "AI search result"
 * actively misleads a learner rather than just being absent.
 *
 * To wire this up for real:
 *   1. Add an API key for your chosen provider (Anthropic, OpenAI, etc.)
 *      to your environment variables.
 *   2. Replace the body of this handler with a real call — e.g. send
 *      the query plus a short list of candidate results from
 *      `unifiedSearch()` (lib/queries/search.ts) as context, and ask
 *      the model to explain/rank them in natural language, rather than
 *      asking it to invent results from nothing.
 *   3. Update the frontend at app/[locale]/search/page.tsx to call this
 *      route and render its response — the "AI Search not configured"
 *      notice there is the one thing to remove once this is real.
 */
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      status: 'not_configured',
      message:
        'AI Search requires an LLM API key to be configured in this deployment. See the comment in this route file for integration steps.',
    },
    { status: 501 }
  );
}
