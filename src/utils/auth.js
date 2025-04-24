// src/utils/auth.js
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useAuth(requireAuth = true) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !session) {
      router.push('/login');
    }
  }, [loading, session, requireAuth, router]);

  return { session, loading };
}

export function useProtectedRoute() {
  useAuth(true);
}

// Export signOut function if you need it elsewhere
export const signOut = () => nextAuthSignOut({ callbackUrl: '/login' });