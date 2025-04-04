'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../shared/lib/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!user) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
} 