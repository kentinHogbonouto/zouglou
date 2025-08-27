'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '../ui/Loading';

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AuthLayoutWrapper({ children }: AuthLayoutWrapperProps) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      const redirectPath = `/dashboard/${user.default_role === 'artist' ? 'artist' : user.default_role === 'admin' || user.role === 'super-admin' ? 'admin' : 'user'}`;
      redirect(redirectPath);
    }
  }, [user, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingPage />;
  }

  // If user is authenticated, don't render children (redirect will happen)
  if (user) {
    return null;
  }

  // If user is not authenticated, render the auth pages
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
