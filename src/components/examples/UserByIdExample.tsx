import React, { useState } from 'react';
import { useUserById, useCurrentUserById, useAuth } from '@/hooks/useAuthQueries';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';

export function UserByIdExample() {
  const [userId, setUserId] = useState('');
  const { user: currentUser, isAuthenticated } = useAuth();
  
  // Hook pour récupérer un utilisateur par ID spécifique
  const { 
    data: userById, 
    isLoading: isLoadingUserById, 
    error: errorUserById,
    refetch: refetchUserById 
  } = useUserById(userId);
  
  // Hook pour récupérer l'utilisateur connecté par son ID (depuis localStorage)
  const { 
    data: currentUserById, 
    isLoading: isLoadingCurrentUserById, 
    error: errorCurrentUserById,
    refetch: refetchCurrentUserById 
  } = useCurrentUserById();

  const handleSearchUser = () => {
    if (userId.trim()) {
      refetchUserById();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Exemple de récupération d&apos;utilisateur par ID</h2>
      
      {/* Section utilisateur connecté */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Utilisateur connecté</h3>
        {!isAuthenticated ? (
          <p className="text-gray-600">Aucun utilisateur connecté</p>
        ) : (
          <div className="space-y-2">
            <p><strong>ID:</strong> {currentUser?.id}</p>
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>Nom:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
            <p><strong>Rôle:</strong> {currentUser?.role}</p>
          </div>
        )}
      </Card>

      {/* Section récupération par ID depuis localStorage */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Utilisateur connecté par ID (localStorage)</h3>
        {isLoadingCurrentUserById ? (
          <Loading />
        ) : errorCurrentUserById ? (
          <p className="text-red-600">Erreur: {errorCurrentUserById.message}</p>
        ) : currentUserById ? (
          <div className="space-y-2">
            <p><strong>ID:</strong> {currentUserById.id}</p>
            <p><strong>Email:</strong> {currentUserById.email}</p>
            <p><strong>Nom:</strong> {currentUserById.firstName} {currentUserById.lastName}</p>
            <p><strong>Rôle:</strong> {currentUserById.role}</p>
            <Button onClick={() => refetchCurrentUserById()} className="mt-2">
              Actualiser
            </Button>
          </div>
        ) : (
          <p className="text-gray-600">Aucun utilisateur trouvé</p>
        )}
      </Card>

      {/* Section recherche par ID spécifique */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rechercher un utilisateur par ID</h3>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Entrez l'ID de l'utilisateur"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleSearchUser}
            disabled={!userId.trim() || isLoadingUserById}
          >
            {isLoadingUserById ? 'Recherche...' : 'Rechercher'}
          </Button>
        </div>
        
        {isLoadingUserById ? (
          <Loading />
        ) : errorUserById ? (
          <p className="text-red-600">Erreur: {errorUserById.message}</p>
        ) : userById ? (
          <div className="space-y-2">
            <p><strong>ID:</strong> {userById.id}</p>
            <p><strong>Email:</strong> {userById.email}</p>
            <p><strong>Nom:</strong> {userById.firstName} {userById.lastName}</p>
            <p><strong>Nom d&apos;utilisateur:</strong> {userById.username}</p>
            <p><strong>Rôle:</strong> {userById.role}</p>
            <p><strong>Statut:</strong> {userById.status}</p>
            <p><strong>Vérifié:</strong> {userById.isVerified ? 'Oui' : 'Non'}</p>
            <p><strong>Date de création:</strong> {userById.createdAt ? new Date(userById.createdAt).toLocaleDateString() : 'Non défini'}</p>
          </div>
        ) : userId && (
          <p className="text-gray-600">Aucun utilisateur trouvé avec cet ID</p>
        )}
      </Card>

      {/* Section informations sur le localStorage */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informations localStorage</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Auth Token:</strong> {localStorage.getItem('auth_token') ? 'Présent' : 'Absent'}</p>
          <p><strong>Refresh Token:</strong> {localStorage.getItem('refresh_token') ? 'Présent' : 'Absent'}</p>
          <p><strong>Current User ID:</strong> {localStorage.getItem('current_user_id') || 'Non défini'}</p>
        </div>
      </Card>
    </div>
  );
} 