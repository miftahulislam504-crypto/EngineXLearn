'use client';

import { useState, type FormEvent } from 'react';
import { Link } from '@/components/i18n/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/layout/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/ui/google-icon';
import { useAuth } from '@/lib/auth-context';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import type { Dictionary } from '@/lib/i18n/dictionary-type';

export default function SignupPage() {
  const router = useRouter();
  const locale = useLocale();
  const dict = useDictionary();
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(dict.auth.errorPasswordLength);
      return;
    }

    setSubmitting(true);
    try {
      await signUp(email, password, name);
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError(
        err instanceof Error ? readableAuthError(err.message, dict) : dict.auth.errorGeneric
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError(dict.auth.errorGoogleFailed);
    }
  };

  return (
    <AuthShell
      title={dict.auth.createAccount}
      description={dict.auth.signupDescription}
      footer={
        <>
          {dict.auth.haveAccount}{' '}
          <Link href="/login" className="font-medium text-accent hover:underline">
            {dict.auth.logIn}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">{dict.auth.fullName}</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.auth.fullNamePlaceholder}
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{dict.auth.email}</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.auth.emailPlaceholder}
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{dict.auth.password}</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={dict.auth.passwordPlaceholderNew}
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" variant="accent" disabled={submitting}>
          {submitting ? dict.auth.creatingAccount : dict.auth.createAccount}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono text-xs text-muted-foreground">{dict.auth.or}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={handleGoogle}>
        <GoogleIcon />
        {dict.auth.continueWithGoogle}
      </Button>
    </AuthShell>
  );
}

function readableAuthError(message: string, dict: Dictionary): string {
  if (message.includes('auth/email-already-in-use')) {
    return dict.auth.errorEmailInUse;
  }
  if (message.includes('auth/weak-password')) {
    return dict.auth.errorWeakPassword;
  }
  if (message.includes('auth/invalid-email')) {
    return dict.auth.errorInvalidEmail;
  }
  return dict.auth.errorGeneric;
}
