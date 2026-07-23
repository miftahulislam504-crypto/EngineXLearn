import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';
import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';

/**
 * Server-only. Verifies the httpOnly `session` cookie (set in
 * app/api/auth/session/route.ts after Firebase sign-in) and returns the
 * matching Prisma `User` row — the relational mirror keyed by Firebase
 * UID, used for progress/enrollment/community joins. Returns null when
 * there's no session, or when it's invalid/expired.
 */
export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    return user;
  } catch {
    // Expired, revoked, or malformed session cookie
    return null;
  }
}
