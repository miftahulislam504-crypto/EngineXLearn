'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ID_TOKEN_COOKIE = 'id_token';

/**
 * Mirrors the Firebase ID token into a (non-httpOnly) cookie so Server
 * Components can read it — see lib/current-user.ts, which verifies it
 * with lib/verify-id-token.ts (no service account / admin key needed).
 * `onIdTokenChanged` below re-fires whenever Firebase silently refreshes
 * the token (about once an hour), so the cookie never goes stale while
 * a tab stays open.
 */
function setIdTokenCookie(idToken: string) {
  // Firebase ID tokens are valid for 1 hour; give the cookie a little
  // headroom past that so a near-expiry token is still readable
  // server-side right up until Firebase itself would reject it.
  const maxAgeSeconds = 60 * 65;
  document.cookie = `${ID_TOKEN_COOKIE}=${idToken}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${
    location.protocol === 'https:' ? '; Secure' : ''
  }`;
}

function clearIdTokenCookie() {
  document.cookie = `${ID_TOKEN_COOKIE}=; path=/; max-age=0`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Keeps the cookie in sync on initial load and on Firebase's
    // automatic hourly token refresh — not just at sign-in.
    const unsubscribeToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setIdTokenCookie(idToken);
      } else {
        clearIdTokenCookie();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    setIdTokenCookie(await credential.user.getIdToken());
  };

  const signUp = async (email: string, password: string, name: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
    setIdTokenCookie(await credential.user.getIdToken());
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    setIdTokenCookie(await credential.user.getIdToken());
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    clearIdTokenCookie();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
