import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

/**
 * Firebase Admin — server-only. Never import this file from a Client Component.
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * in your server environment (see .env.example). These are NOT prefixed with
 * NEXT_PUBLIC_ because they must stay server-side only.
 */
function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const adminAuth: Auth = getAuth(getAdminApp());
