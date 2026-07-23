import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

/**
 * Exchanges a Firebase ID token (obtained client-side after sign-in) for an
 * httpOnly session cookie that Server Components can read via
 * lib/current-user.ts. The client calls this right after signIn/signUp
 * succeeds — see lib/auth-context.tsx.
 *
 * Session length: 5 days, matching Firebase's session cookie maximum.
 */

const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken || typeof idToken !== 'string') {
    return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
  }

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS_MS,
    });

    const response = NextResponse.json({ status: 'ok' });
    response.cookies.set('session', sessionCookie, {
      maxAge: FIVE_DAYS_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    return response;
  } catch (error) {
    console.error('Failed to create session cookie:', error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'ok' });
  response.cookies.delete('session');
  return response;
}
