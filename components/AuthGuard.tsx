'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/firebase';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push('/login');
    }
  }, [user, loading, isConfigured, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // If Firebase is not configured, allow access (dev mode)
  if (!isConfigured) {
    return <>{children}</>;
  }

  // If not authenticated, show nothing while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}
