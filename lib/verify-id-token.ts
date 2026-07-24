import { importX509, jwtVerify, type JWTPayload } from 'jose';

/**
 * Verifies Firebase Auth ID tokens without the Admin SDK — so no service
 * account / private key is needed. Firebase signs ID tokens with RS256
 * keys published as X.509 certs at a well-known Google URL; we fetch
 * those, pick the one matching the token's `kid`, and verify the JWT
 * against it directly. Same signature-verification guarantee as
 * `admin.auth().verifyIdToken()`, just without provisioning a key.
 *
 * Constraints checked (per Firebase's own spec for third-party
 * verification — https://firebase.google.com/docs/auth/admin/verify-id-tokens):
 *   iss: https://securetoken.google.com/<projectId>
 *   aud: <projectId>
 *   alg: RS256
 *   exp/iat: standard JWT expiry, checked by jose automatically
 */

const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let cachedCerts: Record<string, string> | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — Google rotates these infrequently

async function getCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cachedCerts && now - cachedAt < CACHE_TTL_MS) {
    return cachedCerts;
  }
  const res = await fetch(CERTS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch Firebase public certs: ${res.status}`);
  }
  cachedCerts = (await res.json()) as Record<string, string>;
  cachedAt = now;
  return cachedCerts;
}

export interface VerifiedFirebaseToken extends JWTPayload {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

/**
 * Returns the verified token payload, or null if the token is missing,
 * malformed, expired, or fails signature/claim verification. Never throws.
 */
export async function verifyFirebaseIdToken(
  idToken: string | undefined | null
): Promise<VerifiedFirebaseToken | null> {
  if (!idToken || !projectId) return null;

  try {
    const certs = await getCerts();

    // Peek at the unverified header to find which cert (kid) signed this token
    const [headerB64] = idToken.split('.');
    const header = JSON.parse(Buffer.from(headerB64, 'base64').toString('utf8'));
    const kid = header.kid as string | undefined;
    const cert = kid ? certs[kid] : undefined;
    if (!cert) return null;

    const publicKey = await importX509(cert, 'RS256');

    const { payload } = await jwtVerify(idToken, publicKey, {
      algorithms: ['RS256'],
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    if (!payload.sub) return null;

    return { ...payload, uid: payload.sub } as VerifiedFirebaseToken;
  } catch {
    // Expired, malformed, wrong signature, wrong issuer/audience, etc.
    return null;
  }
}
