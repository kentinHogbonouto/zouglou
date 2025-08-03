'use client';

import { useAuth } from '@/hooks/useAuth';
import { RBAC, SYSTEM_PERMISSIONS } from '@/lib/rbac';
import { LoadingPage } from '@/components/ui/Loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requiredRoles = [],
  fallback 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">
              Accès refusé
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push('/login')} className="w-full">
                Se connecter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rbac = new RBAC(user);
  
  if (requiredRoles.length > 0 && !rbac.hasAnyRole(requiredRoles)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">
              Permissions insuffisantes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Vous n'avez pas les rôles nécessaires pour accéder à cette page.
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Retour au dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredPermissions.length > 0 && !rbac.hasAnyPermission(requiredPermissions)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">
              Permissions insuffisantes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Retour au dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      requiredRoles={['admin', 'super_admin']}
      requiredPermissions={[SYSTEM_PERMISSIONS.SYSTEM_MANAGE]}
    >
      {children}
    </ProtectedRoute>
  );
}

export function ArtistRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      requiredRoles={['artist', 'admin', 'super_admin']}
      requiredPermissions={[SYSTEM_PERMISSIONS.CONTENT_CREATE]}
    >
      {children}
    </ProtectedRoute>
  );
}

export function ModeratorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      requiredRoles={['moderator', 'admin', 'super_admin']}
      requiredPermissions={[SYSTEM_PERMISSIONS.CONTENT_MODERATE]}
    >
      {children}
    </ProtectedRoute>
  );
} 