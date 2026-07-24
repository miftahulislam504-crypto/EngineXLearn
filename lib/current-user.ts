import { cookies } from 'next/headers';
import { verifyFirebaseIdToken } from '@/lib/verify-id-token';
import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';

/**
 * Server-only. Reads the Firebase ID token from the `id_token` cookie
 * (set client-side in lib/auth-context.tsx after sign-in — see the
 * comment there), verifies it against Google's public certs, and
 * returns the matching Prisma `User` row — the relational mirror keyed
 * by Firebase UID, used for progress/enrollment/community joins.
 *
 * The mirror row is created on first sight (upsert) since sign-up only
 * creates the Firebase Auth user, not the Prisma row.
 *
 * Returns null when there's no token, or it's invalid/expired.
 */
export async function getCurrentUser(): Promise<User | null> {
  const idToken = cookies().get('id_token')?.value;
  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded) return null;

  const user = await prisma.user.upsert({
    where: { firebaseUid: decoded.uid },
    update: {
      // Keep the mirror row's denormalized display fields fresh
      email: decoded.email ?? undefined,
      displayName: decoded.name ?? undefined,
      photoURL: decoded.picture ?? undefined,
    },
    create: {
      firebaseUid: decoded.uid,
      email: decoded.email ?? `${decoded.uid}@unknown.local`,
      displayName: decoded.name ?? null,
      photoURL: decoded.picture ?? null,
    },
  });

  return user;
}
